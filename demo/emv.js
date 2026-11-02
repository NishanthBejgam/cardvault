/*
 * emv.js - read a contactless bank card's number and expiry over NFC (2.0).
 *
 * The phone side is a small native plugin (CardReader) that only opens the
 * tag and passes APDUs through - Android IsoDep, iPhone Core NFC. Everything
 * that knows about EMV lives here, once, for both platforms:
 *
 *   SELECT PPSE -> the card's payment apps (AIDs)
 *   SELECT AID  -> its PDOL (what the card wants to hear before it talks)
 *   GET PROCESSING OPTIONS -> AFL (where its records are), sometimes Track 2
 *   READ RECORD for each AFL entry -> 5A number, 5F24 expiry, 57 Track 2
 *
 * What a card gives this way: the number and the expiry. Never the CVV (it is
 * not on the chip). The name (5F20) is usually blank or "CARDHOLDER/VISA" on
 * cards issued since ~2015; it is used only when it looks like a real name.
 * Nothing is written to the card and no payment is made - GPO with a zero
 * amount only asks the card which records to read.
 *
 *   read(send) -> { number, expiry, name, network }
 *     send(hex) -> Promise<hex>   one APDU out, response (incl. SW1 SW2) back
 */
(function (root) {
  "use strict";

  const hex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
  const bytesOf = (h) => {
    const s = String(h || "").replace(/[^0-9a-f]/gi, "");
    const out = new Uint8Array(s.length >> 1);
    for (let i = 0; i < out.length; i++) out[i] = parseInt(s.substr(i * 2, 2), 16);
    return out;
  };

  // ------------------------------------------------------------------ TLV --
  /** BER-TLV -> flat list of { tag, value } with constructed tags opened up,
   *  so a lookup never has to know which template a tag sits in. */
  function tlv(bytes, out) {
    out = out || [];
    let i = 0;
    while (i < bytes.length) {
      if (bytes[i] === 0x00 || bytes[i] === 0xff) { i++; continue; }    // padding
      let t = bytes[i++];
      const constructed = (t & 0x20) !== 0;
      let tag = t;
      if ((t & 0x1f) === 0x1f) {                                         // multi-byte tag
        do { t = bytes[i++]; tag = tag * 256 + t; } while (i < bytes.length && (t & 0x80));
      }
      if (i >= bytes.length) break;
      let len = bytes[i++];
      if (len & 0x80) {
        const n = len & 0x7f; len = 0;
        for (let k = 0; k < n; k++) len = len * 256 + bytes[i++];
      }
      if (i + len > bytes.length) break;                                 // truncated: stop, keep what we have
      const value = bytes.subarray(i, i + len);
      i += len;
      out.push({ tag: tag.toString(16).toUpperCase(), value });
      if (constructed) tlv(value, out);
    }
    return out;
  }
  const find = (list, tag) => { const e = list.find((x) => x.tag === tag); return e ? e.value : null; };

  // ----------------------------------------------------------------- APDU --
  async function apdu(send, h) {
    let r = bytesOf(await send(h));
    if (r.length < 2) throw new Error("no answer from the card");
    let sw1 = r[r.length - 2], sw2 = r[r.length - 1];
    // 6Cxx: "ask again expecting xx bytes". 61xx: "xx more bytes - GET RESPONSE".
    if (sw1 === 0x6c) {
      r = bytesOf(await send(h.slice(0, -2) + sw2.toString(16).padStart(2, "0").toUpperCase()));
      if (r.length < 2) throw new Error("no answer from the card");
      sw1 = r[r.length - 2]; sw2 = r[r.length - 1];
    }
    let data = Array.from(r.subarray(0, r.length - 2));
    for (let guard = 0; sw1 === 0x61 && guard < 8; guard++) {
      const more = bytesOf(await send("00C00000" + sw2.toString(16).padStart(2, "0").toUpperCase()));
      if (more.length < 2) break;
      data = data.concat(Array.from(more.subarray(0, more.length - 2)));
      sw1 = more[more.length - 2]; sw2 = more[more.length - 1];
    }
    return { sw: (sw1 << 8) | sw2, data: new Uint8Array(data) };
  }
  const select = (aidHex) => {
    const n = aidHex.length / 2;
    return "00A40400" + n.toString(16).padStart(2, "0").toUpperCase() + aidHex + "00";
  };

  // Payment apps tried directly when the card has no PPSE directory. Same
  // list as the iPhone's Info.plist select-identifiers (tools/harden-ios.js).
  const KNOWN_AIDS = [
    "A0000000031010", "A0000000032010", "A0000000033010",   // Visa credit/debit, Electron, V Pay
    "A0000000041010", "A0000000043060",                     // Mastercard, Maestro
    "A0000005241010",                                       // RuPay
    "A00000002501",                                         // American Express
    "A0000001523010", "A0000001524010",                     // Diners / Discover
    "A0000000651010",                                       // JCB
  ];
  const PPSE = "325041592E5359532E4444463031";             // "2PAY.SYS.DDF01"

  function networkOf(aid) {
    if (/^A000000003/.test(aid)) return "Visa";
    if (/^A000000004/.test(aid)) return "Mastercard";
    if (/^A000000524/.test(aid)) return "RuPay";
    if (/^A000000025/.test(aid)) return "Amex";
    if (/^A000000152/.test(aid)) return "Diners Club";
    return "";
  }

  /** Fill a PDOL with values a terminal would send. Unknown tags get zeros,
   *  which every card accepts. Amount zero, India, today, a random number. */
  function pdolData(pdol) {
    const d = new Date();
    const bcd = (n) => (Math.floor(n / 10) << 4) | (n % 10);
    const known = {
      "9F66": [0x36, 0x00, 0x40, 0x00],          // TTQ: contactless EMV, online capable, no CVM
      "9F02": [0, 0, 0, 0, 0, 0],                // amount authorised: 0
      "9F03": [0, 0, 0, 0, 0, 0],                // amount other: 0
      "9F1A": [0x03, 0x56],                      // terminal country: India
      "5F2A": [0x03, 0x56],                      // currency: INR
      "9A": [bcd(d.getFullYear() % 100), bcd(d.getMonth() + 1), bcd(d.getDate())],
      "9C": [0x00],                              // transaction type: purchase
      "95": [0, 0, 0, 0, 0],                     // TVR: all clear
      "9F35": [0x22],                            // terminal type
      "9F40": [0x60, 0x00, 0x00, 0x50, 0x01],    // additional terminal capabilities
      "9F33": [0xE0, 0x08, 0x08],                // terminal capabilities
    };
    const out = [];
    let i = 0;
    while (i < pdol.length) {
      let t = pdol[i++], tag = t;
      if ((t & 0x1f) === 0x1f) { do { t = pdol[i++]; tag = tag * 256 + t; } while (i < pdol.length && (t & 0x80)); }
      const len = pdol[i++];
      const key = tag.toString(16).toUpperCase();
      let v = key === "9F37" ? Array.from(crypto.getRandomValues(new Uint8Array(len))) : (known[key] || []);
      v = v.slice(0, len); while (v.length < len) v.push(0);
      out.push(...v);
    }
    return out;
  }

  // -------------------------------------------------------------- results --
  /** Track 2 equivalent (tag 57): PAN 'D' YYMM ... */
  function fromTrack2(v) {
    const s = hex(v);
    const m = /^(\d{12,19})D(\d{2})(\d{2})/.exec(s);
    return m ? { number: m[1], expiry: m[3] + "/" + m[2] } : null;
  }
  /** "SURNAME/FIRST" or "FIRST SURNAME", and nothing generic. */
  function realName(v) {
    if (!v) return "";
    let s = new TextDecoder("latin1").decode(v).replace(/[^A-Za-z /.']/g, "").trim();
    if (s.includes("/")) {
      const [last, first] = s.split("/").map((x) => x.trim());
      s = [first, last].filter(Boolean).join(" ");
    }
    s = s.replace(/\s+/g, " ").trim();
    if (s.length < 3 || /^(CARD ?HOLDER|CARDMEMBER|VALUED CUSTOMER|CUSTOMER|VISA|MASTERCARD|RUPAY|DEBIT|CREDIT)\b/i.test(s)) return "";
    if (/\b(VISA|MASTERCARD|RUPAY|CARDHOLDER)\b/i.test(s)) return "";
    if (s.split(" ").length < 2) return "";
    return s.toUpperCase();
  }

  function collect(list, acc) {
    const pan = find(list, "5A");
    if (pan && !acc.number) {
      const n = hex(pan).replace(/F+$/, "");
      if (/^\d{12,19}$/.test(n)) acc.number = n;
    }
    const exp = find(list, "5F24");
    if (exp && !acc.expiry) {
      const s = hex(exp);                       // YYMMDD
      if (/^\d{6}$/.test(s)) acc.expiry = s.slice(2, 4) + "/" + s.slice(0, 2);
    }
    const t2 = find(list, "57") || find(list, "9F6B");
    if (t2) {
      const r = fromTrack2(t2);
      if (r) { acc.number = acc.number || r.number; acc.expiry = acc.expiry || r.expiry; }
    }
    if (!acc.name) acc.name = realName(find(list, "5F20"));
  }
  const done = (acc) => acc.number && acc.expiry;

  // ------------------------------------------------------------------ read --
  async function read(send) {
    let aids = [];
    const ppse = await apdu(send, select(PPSE));
    if (ppse.sw === 0x9000) {
      const list = tlv(ppse.data);
      // Every 61 (directory entry) carries a 4F AID and an optional 87 priority.
      const entries = [];
      list.forEach((e) => { if (e.tag === "4F") entries.push(hex(e.value)); });
      aids = entries;
    }
    if (!aids.length) aids = KNOWN_AIDS.slice();

    let lastErr = null;
    for (const aid of aids) {
      const acc = { number: "", expiry: "", name: "", network: networkOf(aid) };
      try {
        const sel = await apdu(send, select(aid));
        if (sel.sw !== 0x9000) continue;
        const fci = tlv(sel.data);
        collect(fci, acc);
        const pdol = find(fci, "9F38");
        const body = pdol ? pdolData(pdol) : [];
        const gpoData = [0x83, body.length, ...body];
        const gpo = await apdu(send, "80A80000" + gpoData.length.toString(16).padStart(2, "0").toUpperCase() + hex(gpoData) + "00");
        let afl = null;
        if (gpo.sw === 0x9000) {
          const g = gpo.data;
          if (g[0] === 0x80) {                         // format 1: AIP(2) + AFL
            const l = tlv(g); const v = find(l, "80");
            if (v && v.length > 2) afl = v.subarray(2);
          } else {                                     // format 2: template 77
            const l = tlv(g);
            collect(l, acc);
            afl = find(l, "94");
          }
        }
        if (done(acc) && acc.name) return acc;
        // AFL: 4-byte entries - SFI<<3, first record, last record, offline count.
        const reads = [];
        if (afl && afl.length >= 4) {
          for (let i = 0; i + 3 < afl.length; i += 4) {
            const sfi = afl[i] >> 3;
            for (let r = afl[i + 1]; r <= afl[i + 2]; r++) reads.push([sfi, r]);
          }
        } else {
          // No AFL (GPO refused): try the usual places.
          for (let sfi = 1; sfi <= 4; sfi++) for (let r = 1; r <= 4; r++) reads.push([sfi, r]);
        }
        for (const [sfi, r] of reads) {
          const p2 = ((sfi << 3) | 4).toString(16).padStart(2, "0").toUpperCase();
          const rec = await apdu(send, "00B2" + r.toString(16).padStart(2, "0").toUpperCase() + p2 + "00");
          if (rec.sw === 0x9000) collect(tlv(rec.data), acc);
          if (done(acc) && acc.name) break;
        }
        if (done(acc)) return acc;
      } catch (e) { lastErr = e; }
    }
    throw lastErr || new Error("This card did not share its number");
  }

  root.emv = { read, _tlv: tlv, _fromTrack2: fromTrack2, _realName: realName, AIDS: KNOWN_AIDS, PPSE };
})(window.YCJ = window.YCJ || {});

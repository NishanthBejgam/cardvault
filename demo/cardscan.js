/*
 * cardscan.js - read a bank card through the phone's camera, on the phone.
 *
 * It reads FOUR things and nothing else: the card number, the expiry, the
 * CVV and the name printed on the card. They go into the Add card form for
 * the user to check; nothing is saved until they tap Save.
 *
 * Nothing is photographed, recorded or kept. Each camera frame lives in a
 * canvas for the length of one read and is then dropped - unlike Gift Card
 * Vault, there is no thumbnail of the last frame, because this one would be a
 * picture of a bank card. No network: the engine is Tesseract.js running
 * OFFLINE from web/vendor/ocr (the same files Gift Card Vault ships; see
 * tools/vendor-ocr.js). It loads when the camera is first turned on.
 *
 *   grab(video, view, flip) + readCanvas(c)   one frame -> text
 *   extract(text)                              text -> { number, expiry, cvv, name }
 */
(function (root) {
  "use strict";

  // ------------------------------------------------------------------ OCR --
  const BASE = "vendor/ocr/";
  let worker = null, loading = null;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src; s.onload = resolve; s.onerror = () => reject(new Error("Could not load " + src));
      document.head.appendChild(s);
    });
  }

  function simdSupported() {
    try {
      return WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3,
        2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11]));
    } catch (e) { return false; }
  }

  async function getWorker() {
    if (worker) return worker;
    if (!loading) {
      loading = (async () => {
        if (!window.Tesseract) await loadScript(BASE + "tesseract.min.js");
        // Every path local; see giftcard-vault/web/scan.js for why each of
        // these options is what it is (blob worker, relaxedsimd, gzip on
        // Android assets, IndexedDB cache).
        return window.Tesseract.createWorker("eng", 1, {
          workerPath: BASE + "worker.min.js",
          corePath: BASE + "core/" + (simdSupported() ? "tesseract-core-simd-lstm.wasm.js" : "tesseract-core-lstm.wasm.js"),
          langPath: BASE + "lang",
          gzip: false,
          cacheMethod: "none",
          workerBlobURL: false,
        });
      })();
    }
    try {
      worker = await loading;
      // Local (Sauvola) thresholding: a card held to a camera is a block of
      // one tone on a surround of another, and a global cut blacks it out.
      // 1.3.8: only characters a card actually carries. Stray symbols ("|",
      // "!") were read in place of digits and letters; without them the
      // engine has fewer wrong answers to choose from.
      await worker.setParameters({
        thresholding_method: "2",
        tessedit_char_whitelist: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz/-.' ",
      });
    } catch (e) { loading = null; worker = null; throw e; }
    return worker;
  }
  function preload() { return getWorker(); }

  /** Copy what the user SEES inside the card frame into a canvas: greyscale,
   *  a little contrast, inverted when the card is dark (most bank cards print
   *  light text on a dark face, which Tesseract reads as nothing). */
  function grab(video, view, flip) {
    const vw = video.videoWidth, vh = video.videoHeight;
    if (!vw || !vh) return null;
    const cw = view.clientWidth, ch = view.clientHeight;
    const s = Math.max(cw / vw, ch / vh);
    const sw = Math.min(vw, cw / s), sh = Math.min(vh, ch / s);
    const sx = (vw - sw) / 2, sy = (vh - sh) / 2;
    const k = Math.min(1, 1600 / Math.max(sw, sh)) * (Math.max(sw, sh) < 900 ? 1.6 : 1);
    const probe = document.createElement("canvas");
    probe.width = 48; probe.height = 30;
    const pc = probe.getContext("2d", { willReadFrequently: true });
    pc.filter = "grayscale(1)";
    pc.drawImage(video, sx + sw * 0.15, sy + sh * 0.15, sw * 0.7, sh * 0.7, 0, 0, 48, 30);
    const px = pc.getImageData(0, 0, 48, 30).data;
    let sum = 0;
    for (let i = 0; i < px.length; i += 4) sum += px[i];
    let invert = sum / (px.length / 4) < 120;
    if (flip) invert = !invert;
    const c = document.createElement("canvas");
    c.width = Math.round(sw * k); c.height = Math.round(sh * k);
    const ctx = c.getContext("2d");
    ctx.filter = "grayscale(1) " + (invert ? "invert(1) " : "") + "contrast(1.35)";
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, c.width, c.height);
    return c;
  }

  /** The signature strip on the BACK of a card, cut out on its own. The CVV
   *  is printed there, dark on a light strip - and with the dark card all
   *  round it Tesseract reads nothing (measured: the same strip read in full
   *  once cropped, not at all in the whole frame). Finds the widest band of
   *  light rows that is not the whole card, then the light columns inside it,
   *  and returns that interior on a white margin. null if there is no strip. */
  function grabStrip(video, view) {
    const vw = video.videoWidth, vh = video.videoHeight;
    if (!vw || !vh) return null;
    const cw = view.clientWidth, ch = view.clientHeight;
    const s = Math.max(cw / vw, ch / vh);
    const sw = Math.min(vw, cw / s), sh = Math.min(vh, ch / s);
    const sx = (vw - sw) / 2, sy = (vh - sh) / 2;
    const W = 160, H = 100;
    const p = document.createElement("canvas"); p.width = W; p.height = H;
    const pc = p.getContext("2d", { willReadFrequently: true });
    pc.filter = "grayscale(1)";
    pc.drawImage(video, sx, sy, sw, sh, 0, 0, W, H);
    const px = pc.getImageData(0, 0, W, H).data;
    const lum = (x, y) => px[(y * W + x) * 4];
    const light = (x, y) => lum(x, y) > 170;
    // rows that are at least a third light
    const rowOk = [];
    for (let y = 0; y < H; y++) { let n = 0; for (let x = 0; x < W; x++) if (light(x, y)) n++; rowOk.push(n > W * 0.33); }
    let best = null;
    for (let y = 0; y < H;) {
      if (!rowOk[y]) { y++; continue; }
      let e = y; while (e < H && rowOk[e]) e++;
      if (!best || e - y > best[1] - best[0]) best = [y, e];
      y = e;
    }
    if (!best) return null;
    const bh = best[1] - best[0];
    if (bh < H * 0.08 || bh > H * 0.5) return null;      // a hairline, or a light card, not a strip
    const mid = Math.floor((best[0] + best[1]) / 2);
    let x0 = 0, x1 = W - 1;
    while (x0 < W && !light(x0, mid)) x0++;
    while (x1 > x0 && !light(x1, mid)) x1--;
    if (x1 - x0 < W * 0.25) return null;
    // shrink inside the strip's own edge, then map back to the video
    const iy = bh * 0.12, ix = (x1 - x0) * 0.02;
    const fx = sw / W, fy = sh / H;
    const rx = sx + (x0 + ix) * fx, ry = sy + (best[0] + iy) * fy;
    const rw = (x1 - x0 - 2 * ix) * fx, rh = (bh - 2 * iy) * fy;
    const k = Math.max(1, 900 / rw), pad = 24;
    const c = document.createElement("canvas");
    c.width = Math.round(rw * k) + pad * 2; c.height = Math.round(rh * k) + pad * 2;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
    ctx.filter = "grayscale(1) contrast(1.4)";
    ctx.drawImage(video, rx, ry, rw, rh, pad, pad, c.width - pad * 2, c.height - pad * 2);
    return c;
  }

  // 1.3.8: a read that never answers is abandoned. Locking the vault (or the
  // OS suspending the engine) mid-read left the promise pending for good; the
  // scan loop then waited on it forever and the scanner "did nothing" until
  // the app was restarted - closed-test feedback. The engine is dropped and
  // reloads on the next frame.
  const READ_TIMEOUT_MS = 15000;
  async function readCanvas(canvas) {
    const w = await getWorker();
    let timer;
    const late = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error("read timed out")), READ_TIMEOUT_MS);
    });
    try {
      const r = await Promise.race([w.recognize(canvas), late]);
      return (r && r.data && r.data.text) || "";
    } catch (e) {
      if (worker === w) terminate();
      throw e;
    } finally { clearTimeout(timer); }
  }

  // ------------------------------------------------------ native reader --
  // 2.0: the phone's own text reader - Google ML Kit on Android, Apple Vision
  // on iPhone - through the CardReader plugin (tools/harden-android.js step 12,
  // tools/harden-ios.js step 10). Faster and far better on embossed digits and
  // names than Tesseract, which stays only as the fallback when the plugin is
  // absent (a desktop browser during development). On the phone, nothing
  // leaves it: the frame goes to the OS reader in memory and is dropped.
  //
  // 2.0 (20001/20004): reached two ways. Normally through
  // Capacitor.Plugins.CardReader; if the page never got that entry (seen on an
  // iPhone: no Tap button, Tesseract scans), by calling the native plugin by
  // name through Capacitor.nativePromise. probeReader() asks the plugin once
  // (nfcStatus); only a plugin that answered is used for scanning, so a phone
  // without it still falls back to Tesseract instead of failing every frame.
  const READER_METHODS = ["readText", "nfcStatus", "nfcStart", "nfcSend", "nfcStop", "nfcSettings"];
  const reader = { ok: null, via: "", why: "", nfc: null };
  function readerPlugin() {
    const C = window.Capacitor;
    const p = C && C.Plugins && C.Plugins.CardReader;
    if (p && typeof p.readText === "function") return p;
    if (!C || typeof C.nativePromise !== "function" || !(C.isNativePlatform && C.isNativePlatform())) return null;
    const o = { direct: true };
    READER_METHODS.forEach((m) => { o[m] = (opts) => C.nativePromise("CardReader", m, opts || {}); });
    return o;
  }
  let probing = null;
  function probeReader() {
    if (probing) return probing;
    probing = (async () => {
      const p = readerPlugin();
      if (!p) { reader.ok = false; reader.why = "not in this build"; return reader; }
      try {
        // A native side that never registered the plugin drops the call
        // without an answer (Capacitor iOS logs and returns), so do not wait
        // for ever: no answer in 4 s is "not reached".
        let t;
        const late = new Promise((_, reject) => { t = setTimeout(() => reject(new Error("no answer from the phone")), 4000); });
        try { reader.nfc = await Promise.race([p.nfcStatus(), late]); } finally { clearTimeout(t); }
        reader.ok = true; reader.via = p.direct ? "direct" : "bridge";
      } catch (e) {
        reader.ok = false; reader.why = String((e && (e.message || e.code)) || e).slice(0, 80);
      }
      return reader;
    })();
    return probing;
  }
  function nativeReader() { return reader.ok ? readerPlugin() : null; }

  /** The card frame as the user sees it, in colour (the native readers want
   *  the real picture, not a thresholded one). rotate=90 / 270 turns a card
   *  held sideways - a vertical card in the landscape frame - upright. */
  function grabColor(video, view, rotate) {
    const vw = video.videoWidth, vh = video.videoHeight;
    if (!vw || !vh) return null;
    const cw = view.clientWidth, ch = view.clientHeight;
    const s = Math.max(cw / vw, ch / vh);
    const sw = Math.min(vw, cw / s), sh = Math.min(vh, ch / s);
    const sx = (vw - sw) / 2, sy = (vh - sh) / 2;
    const k = Math.min(1, 1600 / Math.max(sw, sh));
    const w = Math.round(sw * k), h = Math.round(sh * k);
    const c = document.createElement("canvas");
    const side = rotate === 90 || rotate === 270;
    c.width = side ? h : w; c.height = side ? w : h;
    const ctx = c.getContext("2d");
    if (rotate === 90) { ctx.translate(h, 0); ctx.rotate(Math.PI / 2); }
    if (rotate === 270) { ctx.translate(0, w); ctx.rotate(-Math.PI / 2); }
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, w, h);
    return c;
  }

  /** canvas -> { text, lines: [{ text, x, y, w, h, conf }] } in canvas
   *  fractions (0..1), top to bottom. */
  async function readNative(canvas) {
    const p = nativeReader();
    const image = canvas.toDataURL("image/jpeg", 0.9).split(",")[1];
    let timer;
    const late = new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("read timed out")), READ_TIMEOUT_MS); });
    try {
      const r = await Promise.race([p.readText({ image }), late]);
      const W = r.width || canvas.width, H = r.height || canvas.height;
      const lines = (r.lines || []).map((l) => ({
        text: String(l.text || ""), x: l.x / W, y: l.y / H, w: l.w / W, h: l.h / H,
        conf: typeof l.conf === "number" ? l.conf : 1,
      })).sort((a, b) => a.y - b.y || a.x - b.x);
      return { text: lines.map((l) => l.text).join("\n"), lines };
    } finally { clearTimeout(timer); }
  }

  /** Drop the engine. Called on lock. */
  async function terminate() {
    const w = worker;
    worker = null; loading = null;
    if (w) { try { await w.terminate(); } catch (e) {} }
  }

  // ------------------------------------------------------------- extract --
  // Characters Tesseract confuses with digits on embossed and printed cards.
  const DIGITISH = { O: "0", o: "0", Q: "0", D: "0", I: "1", l: "1", i: "1", "|": "1", "!": "1",
                     Z: "2", z: "2", S: "5", s: "5", B: "8", G: "6", b: "6", T: "7", A: "4" };
  const toDigits = (s) => s.replace(/[OoQDIli|!ZzSsBGbTA]/g, (c) => DIGITISH[c]);

  /** The Luhn check every card number carries. A misread digit fails it, so a
   *  number that passes is almost certainly what is printed. */
  function luhn(d) {
    let sum = 0, alt = false;
    for (let i = d.length - 1; i >= 0; i--) {
      let n = d.charCodeAt(i) - 48;
      if (alt) { n *= 2; if (n > 9) n -= 9; }
      sum += n; alt = !alt;
    }
    return sum % 10 === 0;
  }

  /** 1.3.8 cross-check: the length a number must have for the network its
   *  first digits name. Luhn alone passes about one wrong read in ten; a
   *  wrong length for the network catches most of those. Unknown prefixes
   *  keep the old 13-19 rule. RuPay's 81/82 range was refused outright
   *  before (only 2-6 were allowed). */
  function shapeOk(d) {
    const n = d.length, p2 = +d.slice(0, 2), p4 = +d.slice(0, 4), p3 = d.slice(0, 3);
    if (p2 === 34 || p2 === 37) return n === 15;                                    // Amex
    if (d[0] === "4") return n === 13 || n === 16 || n === 19;                        // Visa
    if ((p2 >= 51 && p2 <= 55) || (p4 >= 2221 && p4 <= 2720)) return n === 16;      // Mastercard
    if (p2 === 36 || p2 === 38 || (p4 >= 3000 && p4 <= 3059)) return n >= 14 && n <= 16;  // Diners
    if (p2 === 60 || p2 === 65 || p2 === 81 || p2 === 82 || p3 === "508"
        || p3 === "353" || p3 === "356") return n === 16 || n === 19;                // RuPay
    if (d[0] === "8") return false;                // no other card range starts with 8
    return /^[2-6]/.test(d) && n >= 13 && n <= 19;
  }
  const isAmex = (d) => /^3[47]/.test(d || "");

  /** Card-number-shaped runs: 13-19 digits, in groups (4-4-4-4, 4-6-5 Amex,
   *  4-4-4-4-3) or solid. Only Luhn-valid ones count. */
  function numberFrom(lines) {
    const one = numberFromLines(lines);
    if (one) return one;
    // 2.0, vertical cards: the number is printed in two to four short rows
    // ("4321 5678" / "9012 3456"). Rows that are nothing but digit groups
    // are joined with their neighbours and read again.
    const groupy = (l) => { const d = (l.match(/\d/g) || []).length; return d >= 3 && d <= 10 && d >= l.replace(/\s/g, "").length * 0.8; };
    for (let i = 0; i < lines.length; i++) {
      if (!groupy(lines[i])) continue;
      let joined = lines[i];
      for (let j = i + 1; j < Math.min(lines.length, i + 4) && groupy(lines[j]); j++) {
        joined += " " + lines[j];
        const hit = numberFromLines([joined]);
        if (hit) return hit;
      }
    }
    return "";
  }
  function numberFromLines(lines) {
    for (const raw of lines) {
      const m = raw.match(/(?:[0-9OoQDIli|!ZzSsBGbTA]{3,6}[ \-.]{0,2}){2,5}[0-9OoQDIli|!ZzSsBGbTA]{2,6}/g) || [];
      for (const cand of m) {
        // Most of it must already be real digits - "SIGNATURE" is not a card
        // number just because S and I look like 5 and 1.
        const real = (cand.match(/\d/g) || []).length;
        const d = toDigits(cand).replace(/\D/g, "");
        if (real < d.length * 0.7) continue;
        // The whole run, or the run with one stray character trimmed off
        // either end (a border or a hologram edge read as a digit).
        const tries = [d, d.slice(1), d.slice(0, -1), d.slice(1, -1)];
        for (const s of tries) {
          if (s.length >= 13 && s.length <= 19 && shapeOk(s) && luhn(s)) return s;
        }
      }
    }
    return "";
  }

  /** MM/YY dates on the card. With "valid from" and "valid thru" both
   *  printed, the expiry is the LATER one. */
  function expiryFrom(text) {
    const re = /(?:^|[^0-9])(0[1-9]|1[0-2])\s*[\/\-\\|]\s*(\d{2}|\d{4})(?![0-9])/g;
    let best = null, m;
    // 1.3.8: an expiry is never in the past (a card being added is a live
    // one) and never more than 15 years out. This is what keeps a lone
    // "valid from" date, or a misread year, out of the form.
    const now = new Date();
    const nowKey = (now.getFullYear() % 100) * 100 + now.getMonth() + 1;
    // (No regex lookbehind anywhere in this file: iOS 15 Safari rejects it at
    // parse time, which would take the whole scanner down with it.)
    const t = toDigits(text);
    while ((m = re.exec(t))) {
      let yy = m[2].length === 4 ? m[2].slice(2) : m[2];
      const key = parseInt(yy, 10) * 100 + parseInt(m[1], 10);
      if (parseInt(yy, 10) < 15 || parseInt(yy, 10) > 49) continue;   // not a card date
      if (key < nowKey || key > nowKey + 1500) continue;
      if (!best || key > best.key) best = { key, v: m[1] + "/" + yy };
    }
    return best ? best.v : "";
  }

  /** CVV / CVC / CID. Labelled is certain; otherwise a lone 3-digit group on
   *  the back (it usually sits after the last four digits on the signature
   *  strip), which the app shows as "Check". Amex prints 4 on the front. */
  function cvvFrom(lines, number) {
    const tail = number ? number.slice(-4) : "";
    // 1.3.8 cross-check: Amex prints a 4-digit code, every other network 3.
    // Number not read yet: either.
    const lenOk = (v) => !number ? (v.length === 3 || v.length === 4) : v.length === (isAmex(number) ? 4 : 3);
    for (const l of lines) {
      const m = l.match(/\b(?:cvv2?|cvc2?|cid|security\s*code)\b\s*[:#\-]?\s*([0-9OoIlSB]{3,4})\b/i);
      if (m && lenOk(toDigits(m[1]))) return { v: toDigits(m[1]), how: "label" };
    }
    // Amex: the unlabelled guesses below look for 3 digits, never its code.
    if (isAmex(number)) return { v: "", how: "" };
    // "0830 418" - the last four digits, then the CVV: how most cards print
    // the signature strip. Certain when those four match the number already
    // read from the front; a "Check" guess otherwise.
    // Phone numbers ("Customer care 1800 202 6161") have the same shape, so
    // a line with any other digits, or with words on it, is not this.
    for (const l of lines) {
      const d = toDigits(l);
      const m = d.match(/(?:^|[^0-9])(\d{4})\s+(\d{3})(?![0-9])/);
      if (!m) continue;
      if (tail && m[1] === tail) return { v: m[2], how: "label" };
      if (!tail && (d.match(/\d/g) || []).length === 7 && l.replace(/[^A-Za-z]/g, "").length < 3) return { v: m[2], how: "guess" };
    }
    // A lone three-digit group on an otherwise wordless line.
    for (const l of lines) {
      if (l.replace(/[^A-Za-z]/g, "").length >= 4) continue;
      if (/\d{2}\s*[\/\-]\s*\d{2}/.test(l)) continue;              // a date
      const m = l.match(/(?:^|\s)(\d{3})(?:\s|$)/);
      if (m && (l.match(/\d/g) || []).length === 3) return { v: m[1], how: "guess" };
    }
    return { v: "", how: "" };
  }

  // Words printed on cards that are never someone's name.
  const NOT_NAME = /\b(VALID|THRU|THROUGH|FROM|UPTO|GOOD|MONTH|YEAR|EXPIR|MEMBER|SINCE|CARD|CREDIT|DEBIT|BANK|VISA|MASTER|MASTERCARD|RUPAY|AMEX|AMERICAN|EXPRESS|DINERS|CLUB|DISCOVER|MAESTRO|PLATINUM|SIGNATURE|INFINITE|INFINIA|WORLD|ELITE|PRIME|SELECT|CLASSIC|GOLD|TITANIUM|REWARDS?|CASHBACK|BUSINESS|CORPORATE|INTERNATIONAL|ELECTRONIC|USE|ONLY|AUTHORI[SZ]ED|SIGN|HOLDER|CUSTOMER|SERVICE|CALL|PROPERTY|ISSUED|CONTACTLESS|LTD|LIMITED|INDIA|HDFC|ICICI|AXIS|SBI|KOTAK|YES|IDFC|FIRST|INDUSIND|RBL|HSBC|CITI|STANDARD|CHARTERED|FEDERAL|BARODA|PUNJAB|CANARA|UNION|ONECARD|TATA|AMAZON|FLIPKART|PAY|MILLENNIA|REGALIA|MAGNUS|ATLAS|SAPPHIRO|CORAL|RUBYX|EMERALDE|LEGEND|PINNACLE|LIFESTYLE|SMART|SIMPLY|CLICK|SAVE|PRIVILEGE|PREFERRED|RESERVE|EDGE|ACE|NEO|MOMENTUM|NATIONAL|PNB|BOB|IDBI|BANDHAN|EQUITAS|SLICE|JUPITER|SCAPIA|UNI|SMALL|FINANCE|COOPERATIVE|GRAMIN|ULTIMATE|PREMIER|PRIORITY|PASS|LOUNGE|FUEL|TRAVEL|SHOPPING|MILES|VISTARA|INDIGO|IRCTC|BPCL|HPCL|IOCL|SWIGGY|MYNTRA|PAYTM|PHONEPE|GOOGLE|WORLDWIDE|PAYWAVE|PAYPASS|ELECTRON|DOMESTIC|GLOBAL|VIRTUAL|DIGITAL|METAL|VALUE|PLUS|ATM|PIN|TRANSFERABLE|FOUND|RETURN|PLEASE|WWW|COM)\b/;

  /** Does this one line pass as a printed name? The cleaned, upper-cased
   *  name, or "". */
  function nameLine(raw) {
    // 2.0: a digit anywhere on the line means it is not the name line
    // (it is "VALID THRU 08/29", a phone number, "MEMBER SINCE 19"...).
    if (/\d/.test(raw)) return "";
    const l = raw.replace(/[^A-Za-z .']/g, " ").replace(/\s+/g, " ").trim();
    if (l.length < 5 || l.length > 26) return "";
    const words = l.split(" ").filter((w) => w.replace(/[.']/g, "").length);
    if (words.length < 2 || words.length > 4) return "";
    // An initial is fine ("B NISHANTH", "NISHANTH B" - common on Indian
    // cards, refused before 1.3.8) when the other word is a real one.
    const lens = words.map((w) => w.replace(/[.']/g, "").length);
    if (words.length === 2 && lens.includes(1) && Math.max(...lens) < 3) return "";
    if (lens.every((n) => n === 1)) return "";
    if (Math.max(...lens) > 15) return "";                              // 2.0: no 16-letter "word"
    // 1.3.8: every word of three letters or more has a vowel - OCR noise
    // ("WXKRT", "TTNL") does not; names do.
    if (words.some((w) => w.replace(/[.']/g, "").length >= 3 && !/[AEIOUY]/i.test(w))) return "";
    // 2.0: nor five consonants in a row, nor one letter three times running.
    if (/[^AEIOUY .']{5}/i.test(l) || /([A-Z])\1\1/i.test(l)) return "";
    const up = l.toUpperCase();
    if (NOT_NAME.test(up)) return "";
    // 2.0: names are embossed or printed in capitals on every card; a line
    // that is mostly lower case is a slogan or a smear (was 75%).
    const caps = (l.match(/[A-Z]/g) || []).length / (l.match(/[A-Za-z]/g) || [1]).length;
    if (caps < 0.9) return "";
    // The raw line must be mostly letters too, not a smear of symbols.
    if (raw.replace(/[^A-Za-z]/g, "").length < raw.replace(/\s/g, "").length * 0.8) return "";
    return up;
  }

  /** Edit distance, for snapping a read to a name already in the vault. */
  function distance(a, b) {
    const m = a.length, n = b.length;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[n];
  }

  /** The name on the card. Candidates must pass nameLine(); then, when the
   *  reader gave positions (native readers do):
   *    - it sits BELOW the card number and in the lower part of the card
   *      (the bank and card names live at the top);
   *    - its letters are about the size of the number's (logos and fine
   *      print are not);
   *    - the reader was reasonably sure of it.
   *  The closest line under the number wins. Last, a read within a letter or
   *  two of a cardholder name already in the vault becomes that name - the
   *  family's names are the likeliest answer and are spelled right.
   *  -> { name, known } */
  function nameFrom(lines, geo) {
    geo = geo || {};
    const boxes = geo.boxes || null;
    const numBox = geo.numBox || null;
    let best = "", bestKey = Infinity;
    lines.forEach((raw, i) => {
      const up = nameLine(raw);
      if (!up) return;
      let key = -up.length;                                   // no positions: longest wins, as before
      const b = boxes && boxes[i];
      if (b) {
        // 2.0 (20004): Apple Vision rates in coarse steps (1, 0.5, 0.3) and a
        // clear name often gets 0.3; ML Kit is continuous. Only reads below
        // 0.25 are too unsure to use.
        if (b.conf < 0.25) return;
        const cy = b.y + b.h / 2;
        if (numBox) {
          if (b.y < numBox.y + numBox.h * 0.5) return;        // above (or on) the number
          if (b.h < numBox.h * 0.4 || b.h > numBox.h * 1.4) return;
          key = b.y - numBox.y;                               // nearest under the number
        } else {
          if (cy < 0.4) return;                               // top band: bank / card name
          key = 2 - cy;                                       // lower is likelier
        }
      }
      if (key < bestKey) { bestKey = key; best = up; }
    });
    if (!best) return { name: "", known: false };
    const known = (geo.knownNames || []).map((n) => String(n || "").toUpperCase().replace(/\s+/g, " ").trim()).filter(Boolean);
    let snap = "", snapD = Infinity;
    for (const k of known) {
      const d = distance(best, k);
      if (d < snapD) { snapD = d; snap = k; }
    }
    const tol = Math.max(1, Math.floor(best.length * 0.15));
    if (snap && snapD <= tol) best = snap;
    const nice = best.replace(/\b([A-Z])([A-Z']*)\b/g, (m, a, b) => a + b.toLowerCase());
    return { name: nice, known: !!snap && snapD <= tol };
  }

  /** text -> { number, expiry, cvv, name } plus how CVV was found.
   *  opts.boxes: the native reader's lines (same order as the text's lines),
   *  opts.knownNames: cardholder names already in the vault. */
  function extract(text, knownNumber, opts) {
    opts = opts || {};
    let lines, boxes = null;
    if (opts.boxes) { boxes = opts.boxes; lines = boxes.map((b) => b.text.trim()); }
    else lines = String(text || "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const number = numberFrom(lines);
    const expiry = expiryFrom(text);
    const cvv = cvvFrom(lines, number || knownNumber || "");
    // The number's own line, for the name's position checks.
    let numBox = null;
    if (boxes && number) {
      const tail = number.slice(-4);
      numBox = boxes.find((b) => toDigits(b.text).replace(/\D/g, "").indexOf(tail) >= 0) || null;
    }
    const nm = nameFrom(lines, { boxes, numBox, knownNames: opts.knownNames });
    return { number, expiry, cvv: cvv.v, cvvHow: cvv.how, name: nm.name, nameKnown: nm.known };
  }

  root.cardscan = { preload, grab, grabColor, grabStrip, readCanvas, readNative, nativeReader, readerPlugin, probeReader, reader,
                    terminate, extract, _luhn: luhn, _nameLine: nameLine };
})(window.YCJ = window.YCJ || {});

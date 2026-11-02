/*
 * api.js - Card Vault's local API.
 *
 * On Windows and macOS the front end talks to a Python HTTP server over
 * localhost. There is no server here, so this file answers the same routes,
 * with the same JSON, in the same order of checks - and app.js therefore did
 * not have to be rewritten to run on a phone. It still calls "/api/cards"; the
 * call is just resolved in-process now.
 *
 * Keeping the seam in exactly the same place has a second payoff: when the
 * desktop app gains an endpoint, the port is "implement this route here",
 * not "work out how the UI changed".
 *
 * The field normalisation below is a direct port of app.py's `_clean_field`,
 * `_normalize_card`, `_normalize_partial` and `_normalize_expiry`. It has to
 * match, because a card typed on the phone can end up in the PC's vault after
 * an export/import round trip, and a differently-normalised row would show up
 * there as a subtly wrong record rather than an obvious error.
 */

(function (root) {
  "use strict";

  // Single source of truth for the Add-card dropdown, same list and same
  // order as app.py's KNOWN_BANKS. app.js owns the actual colours.
  const KNOWN_BANKS = [
    "HDFC", "ICICI", "Axis", "SBI", "Kotak", "IndusInd", "IDFC", "Yes",
    "RBL", "AU", "Amex", "Citi", "HSBC", "StanChart", "Federal", "BoB",
    "PNB", "Canara", "Union", "BoI", "IDBI", "DBS", "Bajaj", "OneCard",
    "Equitas", "CUB", "Roar", "Slice", "Other",
  ];

  const TEXT_KEYS = ["bank", "card_name", "number", "holder", "expiry", "cvv",
                     "network", "variant", "notes",
                     // 1.3.0: added from the closed-test feedback. All three
                     // are plain strings on the card object, so a vault that
                     // carries them still opens on the desktop, which keeps
                     // unknown keys as-is.
                     "nickname", "kind", "relation"];

  // Card type. Anything that is not recognisably "debit" is a credit card -
  // including the empty string every pre-1.3.0 card has, so the filter has
  // exactly two buckets and no "unknown" third one.
  const KIND_DEBIT = /debit/i;

  const digits = (s) => String(s == null ? "" : s).replace(/\D/g, "");

  /** Read 'MM/YY', 'MM/YYYY', 'MM-YY', 'MMYY' etc. into 'MM/YY'. Anything
   *  unparseable is kept verbatim - the desktop does the same, on the view
   *  that a value the user typed is better than a value we invented. */
  function normalizeExpiry(s) {
    s = String(s == null ? "" : s).trim();
    if (!s) return "";
    let m = s.match(/^\s*(\d{1,2})\s*[/\-. ]\s*(\d{2,4})\s*$/);
    if (!m) m = s.match(/^\s*(\d{2})(\d{2})\s*$/);
    if (!m) return s;
    const mo = parseInt(m[1], 10);
    let yr = m[2];
    if (yr.length === 4) yr = yr.slice(2);
    if (mo >= 1 && mo <= 12) return String(mo).padStart(2, "0") + "/" + yr;
    return s;
  }

  function cleanField(key, value) {
    const v = String(value == null ? "" : value).trim();
    if (key === "number") return digits(v).slice(0, 19);   // up to a 19-digit PAN
    if (key === "cvv") return digits(v).slice(0, 4);
    if (key === "expiry") return normalizeExpiry(v);
    if (key === "holder") return v.toUpperCase();
    if (key === "bank") return v || "Other";
    if (key === "kind") return KIND_DEBIT.test(v) ? "debit" : "credit";
    if (key === "relation") return v.slice(0, 30) || "Self";
    if (key === "nickname") return v.slice(0, 40);
    return v;
  }

  function normalizeCard(c) {
    const out = {};
    for (const k of TEXT_KEYS) out[k] = cleanField(k, c[k] || "");
    out.addon = !!c.addon;
    // 2.0: two more on/off marks, both off unless the user turns them on.
    // A virtual card has no plastic; a dual card is one of two cards issued on
    // the same account (often a Visa/Mastercard with a RuPay twin for UPI).
    // Written only when on: a card saved by an older version stays exactly
    // as it was until the user actually turns one of these on.
    if (c.virtual) out.virtual = true;
    if (c.dual) out.dual = true;
    return out;
  }

  /** Only the keys actually supplied, so a partial update (e.g. archiving)
   *  never blanks a field it did not touch. */
  function normalizePartial(c) {
    const out = {};
    for (const k of Object.keys(c)) {
      out[k] = TEXT_KEYS.indexOf(k) >= 0 ? cleanField(k, c[k])
        : (k === "addon" || k === "virtual" || k === "dual") ? !!c[k] : c[k];
    }
    return out;
  }

  // --- the vault instance this app talks to -------------------------------
  const store = new root.Store("card-vault");
  const VAULT = new root.Vault(store);


  // Everything handed out of this module is a COPY.
  //
  // The desktop's Python server serialises its state into an HTTP response, so
  // the front end necessarily works on its own objects and has to write local
  // changes itself - which is exactly what app.js does:
  //
  //     await api.send('/api/cards/' + id, 'PUT', { addon: !card.addon });
  //     card.addon = !card.addon;
  //
  // When this in-process API returned VAULT.items directly, those were the
  // SAME objects, so the PUT already applied the change and the line after it
  // flipped the value straight back. The write reached the file correctly, so
  // the change only became visible after locking and unlocking - which is
  // precisely how it was reported from the device.
  //
  // Copying here restores the semantics app.js was written against, and rules
  // out the whole family of aliasing bugs where the UI mutates vault state
  // without going through save().
  const copy = (v) => JSON.parse(JSON.stringify(v));

  // --- routing ------------------------------------------------------------
  // Mirrors do_GET / do_POST / do_PUT / do_DELETE. Responses carry the same
  // keys as the server's, including the error shapes the UI already handles
  // ({error:"locked"} / {error:"wrong password"}).

  async function get(path) {
    if (path === "/api/licence") {
      // Kept only so any stray caller gets a sane answer. The store builds
      // carry no licence gate at all - see HANDOVER-ANDROID.md section 2 for
      // why a licence-code screen is the wrong thing to ship to Play/App
      // Store. `host_platform` is what suppresses the desktop Quit control.
      return { state: "ACTIVE", usable: true, read_only: false,
               message: "", machine_id: "", host_platform: platformName() };
    }
    if (path === "/api/status") {
      return { exists: await VAULT.exists(), unlocked: VAULT.unlocked, banks: KNOWN_BANKS };
    }
    if (path === "/api/cards") {
      if (!VAULT.unlocked) return { error: "locked" };
      return { cards: copy(VAULT.items) };
    }
    if (path === "/api/backups") {
      return { backups: await store.listBackups() };
    }
    return { error: "not found" };
  }

  async function send(path, method, body) {
    body = body || {};
    method = (method || "POST").toUpperCase();

    if (method === "POST" && path === "/api/unlock") {
      const pw = body.password || "";
      if (!pw) return { error: "password required" };
      if (!(await VAULT.exists())) {
        await VAULT.create(pw);
        return { ok: true, created: true, cards: copy(VAULT.items) };
      }
      if (await VAULT.unlock(pw)) return { ok: true, cards: copy(VAULT.items) };
      return { error: "wrong password" };
    }

    if (method === "POST" && path === "/api/lock") {
      VAULT.lock();
      return { ok: true };
    }

    if (method === "POST" && path === "/api/verify") {
      return { ok: await VAULT.verify(body.password || "") };
    }

    // --- everything below needs an unlocked vault, exactly as on the server
    if (!VAULT.unlocked) return { error: "locked" };

    if (method === "POST" && path === "/api/password") {
      const ok = await VAULT.changePassword(body.current || "", body.next || "");
      return ok ? { ok: true } : { error: "wrong password" };
    }

    if (method === "POST" && path === "/api/cards") {
      return { card: copy(await VAULT.add(normalizeCard(body))) };
    }

    if (method === "POST" && path === "/api/cards/bulk") {
      const rows = (body.cards || []).map(normalizeCard);
      const added = await VAULT.addMany(rows);
      return { added: copy(added), count: added.length };
    }

    if (path.indexOf("/api/cards/") === 0) {
      const id = path.split("/").pop();
      if (method === "PUT") {
        const card = await VAULT.update(id, normalizePartial(body));
        return card ? { card: copy(card) } : { error: "not found" };
      }
      if (method === "DELETE") {
        return { ok: await VAULT.remove(id) };
      }
    }

    // --- phone-only: moving the vault between devices ---------------------
    if (method === "POST" && path === "/api/export") {
      const bytes = await VAULT.exportBytes();
      if (!bytes) return { error: "nothing to export" };
      const name = "card-vault-" + root.storeHelpers.stamp() + ".dat";
      await root.mobile.shareFile(name, bytes, "Card Vault backup");
      return { ok: true, filename: name };
    }

    return { error: "not found" };
  }

  /** Import is not routed through send() because it needs the raw bytes and a
   *  password, and because a failed import must be reported precisely - "wrong
   *  password" and "not a vault file" are different problems for the user. */
  async function importVault(password, bytes, mode) {
    try {
      const res = await VAULT.importBytes(password, bytes, mode);
      return Object.assign({ ok: true }, res);
    } catch (e) {
      if (e.name === "InvalidToken") {
        return { ok: false, error: "That password does not open this file." };
      }
      if (e.message === "locked") {
        return { ok: false, error: "Unlock this vault before merging into it." };
      }
      return { ok: false, error: "That file is not a Card Vault backup." };
    }
  }

  function platformName() {
    if (window.Capacitor && window.Capacitor.getPlatform) return window.Capacitor.getPlatform();
    return "web";
  }

  root.api = { get, send };
  root.vault = VAULT;
  root.importVault = importVault;
  root.KNOWN_BANKS = KNOWN_BANKS;
})(window.YCJ = window.YCJ || {});

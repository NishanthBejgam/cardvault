/* =========================================================================
   Card Vault — My Cards.  Bank-first Material 3 dashboard.
   The tile shows card INFORMATION; the only per-bank artwork is a reusable,
   generic geometric illustration generated from the bank's theme — never a
   real payment-card render.
   ========================================================================= */

// ---- Bank identity: a reusable theme per bank (the ONLY thing that differs
// between banks). Each = a two-tone gradient + accent + a short glyph + an
// illustration seed. Adding a new bank is just one line here (and its name in
// KNOWN_BANKS on the server) — no artwork, no new CSS.
const BANKS = {
  "HDFC":     { glyph: "HD", a: "#0a3d7a", b: "#1256a8", accent: "#e7b53c", seed: 0 },
  "ICICI":    { glyph: "IC", a: "#b8531b", b: "#e8720f", accent: "#7a1f2b", seed: 1 },
  "Axis":     { glyph: "AX", a: "#7a1330", b: "#a51c46", accent: "#e0b64a", seed: 2 },
  "SBI":      { glyph: "SB", a: "#123c8a", b: "#1e63c9", accent: "#5fb0ff", seed: 3 },
  "Kotak":    { glyph: "KO", a: "#8f0f1a", b: "#d21f2b", accent: "#e0424a", seed: 6 },
  "IndusInd": { glyph: "IN", a: "#5a0f22", b: "#8a1c3a", accent: "#c9455f", seed: 8 },
  "IDFC":     { glyph: "ID", a: "#8a1020", b: "#c31b30", accent: "#f0a24a", seed: 4 },
  "Yes":      { glyph: "YB", a: "#0e3b8c", b: "#1f5fd0", accent: "#3fa0ff", seed: 7 },
  "RBL":      { glyph: "RB", a: "#8a0b20", b: "#c8102e", accent: "#f0a24a", seed: 5 },
  "AU":       { glyph: "AU", a: "#4a1553", b: "#7a2488", accent: "#e0a5ec", seed: 9 },
  "Amex":     { glyph: "AM", a: "#0b2447", b: "#16406e", accent: "#8fb3d9", seed: 3 },
  "Citi":     { glyph: "CI", a: "#003b7e", b: "#1a5fb4", accent: "#e30613", seed: 6 },
  "HSBC":     { glyph: "HS", a: "#a4000d", b: "#db0011", accent: "#ffd0d3", seed: 1 },
  "StanChart":{ glyph: "SC", a: "#005a9e", b: "#0072ce", accent: "#7ac143", seed: 2 },
  "Federal":  { glyph: "FE", a: "#003f78", b: "#00529b", accent: "#ffd200", seed: 7 },
  "BoB":      { glyph: "BB", a: "#b3450f", b: "#f04e23", accent: "#ffd08a", seed: 4 },
  "PNB":      { glyph: "PN", a: "#6e1633", b: "#951f45", accent: "#e0b64a", seed: 8 },
  "Canara":   { glyph: "CA", a: "#003c73", b: "#00539b", accent: "#ffd200", seed: 3 },
  "Union":    { glyph: "UB", a: "#a30d26", b: "#c8102e", accent: "#3fa0ff", seed: 0 },
  "BoI":      { glyph: "BI", a: "#b35414", b: "#f47920", accent: "#3fa0ff", seed: 5 },
  "IDBI":     { glyph: "IB", a: "#004f32", b: "#006f46", accent: "#7ad0a0", seed: 2 },
  "DBS":      { glyph: "DB", a: "#a80c12", b: "#ed1c24", accent: "#ff8b8f", seed: 6 },
  "Bajaj":    { glyph: "BF", a: "#0a3578", b: "#1257c4", accent: "#5fb0ff", seed: 9 },
  "OneCard":  { glyph: "1C", a: "#1a1a1f", b: "#3a3a44", accent: "#c9a24a", seed: 8 },
  "Equitas":  { glyph: "EQ", a: "#6e1422", b: "#a5223a", accent: "#e0a5b0", seed: 5 },
  "CUB":      { glyph: "CU", a: "#0a5a6e", b: "#0e7d96", accent: "#7ad0d8", seed: 2 },
  "Roar":     { glyph: "RO", a: "#1f3d34", b: "#2f6a58", accent: "#e0b64a", seed: 3 },
  "Slice":    { glyph: "SL", a: "#3b1a7a", b: "#6a2fd6", accent: "#c8a8ff", seed: 0 },
  "Other":    { glyph: "•",  a: "#2f3038", b: "#494a55", accent: "#9aa0b4", seed: 9 },
};
// ---- Distinct per-bank palette (shared by BOTH the My Cards tiles and the
// Relationship graph). Real bank brands cluster in reds/blues, which makes them
// hard to tell apart, so every bank gets a fixed, high-contrast hue instead.
// BANKS above still supplies each bank's glyph + illustration seed; only the
// colours come from here. Banks not listed (e.g. ones added later) hash to a
// slot deterministically, so a new bank still gets a distinct, repeatable hue.
const BANK_HUE = {
  "HDFC": "#2563eb", "ICICI": "#f97316", "Axis": "#e11d48", "SBI": "#0ea5e9",
  "Kotak": "#fb5a3c", "IndusInd": "#7c3aed", "IDFC": "#db2777", "Yes": "#6366f1",
  "RBL": "#b91c1c", "AU": "#9333ea", "Amex": "#1e3a8a", "Citi": "#38bdf8",
  "HSBC": "#be123c", "StanChart": "#0d9488", "Federal": "#16a34a", "BoB": "#ea580c",
  "PNB": "#c026d3", "Canara": "#d9a406", "Union": "#fb7185", "BoI": "#ca8a04",
  "IDBI": "#059669", "DBS": "#65a30d", "Bajaj": "#4338ca", "OneCard": "#4b5563",
  "Equitas": "#a21caf", "CUB": "#0891b2", "Roar": "#15803d", "Slice": "#8b3dff",
  "Other": "#64748b",
};
const BANK_HUE_FALLBACK = ["#2563eb", "#f97316", "#e11d48", "#0ea5e9", "#7c3aed",
  "#16a34a", "#db2777", "#ca8a04", "#0d9488", "#9333ea", "#ea580c", "#0891b2",
  "#b91c1c", "#6366f1"];
// Darken (amt<0) or lighten toward white (amt>0) a #rrggbb colour.
function shadeHex(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  if (amt < 0) { const fct = 1 + amt; r *= fct; g *= fct; b *= fct; }
  else { r += (255 - r) * amt; g += (255 - g) * amt; b += (255 - b) * amt; }
  const h = (x) => Math.round(x).toString(16).padStart(2, "0");
  return "#" + h(r) + h(g) + h(b);
}
function bankColors(name) {
  let base = BANK_HUE[name];
  if (!base) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
    base = BANK_HUE_FALLBACK[hash % BANK_HUE_FALLBACK.length];
  }
  return { a: shadeHex(base, -0.24), b: base, accent: shadeHex(base, 0.5) };
}
const bankMeta = (name) => {
  const src = BANKS[name];
  if (src) return { glyph: src.glyph, seed: src.seed, ...bankColors(name) };
  // A bank the user added (1.3.6): its own initials and a repeatable pattern.
  // Letters and digits only: the glyph goes into markup as-is (1.3.9).
  const words = String(name || "").replace(/[^\p{L}\p{N}\s]/gu, "").trim().split(/\s+/).filter(Boolean);
  const glyph = (words.length > 1 ? words[0][0] + words[1][0] : (words[0] || "•").slice(0, 2)).toUpperCase();
  let h = 0;
  for (let i = 0; i < String(name).length; i++) h = (h * 31 + String(name).charCodeAt(i)) >>> 0;
  return { glyph, seed: h % 10, ...bankColors(name || "Other") };
};
// Inline CSS-variable string so the tile/chip carries its own bank theme.
const bankStyle = (name) => {
  const m = bankMeta(name);
  return `--bank-a:${m.a};--bank-b:${m.b};--bank-accent:${m.accent};--bank-fg:#fff`;
};

// ---- Card networks and their sub-variants (tiers) -------------------------
// The network is the scheme; the variant is its tier. Both are shown on the
// tile and drive the two-level network filter.
const NETWORK_VARIANTS = {
  "Visa":         ["Classic", "Gold", "Platinum", "Rewards", "Signature", "Infinite", "Infinite Privilege", "Other"],
  "Mastercard":   ["Standard", "Titanium", "Platinum", "World", "World Elite", "Other"],
  "RuPay":        ["Classic", "Platinum", "Select", "Ekaa", "Other"],
  // Amex has no network tier (user feedback, 1.3.6): it is a closed network,
  // so the card's own name (Platinum Travel, MRCC...) already says it. The
  // Variant field is shown as "Not needed" and saved empty.
  "Amex":         [],
  "Diners Club":  ["Standard", "Premium", "Black", "Black+", "Other"],
};
const NETWORKS = Object.keys(NETWORK_VARIANTS);
const NET_GLYPH = { "Visa": "V", "Mastercard": "MC", "RuPay": "RP", "Amex": "AX", "Diners Club": "DC" };
// The badge shown on a tile: "Visa Infinite", "RuPay Select", etc.
const netLabel = (c) => [c.network, c.variant].filter(Boolean).join(" ");

// Reusable generic illustration: a family of geometric SVGs, one shape-set per
// seed, tinted by the bank's own accent. Same language for every card of a
// bank, distinct enough between banks — and no real card artwork anywhere.
function bankIllustration(seed) {
  const A = 'rgba(255,255,255,.16)', B = 'rgba(255,255,255,.09)', C = 'var(--bank-accent)';
  const sets = [
    // 0 concentric arcs
    `<circle cx="255" cy="20" r="70" fill="${A}"/><circle cx="255" cy="20" r="46" fill="${B}"/><circle cx="255" cy="20" r="10" fill="${C}" opacity=".5"/>`,
    // 1 diagonal bars
    `<g fill="${A}"><rect x="200" y="-30" width="26" height="180" transform="rotate(24 213 60)"/><rect x="238" y="-30" width="16" height="180" transform="rotate(24 246 60)"/></g><circle cx="250" cy="18" r="8" fill="${C}" opacity=".6"/>`,
    // 2 hex grid
    `<g fill="${A}"><path d="M235 4l20 12v24l-20 12-20-12V16z"/></g><path d="M262 30l18 10v20l-18 10-18-10V40z" fill="${B}"/>`,
    // 3 orbit dots
    `<circle cx="252" cy="24" r="60" fill="none" stroke="${A}" stroke-width="14"/><circle cx="252" cy="-32" r="7" fill="${C}"/><circle cx="205" cy="60" r="5" fill="${A}"/>`,
    // 4 chevrons
    `<g fill="none" stroke="${A}" stroke-width="14"><path d="M190 70l40-40 40 40"/><path d="M190 105l40-40 40 40"/></g><circle cx="270" cy="14" r="9" fill="${C}" opacity=".55"/>`,
    // 5 stacked squares
    `<g fill="${A}"><rect x="210" y="-20" width="60" height="60" rx="10" transform="rotate(18 240 10)"/></g><rect x="235" y="20" width="42" height="42" rx="8" fill="${B}" transform="rotate(18 256 41)"/>`,
    // 6 radial spokes
    `<g stroke="${A}" stroke-width="12" stroke-linecap="round"><path d="M255 20v-40"/><path d="M255 20l34 20"/><path d="M255 20l-34 20"/></g><circle cx="255" cy="20" r="12" fill="${C}" opacity=".5"/>`,
    // 7 wave
    `<path d="M150 60q40-46 80 0t80 0v70h-160z" fill="${A}"/><path d="M150 78q40-40 80 0t80 0v54h-160z" fill="${B}"/>`,
    // 8 nested diamonds
    `<g fill="none" stroke="${A}" stroke-width="12"><path d="M255 -20l46 46-46 46-46-46z"/></g><path d="M255 6l20 20-20 20-20-20z" fill="${C}" opacity=".5"/>`,
    // 9 dots field
    `<g fill="${A}"><circle cx="220" cy="14" r="7"/><circle cx="250" cy="30" r="7"/><circle cx="280" cy="12" r="7"/><circle cx="266" cy="54" r="7"/><circle cx="232" cy="52" r="7"/></g>`,
  ];
  return `<svg class="illus" viewBox="0 0 320 130" preserveAspectRatio="xMaxYMin slice" xmlns="http://www.w3.org/2000/svg">${sets[seed % sets.length]}</svg>`;
}

// --------------------------------------------------------------------------
const $ = (s, r = document) => r.querySelector(s);
const state = {
  cards: [], banks: [], selectedBank: "All",
  selectedNetwork: "All", selectedVariant: "All", networkOpen: false,
  revealed: new Set(), showArchived: false, tab: "cards",
  rel: { scale: 1, tx: 0, ty: 0 },  // relationship-graph zoom/pan
  // 1.3.0 (closed-test feedback): free-text search, credit/debit bucket and
  // whose cards are on screen. selectedRelation is set from relDefault() on
  // every unlock, so a locked default survives the app being closed.
  search: "", selectedKind: "All", selectedRelation: "Self",
};

// ---- API ------------------------------------------------------------------
// On Windows and macOS this was fetch() against a local Python server. A phone
// has no server, so api.js answers the same routes in-process, with the same
// JSON. Everything below this line is the desktop UI, unchanged on purpose -
// see HANDOVER-ANDROID.md section 3 for why the seam was kept exactly here.
const api = window.YCJ.api;

// ---- Boot -----------------------------------------------------------------
// The YourCardJourney credit logos hide themselves if the image is missing.
// This was an inline onerror; the 1.3.9 Content-Security-Policy forbids those.
document.querySelectorAll("img.credit-logo").forEach((img) => {
  const hide = () => { img.style.display = "none"; };
  if (img.complete && !img.naturalWidth) hide(); else img.addEventListener("error", hide);
});
init();
async function init() {
  applyThemePref();
  setupMobileShell();

  const st = await api.get("/api/status");
  state.banks = st.banks || [];
  if (st.unlocked) { openApp(); }
  else { showLock(st.exists); }
  wireGlobalUI();
  wireVaultSheet();
  wirePasswordChange();
  wireCardScanner();
  wireHolderClear();
  wireBankPicker();
  wireNudge();
  setupMobileFilters();
}

// ---- Mobile shell ---------------------------------------------------------
// The three phone behaviours that have no desktop equivalent. All of the
// substance is in shared/core/mobile.js; this only says what Card Vault wants
// to happen.
function setupMobileShell() {
  window.YCJ.mobile.setup({
    // The vault is dropped the instant the app leaves the foreground. Not on a
    // timer - a phone is handed to people and taken from people, and a card
    // vault left decrypted in the recents switcher is the whole risk in one
    // picture. Re-entry costs one password, which is the right trade here.
    onBackground: () => { if (window.YCJ.vault.unlocked) lockNow({ quiet: true }); },

    // Android's back button would otherwise close the WebView outright, so
    // backing out of a modal would exit the app. Walk the stack instead.
    onBack: () => {
      if (!$("#termsSheet").hidden) { closeTerms(); return true; }
      if (!$("#modal").hidden) { closeModal(); return true; }
      if (!$("#menu").hidden) { $("#menu").hidden = true; return true; }
      if (!$("#sheet").hidden) { closeSheet(); return true; }
      if (!$("#importSheet").hidden) { closeImport(); return true; }
      if (!$("#vaultSheet").hidden) { $("#vaultSheet").hidden = true; return true; }
      if (!$("#filterSheet").hidden) { closeFilterSheet(); return true; }
      if (searchOpen()) { closeSearch(); return true; }
      if (!$("#relSheet").hidden) { closeRelSheet(); return true; }
      if (!$("#ppSheet").hidden) { closePassSheet(); return true; }
      // At the top of the stack: an unlocked vault locks first, so the very
      // last back press can never leave data decrypted behind an exit.
      if (window.YCJ.vault.unlocked) { lockNow(); return true; }
      return false;
    },

    // No statusBarColor: Android 15 ignores it and Play flags the call. The
    // header paints that strip itself - see mobile.js section 3.
    statusBarDark: true,
  });
}

/** Lock and return to the password screen. One implementation, called from the
 *  header button, the hardware back key and the background handler, so the
 *  three can never fall out of step about what "locked" clears. */
async function lockNow(opts) {
  // A card half-typed when the auto-lock fires is kept for the next unlock.
  sheetDraft = captureSheetDraft();
  await api.send("/api/lock", "POST");
  state.cards = []; state.revealed.clear(); state.selectedBank = "All";
  state.selectedNetwork = "All"; state.selectedVariant = "All";
  state.showArchived = false;
  state.search = ""; state.selectedKind = "All";
  state.selectedRelation = relDefault();
  const si = $("#searchInput"); if (si) si.value = "";
  if (typeof closeSearch === "function") closeSearch();
  if (typeof switchTab === "function") switchTab("cards");
  const ab = $("#archiveBtn");
  if (ab) { ab.classList.remove("is-active"); ab.setAttribute("aria-pressed", "false"); ab.title = "Show archived cards"; }
  closeCardScanner();
  cancelTap();
  resetPasswordForm();
  if (window.YCJ.cardscan) window.YCJ.cardscan.terminate();
  $("#menu").hidden = true;
  $("#modal").hidden = true;
  $("#sheet").hidden = true;
  $("#importSheet").hidden = true;
  $("#vaultSheet").hidden = true;
  closeTerms();
  closeFilterSheet(); closeRelSheet(); closePassSheet();
  $("#lockPw").value = "";
  setPwVisible("lockPw", false); setPwVisible("lockPw2", false);
  showLock(true, !!(opts && opts.quiet));
  if (!opts || !opts.quiet) toast("Vault locked");
}

// ---- Terms & conditions (1.3.6) ---------------------------------------------
function openTerms() {
  const sh = $("#termsSheet");
  sh.hidden = false;
  const body = sh.querySelector(".sheet-body"); if (body) body.scrollTop = 0;
}
function closeTerms() { const el = $("#termsSheet"); if (el) el.hidden = true; }

// ---- Settings sheet --------------------------------------------------------
// This replaces the desktop's licence panel, which the store builds do not
// have. It is the only place in the app that touches a file, and the wording
// is deliberately blunt about what the exported file is: still encrypted, and
// still only as strong as the master password on it.
function wireVaultSheet() {
  $("#vaultBtn").onclick = () => openVaultSheet();
  // Terms & conditions (1.3.6): from Settings, and from the create-vault screen.
  $("#termsOpen").onclick = openTerms;
  $("#lockTermsLink").onclick = openTerms;
  $("#termsClose").onclick = closeTerms;
  $("#termsDone").onclick = closeTerms;
  $("#termsSheet").onclick = (e) => { if (e.target.id === "termsSheet") closeTerms(); };

  $("#vaultExport").onclick = async () => {
    const msg = $("#vaultMsg");
    msg.hidden = true;
    const res = await api.send("/api/export", "POST", {});
    if (res.error) return showErr(msg, "There is nothing saved to export yet.");
    toast("Backup ready to share");
  };

  $("#vaultImport").onclick = async () => {
    const msg = $("#vaultMsg");
    msg.hidden = true;
    const bytes = await window.YCJ.mobile.pickFile(".dat");
    if (!bytes) return;
    const pw = $("#vaultImportPw").value;
    if (!pw) return showErr(msg, "Enter the master password that file was saved with.");
    const mode = $("#vaultMerge").checked ? "merge" : "replace";
    $("#vaultImport").disabled = true;
    $("#vaultImport").textContent = "Opening…";
    const res = await window.YCJ.importVault(pw, bytes, mode);
    $("#vaultImport").disabled = false;
    $("#vaultImport").textContent = "Choose a file to import";
    $("#vaultImportPw").value = "";
    if (!res.ok) return showErr(msg, res.error);
    $("#vaultSheet").hidden = true;
    if (res.replaced) {
      // The imported file is now this device's vault, and the keys in memory
      // are its keys - so the user is already inside it. Reloading the card
      // list is enough; sending them back to the lock screen would look like
      // the import had failed.
      await openApp();
    } else {
      await openApp();
    }
    // Say which password applies now. The old behaviour changed it silently,
    // and even the correct behaviour is worth stating after a restore.
    const n = res.added + (res.added === 1 ? " card" : " cards");
    if (res.replaced && res.keptPassword) {
      toast(n + " restored \u00B7 your existing password still applies");
    } else if (res.replaced) {
      toast(n + " restored \u00B7 use that file's password from now on");
    } else {
      toast(n + " added" + (res.skipped ? " \u00B7 " + res.skipped + " already here" : ""));
    }
  };
}

async function openVaultSheet() {
  $("#menu").hidden = true;
  $("#vaultMsg").hidden = true;
  $("#vaultImportPw").value = "";
  const b = await api.get("/api/backups");
  const n = (b.backups || []).length;
  $("#vaultBackupCount").textContent = n
    ? n + (n === 1 ? " automatic backup kept on this phone" : " automatic backups kept on this phone")
    : "No automatic backups yet — one is kept every time you save a card.";
  await wireBiometricToggle();
  wireAutoLock();
  renderRelChips();
  resetPasswordForm();
  $("#vaultSheet").hidden = false;
}


// ---- Mobile filter bar ----------------------------------------------------
// The desktop lays the bank selector out as a wrapping wall of chips. That is
// fine at 1120px and unusable at 393px: with 16 banks it filled the entire
// first screen, so every card sat below the fold, and opening the network
// filter pushed the list further down still.
//
// The fix is a standard mobile pattern rather than a squeezed desktop one: a
// slim sticky row of two pills that SUMMARISE the current selection, each
// opening a bottom sheet to change it. Picking a bank closes the sheet, so the
// cards are on screen the moment a choice is made.
//
// The chips themselves are NOT reimplemented. #bankbar and #netFilter are
// physically moved into the sheet at boot, so renderBankBar() and
// renderNetworkBar() remain the single implementation and cannot drift from
// the desktop. Above 720px nothing moves and the desktop layout is untouched.
const MOBILE_Q = "(max-width: 720px)";
let filtersAreMobile = false;

function setupMobileFilters() {
  if (!window.matchMedia(MOBILE_Q).matches) return;
  filtersAreMobile = true;

  const body = $("#filterSheetBody");
  body.appendChild($("#bankbar"));
  body.appendChild($("#netFilter"));

  $("#mFilterBar").hidden = false;
  $("#filterClose").onclick = closeFilterSheet;
  $("#filterSheet").onclick = (e) => { if (e.target.id === "filterSheet") closeFilterSheet(); };

  renderMobileFilterBar();
}

function openFilterSheet(focus) {
  // The network filter is collapsed by default on the desktop. Inside the
  // sheet there is room for it, and someone who tapped the Network pill meant
  // to change the network - so it is opened for them.
  if (focus === "net" && !state.networkOpen) {
    state.networkOpen = true;
    renderNetworkBar();
  }
  const sheet = $("#filterSheet");
  sheet.hidden = false;

  // Both filters live in one sheet, banks first. Someone who tapped Network
  // would otherwise open onto the bank grid with their control below the fold
  // and no sign it is there. Scroll to whichever they asked for.
  //
  // The scroller is .sheet, NOT .sheet-body - style.css puts the max-height
  // and overflow-y on the outer element. Setting scrollTop on the body is a
  // silent no-op, which is exactly what it did the first time.
  // rAF because the sheet has no layout until after it is unhidden.
  const scroller = sheet.querySelector(".sheet");
  requestAnimationFrame(() => {
    if (!scroller) return;
    const net = $("#netFilter");
    const kind = $("#kindFilter");
    if (focus === "kind" && kind) {
      const delta = kind.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
      scroller.scrollTop += delta - 12;
    } else if (focus === "net" && net && !net.hidden) {
      // offsetTop is relative to the nearest positioned ancestor, so measure
      // against the scroller's own box rather than trusting it.
      const delta = net.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
      scroller.scrollTop += delta - 12;
    } else {
      scroller.scrollTop = 0;
    }
  });
}

function closeFilterSheet() {
  const el = $("#filterSheet");
  if (el) el.hidden = true;
}

function renderMobileFilterBar() {
  if (!filtersAreMobile) return;
  queueFit();
  const bar = $("#mFilterBar");
  const cards = visibleCards();

  const counts = {};
  cards.forEach((c) => { counts[c.bank] = (counts[c.bank] || 0) + 1; });
  const bankSel = state.selectedBank !== "All";
  const bankCount = bankSel ? (counts[state.selectedBank] || 0) : cards.length;
  const m = bankSel ? bankMeta(state.selectedBank) : null;

  const caret = '<svg class="mfp-caret" viewBox="0 0 24 24" width="16" height="16">'
              + '<path fill="currentColor" d="m7 10 5 5 5-5z"/></svg>';
  const clearBtn = (kind, label) =>
    '<span class="mfp-clear" data-clear="' + kind + '" role="button" aria-label="' + label + '">&times;</span>';

  const bankPill =
    '<button class="mfilter-pill ' + (bankSel ? "is-set" : "") + '" id="mBankPill" type="button">'
    + (bankSel
        ? '<span class="mfp-glyph has-mark" style="' + bankStyle(state.selectedBank) + '">' + bankMarkSvg(state.selectedBank, 15) + '</span>'
        : '<span class="mfp-glyph mfp-all">\u25A4</span>')
    + '<span class="mfp-text">' + (bankSel ? esc(state.selectedBank) : "All banks") + '</span>'
    + '<span class="mfp-count">' + bankCount + '</span>'
    + (bankSel ? clearBtn("bank", "Show all banks") : caret)
    + '</button>';

  // The network pill is omitted entirely when no card records a network - an
  // always-visible control that can never do anything is just clutter.
  const anyNetwork = cards.some((c) => c.network);
  const netSel = state.selectedNetwork !== "All";
  const netLabel = netSel
    ? [state.selectedNetwork, state.selectedVariant === "All" ? "" : state.selectedVariant]
        .filter(Boolean).join(" \u00B7 ")
    : "Network";
  const netPill = !anyNetwork ? "" :
    '<button class="mfilter-pill ' + (netSel ? "is-set" : "") + '" id="mNetPill" type="button">'
    + '<span class="mfp-text">' + esc(netLabel) + '</span>'
    + (netSel ? clearBtn("net", "Show all networks") : caret)
    + '</button>';

  // Credit / Debit pill. Shown even when every card is one kind: unlike the
  // network pill this is a question people actually ask of the list, and a
  // pill that appears only sometimes reads as a bug.
  const kindSel = state.selectedKind !== "All";
  const kindPill =
    '<button class="mfilter-pill ' + (kindSel ? "is-set" : "") + '" id="mKindPill" type="button">'
    + '<span class="mfp-text">' + (kindSel ? kindLabel(state.selectedKind) : "Type") + '</span>'
    + (kindSel ? clearBtn("kind", "Show credit and debit") : caret)
    + '</button>';

  bar.innerHTML = bankPill + kindPill + netPill;

  // The clear affordance sits inside the pill, so its click must not also open
  // the sheet - hence stopPropagation rather than two separate buttons.
  bar.querySelectorAll("[data-clear]").forEach((el) => {
    el.onclick = (e) => {
      e.stopPropagation();
      if (el.dataset.clear === "bank") state.selectedBank = "All";
      else if (el.dataset.clear === "kind") state.selectedKind = "All";
      else { state.selectedNetwork = "All"; state.selectedVariant = "All"; }
      refreshActiveView();
    };
  });
  const bp = $("#mBankPill"); if (bp) bp.onclick = () => openFilterSheet("bank");
  const np = $("#mNetPill");  if (np) np.onclick = () => openFilterSheet("net");
  const kp = $("#mKindPill"); if (kp) kp.onclick = () => openFilterSheet("kind");
}

// ---- Biometric unlock (optional) ------------------------------------------
// See shared/core/mobile.js for what this does and does not protect. In short:
// it remembers the master password in the phone's secure store and hands it
// back after a fingerprint match. The vault file is unchanged, and typing the
// password always works, so nothing here can make a vault unopenable.
async function setupBiometricUnlock(exists, autoOk) {
  const btn = $("#bioUnlockBtn");
  if (!btn) return;
  btn.hidden = true;
  bioAutoArmed = false;
  // Only on an EXISTING vault: there is no password to remember until one has
  // been created, and offering it on first run would be nonsense.
  if (!exists || !window.YCJ.mobile.bioEnabled()) return;
  if (!(await window.YCJ.mobile.bioAvailable())) return;

  btn.hidden = false;
  bioAutoArmed = !!autoOk && bioAutoOn();
  btn.onclick = async () => {
    const err = $("#lockError");
    err.hidden = true;
    // A lockout applies here too - otherwise it would be trivially bypassed by
    // whoever is holding the phone, which is precisely who it is for.
    const left = guardRemaining();
    if (left > 0) return showErr(err, "Too many attempts. Wait " + left + "s.");

    const pw = await window.YCJ.mobile.bioUnlock();
    // Cancelled or no match: ordinary; say nothing and let them type it.
    if (!pw) {
      // 1.3.9: the phone's fingerprints/faces changed, which wipes the copy
      // the secure chip held. Say so once, so the missing button makes sense.
      if (!window.YCJ.mobile.bioEnabled()) {
        btn.hidden = true;
        showErr(err, "Quick unlock was switched off because this phone's fingerprints or face changed. "
          + "Enter your master password, then turn it back on in Settings.");
      }
      return;
    }

    const res = await api.send("/api/unlock", "POST", { password: pw });
    if (res.ok) {
      guardClear();
      clearInterval(guardTimer);
      state.cards = res.cards || [];
      $("#lock").hidden = true;
      openApp();
    } else {
      // The stored password no longer opens the vault - it was changed
      // elsewhere. Drop it rather than prompting for a fingerprint that can
      // never work again.
      await window.YCJ.mobile.bioDisable();
      btn.hidden = true;
      showErr(err, "Your master password has changed. Enter it to continue.");
    }
  };

  // NOT offered automatically by default (1.3.6). It used to be clicked here
  // the moment the lock screen appeared, which on a Face ID iPhone meant the
  // vault simply opened - the user never saw the lock screen and never chose.
  // The screen now waits: type the master password, or tap this button -
  // unless the user has turned on "when the app opens" in Settings (1.3.8).
  setTimeout(tryBioAuto, 400);
}

// ---- "Unlock ... when the app opens" (1.3.8, OFF by default) ---------------
// Closed-test feedback asked for the sensor to come up by itself. It is the
// user's choice, a sub-option of biometric unlock: one prompt per lock screen,
// only on app start or after the auto-lock - never right after the user
// pressed Lock themselves - and never during a lockout. Cancelling it leaves
// the ordinary lock screen. A device setting, like the theme.
const BIO_AUTO_KEY = "cv-bio-auto";
let bioAutoArmed = false;
function bioAutoOn() {
  try { return localStorage.getItem(BIO_AUTO_KEY) === "1"; } catch { return false; }
}
function setBioAuto(on) {
  try { on ? localStorage.setItem(BIO_AUTO_KEY, "1") : localStorage.removeItem(BIO_AUTO_KEY); } catch {}
}
function tryBioAuto() {
  const btn = $("#bioUnlockBtn");
  if (!bioAutoArmed || !btn || btn.hidden || $("#lock").hidden) return;
  if (document.visibilityState !== "visible" || guardRemaining() > 0) return;
  bioAutoArmed = false;
  btn.click();
}
// A lock that happened in the background is shown when the app comes back.
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") setTimeout(tryBioAuto, 400);
});
function reflectBioAuto() {
  const row = $("#bioAutoRow"), auto = $("#bioAutoToggle"), toggle = $("#bioToggle");
  if (!row || !auto) return;
  row.hidden = !(toggle && toggle.checked && !toggle.disabled);
  auto.checked = bioAutoOn();
  auto.onchange = () => setBioAuto(auto.checked);
}

async function wireBiometricToggle() {
  const block = $("#bioBlock"), toggle = $("#bioToggle"), msg = $("#bioMsg");
  if (!block) return;

  // Show the section either way. Hiding it when biometrics are unavailable
  // leaves the user with a feature that is documented and simply absent, and
  // no way to find out why - which is exactly how this looked on the device.
  const st = await window.YCJ.mobile.bioStatus();
  block.hidden = false;
  toggle.disabled = !st.ok;
  if (!st.ok) {
    showErr(msg, st.why);
    toggle.checked = false;
    reflectBioAuto();
    return;
  }
  msg.hidden = true;
  toggle.checked = window.YCJ.mobile.bioEnabled();
  reflectBioAuto();
  toggle.onchange = async () => {
    msg.hidden = true;
    if (!toggle.checked) {
      await window.YCJ.mobile.bioDisable();
      // The sub-option goes with it: turning unlock back on later starts
      // from the default (off), not from a choice made long ago.
      setBioAuto(false); reflectBioAuto();
      toast("Fingerprint unlock turned off");
      return;
    }
    // Enabling needs the master password, and we ask for it rather than
    // reusing the one from unlock: the app deliberately never keeps it in
    // memory after opening the vault, and that is worth preserving.
    const pw = await promptMasterPassword("Confirm your master password to enable fingerprint unlock");
    if (!pw) { toggle.checked = false; return; }
    const ok = await api.send("/api/verify", "POST", { password: pw });
    if (!ok.ok) { toggle.checked = false; return showErr(msg, "That is not your master password."); }

    const res = await window.YCJ.mobile.bioEnable(pw);
    if (!res.ok) { toggle.checked = false; return showErr(msg, res.error); }
    reflectBioAuto();
    toast("Fingerprint unlock enabled");
  };
}

/** Small modal that asks for the master password and resolves to it, or null.
 *  Reuses the existing #modal so there is one dialog implementation. */
function promptMasterPassword(title) {
  return new Promise((resolve) => {
    const box = $("#modalBox");
    box.innerHTML =
      '<h3 class="modal-title">' + esc(title) + '</h3>' +
      '<div class="field"><input id="mpwInput" type="password" placeholder=" " autocomplete="off" />' +
      '<label for="mpwInput">Master password</label></div>' +
      '<div class="sheet-foot">' +
      '<button class="btn btn-text" id="mpwCancel" type="button">Cancel</button>' +
      '<button class="btn btn-filled" id="mpwOk" type="button">Confirm</button></div>';
    $("#modal").hidden = false;
    const done = (v) => { $("#modal").hidden = true; resolve(v); };
    $("#mpwCancel").onclick = () => done(null);
    $("#mpwOk").onclick = () => done($("#mpwInput").value || null);
    setTimeout(() => $("#mpwInput").focus(), 40);
  });
}


// ---- Auto-lock delay ------------------------------------------------------
// Offered because the instant-lock behaviour this app shipped with made its
// most common task painful: copy a number, switch to another app, paste, come
// back - and find the vault locked every time. The grace period is a genuine
// trade and it is the user's to make, so it is a visible setting rather than a
// constant someone has to take on trust.
function wireAutoLock() {
  const wrap = $("#lockChoices");
  if (!wrap) return;
  const M = window.YCJ.mobile;
  const current = M.autoLockSeconds();
  wrap.innerHTML = M.AUTOLOCK_CHOICES.map((c) =>
    '<button type="button" class="lock-choice' + (c.s === current ? " is-on" : "") +
    '" data-sec="' + c.s + '">' + c.label + '</button>').join("");
  wrap.querySelectorAll(".lock-choice").forEach((b) => {
    b.onclick = () => {
      M.setAutoLockSeconds(parseInt(b.dataset.sec, 10));
      wireAutoLock();
      toast("Auto-lock: " + b.textContent.toLowerCase());
    };
  });
}

function applyThemePref() {
  const t = localStorage.getItem("cv-theme") || "light";
  document.documentElement.setAttribute("data-theme", t);
}

// ---- Lock screen ----------------------------------------------------------
// ---- Master password: strength, and lockout after wrong guesses -----------
// The vault's encryption is only ever as strong as the password it is derived
// from. This app shipped with a FOUR CHARACTER minimum, which is 10,000
// possibilities for a numeric one - a few minutes of offline guessing against
// the 390,000-round PBKDF2 if someone extracts vault.dat from a rooted or
// resold phone. The cryptography was never the weak part.
//
// Two defences, and they cover different attacks. Be clear about which:
//
//   MIN_LEN + the meter raise the cost of an OFFLINE attack on an extracted
//   file. That is the attack that actually matters, and the only thing that
//   helps against it is entropy in the password itself.
//
//   The lockout raises the cost of ONLINE guessing - a thief holding the
//   unlocked phone, typing into this screen. It does nothing whatsoever for
//   the offline case, and pretending otherwise would be the dangerous kind of
//   security theatre.
const MIN_LEN = 8;

// Not a dictionary - just the handful that a strength meter must never call
// "strong" because they are the first things anyone tries. Compared after
// lowercasing and stripping trailing digits, so "Password1" is caught too.
const WEAK_PASSWORDS = [
  "password", "passw0rd", "12345678", "123456789", "qwerty", "qwertyui",
  "abcd", "abcdefg", "letmein", "welcome", "iloveyou", "admin", "master",
  "cardvault", "yourcardjourney", "vault", "secret", "monkey", "dragon",
];

function passwordScore(pw) {
  // Deliberately NOT a bits-of-entropy estimate. Those are wrong for
  // human-chosen passwords and give a falsely reassuring number. This is a
  // blunt "have you done the things that actually help" score.
  if (!pw) return { score: 0, label: "", hint: "" };

  const stripped = pw.toLowerCase().replace(/[0-9]+$/, "");
  if (WEAK_PASSWORDS.indexOf(stripped) >= 0) {
    return { score: 0, label: "Too common", hint: "This is one of the first passwords anyone would try." };
  }
  // All one character, or a straight run like 1234 / abcd.
  if (/^(.)\1+$/.test(pw)) {
    return { score: 0, label: "Too simple", hint: "Repeating one character adds nothing." };
  }

  let s = 0;
  if (pw.length >= MIN_LEN) s++;
  if (pw.length >= 12) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  // A long passphrase is genuinely strong even without symbols, and telling
  // someone otherwise pushes them towards a short unmemorable one instead.
  if (pw.length >= 16) s = Math.max(s, 4);

  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong", "Strong"];
  const hints = [
    "Use at least " + MIN_LEN + " characters.",
    "Longer is better than complicated - try a few words.",
    "Add length, or a capital and a digit.",
    "Good. A few more characters would make it stronger.",
    "", "",
  ];
  return { score: Math.min(s, 5), label: labels[Math.min(s, 5)], hint: hints[Math.min(s, 5)] };
}

function renderStrength(pw) {
  const wrap = $("#pwStrength");
  if (!wrap) return;
  if (!pw) { wrap.hidden = true; return; }
  const { score, label, hint } = passwordScore(pw);
  wrap.hidden = false;
  wrap.dataset.score = String(score);
  $("#pwStrengthLabel").textContent = label;
  $("#pwStrengthHint").textContent = hint;
  wrap.querySelectorAll(".pw-seg").forEach((seg, i) => {
    seg.classList.toggle("is-on", i < Math.max(score, 1) && score > 0);
  });
}

// --- lockout ---------------------------------------------------------------
// Persisted, not held in a variable: otherwise force-stopping the app resets
// the counter, which makes the whole thing decorative. localStorage is the
// only store available while the vault is still locked, and it survives an
// app restart. It does NOT survive a reinstall - but a reinstall also wipes
// the vault, so there is nothing left to guess at.
const LOCKOUT_KEY = "cv-guard";
// Wrong guesses 1-2 are free; people mistype. From the third the wait doubles.
const LOCKOUT_STEPS = [0, 0, 5, 15, 30, 60, 120, 300, 600, 900];

function guardRead() {
  try { return JSON.parse(localStorage.getItem(LOCKOUT_KEY)) || { fails: 0, until: 0 }; }
  catch (e) { return { fails: 0, until: 0 }; }
}
function guardWrite(g) {
  try { localStorage.setItem(LOCKOUT_KEY, JSON.stringify(g)); } catch (e) {}
}
function guardClear() {
  try { localStorage.removeItem(LOCKOUT_KEY); } catch (e) {}
}

/** Seconds still to wait, or 0. */
function guardRemaining() {
  const g = guardRead();
  // Date.now() is the device clock, which the holder of the phone controls -
  // so this is a speed bump, not a guarantee. Winding the clock forward skips
  // the wait. Nothing available to a locked app can prevent that, and the
  // offline attack does not care about it either way.
  return Math.max(0, Math.ceil((g.until - Date.now()) / 1000));
}

function guardFail() {
  const g = guardRead();
  g.fails = (g.fails || 0) + 1;
  const wait = LOCKOUT_STEPS[Math.min(g.fails, LOCKOUT_STEPS.length - 1)];
  g.until = wait ? Date.now() + wait * 1000 : 0;
  guardWrite(g);
  return { fails: g.fails, wait };
}

/** Show the countdown on the unlock button and tick it down. */
let guardTimer = null;
function guardTick() {
  clearInterval(guardTimer);
  const btn = $("#lockBtn"), err = $("#lockError");
  const paint = () => {
    const left = guardRemaining();
    if (left <= 0) {
      clearInterval(guardTimer);
      btn.disabled = false;
      btn.textContent = btn.dataset.label || "Unlock";
      return;
    }
    btn.disabled = true;
    btn.textContent = "Try again in " + left + "s";
  };
  paint();
  if (guardRemaining() > 0) guardTimer = setInterval(paint, 1000);
}

// autoBio (1.3.8): may the "when the app opens" sensor prompt run? Yes on
// app start and after the auto-lock; no after the user pressed Lock.
function showLock(exists, autoBio = true) {
  $("#app").hidden = true;
  const lock = $("#lock"); lock.hidden = false;
  $("#lockConfirmWrap").hidden = exists;
  $("#lockTitle").textContent = exists ? "Welcome back" : "Create your vault";
  $("#lockSub").textContent = exists
    ? "Your vault is locked. Unlock to see your cards."
    : "Choose a master password. It encrypts every card on this phone and can't be recovered, so make it memorable.";
  $("#lockBtn").textContent = exists ? "Unlock" : "Create my vault";
  // New users only; an existing user finds the terms in Settings, unprompted.
  $("#lockTerms").hidden = exists;
  $("#lockBtn").dataset.label = exists ? "Unlock" : "Create my vault";
  // 2.0 (feedback): unlocking never opens the keyboard by itself. It popped
  // up on every launch and then Face ID / fingerprint let the user straight
  // in. Tapping the password box brings the keyboard up. Only Create your
  // vault, where typing is the one thing to do, still focuses it.
  if (exists) $("#lockPw").blur(); else $("#lockPw").focus();

  // The strength meter is for CHOOSING a password, not for typing a known one
  // back in - showing it at unlock would just rate the user's own password at
  // them every time they open the app.
  const meter = $("#pwStrength");
  if (meter) meter.hidden = true;
  $("#lockPw").oninput = exists ? null : (e) => renderStrength(e.target.value);

  // A lockout in progress must survive the app being force-stopped, so it is
  // re-applied here rather than only after a failure.
  if (exists) guardTick();
  setupBiometricUnlock(exists, autoBio);

  $("#lockForm").onsubmit = async (e) => {
    e.preventDefault();
    const pw = $("#lockPw").value, err = $("#lockError");
    err.hidden = true;

    if (!exists) {
      // Creating: enforce a password worth having. These checks exist because
      // everything else in this app rests on them.
      if (pw.length < MIN_LEN) {
        return showErr(err, "Use at least " + MIN_LEN + " characters. This password is the only thing protecting your cards.");
      }
      if (passwordScore(pw).score === 0) {
        return showErr(err, passwordScore(pw).hint || "Choose something harder to guess.");
      }
      if (pw !== $("#lockPw2").value) return showErr(err, "Passwords don't match.");
    } else {
      const left = guardRemaining();
      if (left > 0) return showErr(err, "Too many attempts. Wait " + left + "s.");
    }

    const res = await api.send("/api/unlock", "POST", { password: pw });
    if (res.ok) {
      guardClear();
      clearInterval(guardTimer);
      state.cards = res.cards || [];
      lock.hidden = true;
      openApp();
      return;
    }

    if (res.error === "wrong password") {
      const { fails, wait } = guardFail();
      guardTick();
      showErr(err, wait
        ? "Wrong password. " + fails + " failed attempts - wait " + wait + "s."
        : "Wrong password. Try again.");
    } else {
      showErr(err, "Could not unlock.");
    }
  };
}
function showErr(el, msg) { el.textContent = msg; el.hidden = false; }

// ---- App shell ------------------------------------------------------------
async function openApp() {
  $("#app").hidden = false;
  showSkeleton(true);
  const res = await api.get("/api/cards");
  state.cards = res.cards || [];
  showSkeleton(false);
  // The home page opens on the locked relation (or Self). Done here rather
  // than at boot so a vault imported over this one is judged on ITS cards.
  state.selectedRelation = relDefault();
  renderSampleBanner();
  renderHomeTools();
  renderBankBar();
  renderCards();
  nudgeDismissed = false;
  renderNudge();
  if (sheetDraft) {
    const d = sheetDraft; sheetDraft = null;
    restoreSheetDraft(d);
    toast("Your unsaved card is back");
  }
}

function showSkeleton(on) {
  const sk = $("#skeleton");
  if (on) { sk.hidden = false; sk.innerHTML = Array(6).fill('<div class="sk"></div>').join(""); $("#cardList").hidden = true; $("#emptyState").hidden = true; }
  else { sk.hidden = true; $("#cardList").hidden = false; }
}

// ---- Bank selector --------------------------------------------------------
function visibleCards() {
  // Archived-or-not, then whose cards. The relation is applied HERE, before
  // the bank counts, so the bank chips only ever offer banks that the person
  // on screen actually holds a card with.
  return state.cards.filter((c) => (state.showArchived ? c.archived : !c.archived)
    && (state.selectedRelation === "All" || cardRelation(c) === state.selectedRelation));
}
function renderBankBar() {
  const cards = visibleCards();
  const counts = {};
  cards.forEach((c) => { counts[c.bank] = (counts[c.bank] || 0) + 1; });
  // Only banks you actually hold cards for get a chip. The selector grows as
  // you add new banks and never shows empty placeholders. (The full bank list
  // still lives in the Add-card form so you can pick any bank when adding.)
  // Chips are A→Z by bank name, matching the A→Z bank sections in the list.
  const present = Object.keys(counts).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }));
  // If the selected bank no longer has any cards (e.g. its last card was
  // deleted or archived), fall back to All so nothing filters to an empty view.
  if (state.selectedBank !== "All" && !counts[state.selectedBank]) state.selectedBank = "All";
  const order = ["All", ...present];
  const scroll = $("#bankScroll");
  scroll.innerHTML = order.map((b) => {
    const isAll = b === "All";
    const m = isAll ? null : bankMeta(b);
    const active = state.selectedBank === b;
    const count = isAll ? cards.length : (counts[b] || 0);
    const glyph = isAll
      ? `<span class="glyph">▤</span>`
      : `<span class="glyph has-mark">${bankMarkSvg(b, 16)}</span>`;
    const style = isAll ? "" : `style="${bankStyle(b)}"`;
    return `<button class="bank-chip ${isAll ? "all" : ""} ${active ? "is-active" : ""}" ${style} data-bank="${b}">
      ${glyph}<span>${b}</span><span class="count">${count}</span>
    </button>`;
  }).join("");
  scroll.querySelectorAll(".bank-chip").forEach((el) => {
    el.onclick = () => {
      state.selectedBank = el.dataset.bank;
      // On the Relationship tab the chip filters the graph; on My Cards it
      // filters the list. refreshActiveView handles whichever is showing.
      refreshActiveView();
      // On a phone the chips live in a sheet, and picking a bank is the whole
      // reason it was opened - close it and put the cards back on screen.
      closeFilterSheet();
    };
  });
  renderNetworkBar();
  renderKindBar();
  renderMobileFilterBar();
  updateStickyOffsets();
}

// ---- Network filter -------------------------------------------------------
// Collapsed by default to a single "Network" dropdown. Opening it reveals the
// networks present (Visa, Mastercard, RuPay…); picking one then reveals that
// network's variants (Infinite, Select, Classic…). Nothing shows until the
// user opts in, so the bank selector stays the primary, uncluttered filter.
const NET_CARET = `<svg class="nt-caret" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="m7 10 5 5 5-5z"/></svg>`;

function renderNetworkBar() {
  // Networks are counted within the current bank selection, so the filter
  // narrows top-down: Bank → Network → Variant.
  let base = visibleCards();
  if (state.selectedBank !== "All") base = base.filter((c) => c.bank === state.selectedBank);

  const netCounts = {};
  base.forEach((c) => { if (c.network) netCounts[c.network] = (netCounts[c.network] || 0) + 1; });
  const presentNets = NETWORKS.filter((n) => netCounts[n]);
  // Drop a selection that no longer applies.
  if (state.selectedNetwork !== "All" && !netCounts[state.selectedNetwork]) {
    state.selectedNetwork = "All"; state.selectedVariant = "All";
  }

  const wrap = $("#netFilter");
  const slot = $("#netToggleSlot");
  if (!presentNets.length) {  // no networks anywhere yet — hide the whole filter
    wrap.hidden = true; wrap.innerHTML = "";
    slot.innerHTML = ""; state.networkOpen = false;
    return;
  }

  // The trigger lives in the top bar (beside archive). It shows the current
  // selection (if any) and a caret; its panel drops in below the bank selector.
  const selLabel = state.selectedNetwork === "All" ? ""
    : [state.selectedNetwork, state.selectedVariant === "All" ? "" : state.selectedVariant]
        .filter(Boolean).join(" · ");
  const hasSel = state.selectedNetwork !== "All";
  const netIcon = `<svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.9 9h-3a15.9 15.9 0 0 0-1-5.1A8 8 0 0 1 18.9 11ZM12 4c.8 1 1.6 3 1.8 7h-3.6C10.4 7 11.2 5 12 4ZM4.1 13h3c.1 1.9.5 3.6 1 5.1A8 8 0 0 1 4.1 13Zm3-2h-3a8 8 0 0 1 4-5.1c-.5 1.5-.9 3.2-1 5.1Zm2.9 2h4c-.2 4-1 6-1.8 7-.8-1-1.6-3-1.8-7Zm4.9 5.1c.5-1.5.9-3.2 1-5.1h3a8 8 0 0 1-4 5.1Z"/></svg>`;
  slot.innerHTML = `<button class="net-toggle ${state.networkOpen ? "is-open" : ""} ${hasSel ? "has-selection" : ""}" id="netToggle">
      <span class="nt-icon">${netIcon}</span>
      <span class="nt-label">Network</span>
      ${selLabel ? `<span class="nt-value">${esc(selLabel)}</span>` : ""}
      ${NET_CARET}
    </button>`;

  wrap.hidden = !state.networkOpen;
  let panel = "";
  if (state.networkOpen) {
    const withNetwork = base.filter((c) => c.network).length;
    const netOrder = ["All", ...presentNets];
    const netChips = netOrder.map((n) => {
      const isAll = n === "All";
      const active = state.selectedNetwork === n;
      const count = isAll ? withNetwork : netCounts[n];
      const glyph = isAll ? "◎" : (NET_GLYPH[n] || n.slice(0, 2));
      return `<button class="net-chip ${active ? "is-active" : ""}" data-net="${n}">
        <span class="net-glyph">${glyph}</span><span>${isAll ? "All networks" : n}</span><span class="count">${count}</span>
      </button>`;
    }).join("");

    // Variant row: only once a specific network is chosen and it has variants.
    let varRow = "";
    if (state.selectedNetwork !== "All") {
      const inNet = base.filter((c) => c.network === state.selectedNetwork);
      const vCounts = {};
      inNet.forEach((c) => { if (c.variant) vCounts[c.variant] = (vCounts[c.variant] || 0) + 1; });
      const presentVars = (NETWORK_VARIANTS[state.selectedNetwork] || []).filter((v) => vCounts[v]);
      if (state.selectedVariant !== "All" && !vCounts[state.selectedVariant]) state.selectedVariant = "All";
      if (presentVars.length) {
        const varOrder = ["All", ...presentVars];
        const varChips = varOrder.map((v) => {
          const active = state.selectedVariant === v;
          const count = v === "All" ? inNet.filter((c) => c.variant).length : vCounts[v];
          return `<button class="var-chip ${active ? "is-active" : ""}" data-var="${v}">
            <span>${v === "All" ? "All types" : v}</span><span class="count">${count}</span>
          </button>`;
        }).join("");
        varRow = `<div class="netbar-scroll subvar"><span class="filter-label sub">${esc(state.selectedNetwork)} type</span>${varChips}</div>`;
      }
    }
    panel = `<div class="net-panel">
      <div class="netbar-scroll"><span class="filter-label">Card network</span>${netChips}</div>
      ${varRow}
    </div>`;
  }

  wrap.innerHTML = panel;

  $("#netToggle").onclick = () => {
    state.networkOpen = !state.networkOpen;
    renderNetworkBar(); updateStickyOffsets();
  };
  wrap.querySelectorAll(".net-chip").forEach((el) => {
    el.onclick = () => {
      state.selectedNetwork = el.dataset.net;
      state.selectedVariant = "All";       // reset the sub-filter on network change
      renderNetworkBar(); renderCards(); updateStickyOffsets();
    };
  });
  wrap.querySelectorAll(".var-chip").forEach((el) => {
    el.onclick = () => {
      state.selectedVariant = el.dataset.var;
      renderNetworkBar(); renderCards(); updateStickyOffsets();
    };
  });
}

// Keep the sticky letter headers just below the (variable-height) filter block.
function updateStickyOffsets() {
  const tb = document.querySelector(".topbar");
  // On a phone the bank selector has been moved into the filter sheet, so the
  // sticky element under the header is the compact pill bar instead.
  // Measuring .bankbar here would return the sheet's height, or 0 while it is
  // hidden, and every reveal-panel offset would be wrong by ~300px.
  const bb = filtersAreMobile ? document.querySelector(".mfilter-bar")
                              : document.querySelector(".bankbar");
  const th = tb ? tb.offsetHeight : 108;
  const bh = bb && !bb.hidden ? bb.offsetHeight : 0;
  document.documentElement.style.setProperty("--topbar-h", th + "px");
  document.documentElement.style.setProperty("--alpha-top", (th + bh) + "px");
}

// ---- Card list (grouped by bank, A→Z) -------------------------------------
function renderCards() {
  queueFit();
  let cards = visibleCards();
  if (state.selectedBank !== "All") cards = cards.filter((c) => c.bank === state.selectedBank);
  if (state.selectedNetwork !== "All") cards = cards.filter((c) => c.network === state.selectedNetwork);
  if (state.selectedVariant !== "All") cards = cards.filter((c) => c.variant === state.selectedVariant);
  if (state.selectedKind !== "All") cards = cards.filter((c) => cardKind(c) === state.selectedKind);
  renderNudge();
  const q = state.search.trim();
  if (q) cards = cards.filter((c) => matchesSearch(c, q));

  const list = $("#cardList"), empty = $("#emptyState");
  if (!cards.length) {
    list.hidden = true; list.innerHTML = "";
    empty.hidden = false;
    const hasAny = state.cards.some((c) => !c.archived);
    const rel = state.selectedRelation;
    const relHasAny = rel === "All" || state.cards.some((c) => !c.archived && cardRelation(c) === rel);
    let title, msg;
    if (q) {
      title = `Nothing matches “${q}”`;
      msg = rel === "All" ? "Try a bank, a nickname, or the last 4 digits."
        : `Searching ${rel === "Self" ? "your own" : rel + "’s"} cards only — switch to All to search everyone’s.`;
    } else if (state.showArchived) {
      title = "No archived cards"; msg = "Cards you archive will show up here.";
    } else if (!hasAny) {
      title = "No cards yet"; msg = "Add your first card to get started.";
    } else if (!relHasAny) {
      title = rel === "Self" ? "No cards marked as yours" : `No ${rel} cards`;
      msg = rel === "Self"
        ? "Cards you add are marked Self unless you choose otherwise. Switch to All to see everything."
        : `Add a card for ${rel}, or pick another relation above.`;
    } else if (state.selectedBank !== "All") {
      title = `No ${state.selectedBank} cards`; msg = `Add a ${state.selectedBank} card, or pick another bank.`;
    } else if (state.selectedKind !== "All") {
      title = `No ${kindLabel(state.selectedKind).toLowerCase()}s here`; msg = "Clear the Type filter to see the rest.";
    } else {
      title = "No cards here"; msg = "Clear a filter to see more.";
    }
    $("#emptyTitle").textContent = title;
    $("#emptyMsg").textContent = msg;
    return;
  }
  empty.hidden = true; list.hidden = false;

  // Cards within a bank are laid out horizontally (a responsive grid). On a
  // single-bank view that's the whole list; on "All" we split into one section
  // per bank, ordered A→Z by BANK NAME (not by card name).
  const byName = (a, b) => displayName(a).localeCompare(displayName(b), undefined, { sensitivity: "base" });

  if (state.selectedBank !== "All") {
    cards.sort(byName);
    list.innerHTML = `<div class="card-grid">${cards.map(tileHTML).join("")}</div>`;
    wireTiles();
    return;
  }

  const groups = {};
  cards.forEach((c) => { (groups[c.bank] = groups[c.bank] || []).push(c); });
  const banks = Object.keys(groups).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }));
  list.innerHTML = banks.map((bank) => {
    const m = bankMeta(bank);
    const cs = groups[bank].sort(byName);
    return `
    <section class="bank-group" style="${bankStyle(bank)}">
      <div class="bank-head">
        <span class="glyph has-mark">${bankMarkSvg(bank, 18)}</span>
        <span class="bank-title">${esc(bank)}</span>
        <span class="count">${cs.length}</span>
      </div>
      <div class="card-grid">${cs.map(tileHTML).join("")}</div>
    </section>`;
  }).join("");
  wireTiles();
}

// ---- One tile -------------------------------------------------------------
function maskNumber(num) {
  const d = (num || "").replace(/\D/g, "");
  if (!d) return "•••• •••• •••• ••••";
  const last = d.slice(-4);
  const groups = Math.max(3, Math.ceil(d.length / 4) - 1);
  return Array(groups).fill("••••").join(" ") + " " + last;
}
function fullNumber(num) {
  const d = (num || "").replace(/\D/g, "");
  return d.replace(/(.{4})/g, "$1 ").trim();
}
// Cardholder is partly masked by default (shoulder-surf protection): each word
// keeps its first letter, the rest becomes bullets — "NISHANTH KUMAR" → "N••••••• K••••".
function maskHolder(name) {
  return (name || "").split(/\s+/)
    .map((w) => (w ? w[0] + "•".repeat(Math.max(1, w.length - 1)) : w))
    .join(" ");
}
// Sensitive values are masked by default (shoulder-surf protection) but a
// single click reveals them — no password re-prompt once you're logged in.
const isRevealed = (id) => state.revealed.has(id);
const esc = (s) => (s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
// Display names in Title Case ("BEJGAM NISHANTH" → "Bejgam Nishanth",
// "REWARDS" → "Rewards") on BOTH tabs. Formatting is display-only — the vault
// keeps storing holders uppercase, exactly as typed/normalised.
const titleCase = (s) => (s || "").toLowerCase()
  .replace(/(^|[\s\-./(])\S/g, (c) => c.toUpperCase());

// A tiny primary/add-on identity mark shown on every tile. A filled star marks
// the primary (main) card; a branch/link glyph marks an add-on card issued to
// family on the same account.
const ICON_PRIMARY = `<svg viewBox="0 0 24 24"><path fill="currentColor" d="m12 2 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17l-5.8 3 1.1-6.5L2.6 8.8l6.5-.9L12 2Z"/></svg>`;
const ICON_ADDON = `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 3a3 3 0 0 1 1 5.8V10a2 2 0 0 0 2 2h1.2a3 3 0 1 1 0 2H15a4 4 0 0 1-3-1.4A4 4 0 0 1 9 14H7.8a3 3 0 1 1 0-2H9a2 2 0 0 0 2-2V8.8A3 3 0 0 1 12 3Z"/></svg>`;
// 18px sized variants for the overflow menu row.
const ICON_PRIMARY_18 = `<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="m12 2 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17l-5.8 3 1.1-6.5L2.6 8.8l6.5-.9L12 2Z"/></svg>`;
const ICON_ADDON_18 = `<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 3a3 3 0 0 1 1 5.8V10a2 2 0 0 0 2 2h1.2a3 3 0 1 1 0 2H15a4 4 0 0 1-3-1.4A4 4 0 0 1 9 14H7.8a3 3 0 1 1 0-2H9a2 2 0 0 0 2-2V8.8A3 3 0 0 1 12 3Z"/></svg>`;
// 2.0: Virtual (phone with a card on it) and Dual (two cards on one account).
const ICON_VIRTUAL = `<svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M17 1H7a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm0 18H7V5h10v14Zm-8-9h6v1.5H9V10Zm0 3h4v1.5H9V13Z"/></svg>`;
const ICON_DUAL = `<svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M4 7h13a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Zm0 3v2h13v-2H4Zm3-7h13a2 2 0 0 1 2 2v9h-1.5V5.5H7V3Z"/></svg>`;
const sized18 = (svg) => svg.replace('width="12" height="12"', 'width="18" height="18"');
const markTags = (c) =>
  (c.virtual ? `<span class="tile-tag mark" title="Virtual card">${ICON_VIRTUAL}<span>Virtual</span></span>` : "")
  + (c.dual ? `<span class="tile-tag mark" title="Dual card">${ICON_DUAL}<span>Dual</span></span>` : "");
const roleBadge = (c) => c.addon
  ? `<span class="tile-role addon" title="Add-on card">${ICON_ADDON}<span>Add-on</span></span>`
  : `<span class="tile-role primary" title="Primary card">${ICON_PRIMARY}<span>Primary</span></span>`;

// 2.0: the Card Vault Keyhole mark (same drawing as the app icon and the
// header logo), for the centre of the Relations map.
const CV_MARK = '<rect x="13" y="21" width="46" height="31" rx="7" fill="#ffffff"/><rect x="13" y="27" width="46" height="4.6" fill="#ff7a2f"/>'
  + '<circle cx="36" cy="40" r="4.6" fill="#4b3fc8"/><path d="M33.59 42.53h4.83l1.61 6.21h-8.05z" fill="#4b3fc8"/>'
  + '<rect x="18" y="43.5" width="9" height="2.8" rx="1.4" fill="#4b3fc8" opacity=".55"/><rect x="45" y="43.5" width="9" height="2.8" rx="1.4" fill="#4b3fc8" opacity=".55"/>';

function tileHTML(c) {
  const m = bankMeta(c.bank);
  const copyIcon = `<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H8V7h11v14Z"/></svg>`;
  const shown = isRevealed(c.id);
  const cvvShown = shown && c.cvv;
  return `
  <article class="tile" style="${bankStyle(c.bank)}" data-id="${esc(c.id)}">
    <div class="tile-head">
      ${bankIllustration(m.seed)}
      <div class="tile-head-row">
        <span class="tile-bank"><span class="glyph has-mark">${bankMarkSvg(c.bank, 16)}</span><span class="tile-bank-name">${esc(c.bank)}</span></span>
        <div class="tile-head-right" style="display:flex;align-items:center;gap:6px">
          ${roleBadge(c)}
          ${netLabel(c) ? `<span class="tile-network">${esc(netLabel(c))}</span>` : ""}
          <button class="icon-btn tile-menu-btn" data-act="menu" aria-label="More">
            <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></svg>
          </button>
        </div>
      </div>
      <h3 class="tile-name">${esc(displayName(c)) || "Untitled card"}</h3>
      ${c.nickname ? `<div class="tile-subname">${esc(titleCase(c.card_name))}</div>` : ""}
      <div class="tile-tags">
        <span class="tile-tag kind-${cardKind(c)}">${kindLabel(cardKind(c))}</span>
        <span class="tile-tag rel">${ICON_PERSON}${esc(cardRelation(c))}</span>
        ${markTags(c)}
      </div>
    </div>

    <div class="tile-number">
      <span class="num" data-field="number" data-act="copy" data-copy="number" role="button" tabindex="0" title="Tap to copy number">${shown && c.number ? fullNumber(c.number) : maskNumber(c.number)}</span>
      <button class="mini-copy" data-act="copy" data-copy="number" title="Copy number">${copyIcon}</button>
      <button class="mini-copy" data-act="export" title="Export card details" aria-label="Export card details">${ICON_EXPORT}</button>
    </div>

    <div class="tile-body">
      <div class="detail">
        <div class="k">Cardholder</div>
        <div class="v" data-field="holder">${c.holder ? esc(shown ? titleCase(c.holder) : maskHolder(titleCase(c.holder))) : "—"}</div>
      </div>
      <div class="detail" style="flex:0 0 auto">
        <div class="k">Expiry</div>
        <div class="v">${esc(c.expiry) || "—"}</div>
      </div>
      <div class="detail" style="flex:0 0 auto">
        <div class="k">CVV</div>
        <div class="v secret" data-field="cvv">${c.cvv ? (cvvShown ? esc(c.cvv) : "•••") : "—"}</div>
      </div>
    </div>

    <div class="tile-foot">
      <button class="chip-btn" data-act="reveal">
        <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 5c-5 0-9 4.5-10 7 1 2.5 5 7 10 7s9-4.5 10-7c-1-2.5-5-7-10-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/></svg>
        <span data-reveal-label>${shown ? "Hide" : "Reveal"}</span>${shown ? `<span class="rv-left">${revealLeft(c.id)}s</span>` : ""}
      </button>
      <span class="spacer"></span>
      <button class="chip-btn" data-act="copy" data-copy="cvv" title="Copy CVV">CVV ${copyIcon}</button>
      <button class="chip-btn" data-act="copy" data-copy="expiry" title="Copy expiry">Exp ${copyIcon}</button>
      <button class="chip-btn" data-act="copy" data-copy="holder" title="Copy holder">Name ${copyIcon}</button>
    </div>
  </article>`;
}

function wireTiles() {
  $("#cardList").querySelectorAll(".tile").forEach((tile) => {
    const id = tile.dataset.id;
    const card = () => state.cards.find((c) => c.id === id);
    tile.querySelectorAll("[data-act]").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const act = btn.dataset.act;
        if (act === "menu") return openMenu(btn, card());
        if (act === "reveal") return onReveal(card());
        if (act === "copy") return onCopy(card(), btn.dataset.copy, btn);
        if (act === "export") return openExport(card());
      };
    });
  });
}

// ---- Reveal: a plain per-card show/hide toggle (no re-auth once logged in) --
// 1.3.9: a revealed card hides itself again after 45 s, so a full number is
// never left on an unattended screen. The Hide control counts down.
const REVEAL_MS = 45000;
const revealUntil = new Map();   // card id -> time it hides
let revealTick = null;
const revealLeft = (id) => Math.max(0, Math.ceil(((revealUntil.get(id) || 0) - Date.now()) / 1000));
function onReveal(card) {
  if (state.revealed.has(card.id)) { state.revealed.delete(card.id); revealUntil.delete(card.id); }
  else { state.revealed.add(card.id); revealUntil.set(card.id, Date.now() + REVEAL_MS); }
  renderCards();
  startRevealTick();
}
function startRevealTick() {
  if (revealTick) return;
  revealTick = setInterval(() => {
    let expired = false;
    for (const id of [...revealUntil.keys()]) {
      if (!state.revealed.has(id)) { revealUntil.delete(id); continue; }
      const left = revealLeft(id);
      if (left <= 0) { state.revealed.delete(id); revealUntil.delete(id); expired = true; continue; }
      // update the countdown in place - a re-render would replay the tile entrance
      const el = document.querySelector(`.tile[data-id="${CSS.escape(id)}"] .rv-left`);
      if (el) el.textContent = left + "s";
    }
    if (expired) renderCards();
    if (!revealUntil.size) { clearInterval(revealTick); revealTick = null; }
  }, 1000);
}

// ---- Copy -----------------------------------------------------------------
async function onCopy(card, field, btn) {
  let value = card[field] || "";
  if (field === "number") value = (card.number || "").replace(/\D/g, "");
  if (!value) return toast("Nothing to copy");
  // Goes through mobile.copySensitive, which also schedules the clipboard to
  // be overwritten. On a phone the clipboard is readable by every installed
  // app, so a card number left sitting there is a real leak with a long tail -
  // the desktop never had to think about this.
  const ok = await window.YCJ.mobile.copySensitive(value);
  if (!ok) return toast("Could not copy");
  const labels = { number: "Card number", cvv: "CVV", expiry: "Expiry", holder: "Cardholder" };
  const secs = Math.round(window.YCJ.mobile.CLIP_TTL_MS / 1000);
  if (btn) return markCopied(btn, field, secs);
  toast(`${labels[field] || "Value"} copied — clears in ${secs}s`);
}

// 1.3.9: the tapped control turns green with a tick for ~2.5 s ("Copied",
// "clears in 45s" in its title) instead of a pop-up. Tapping the number marks
// the number's copy button too, so the tick is where the eye expects it.
const ICON_TICK = `<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>`;
function markCopied(btn, field, secs) {
  const tile = btn.closest(".tile");
  const targets = [btn];
  if (field === "number" && tile) {
    const b = tile.querySelector('.mini-copy[data-copy="number"]');
    const n = tile.querySelector(".tile-number .num");
    [b, n].forEach((x) => x && !targets.includes(x) && targets.push(x));
  }
  targets.forEach((el) => {
    if (el._copyTimer) clearTimeout(el._copyTimer);
    else el._copyHTML = el.innerHTML;
    el.classList.add("is-copied");
    el.title = `Copied — clears from the clipboard in ${secs}s`;
    if (el.classList.contains("mini-copy")) el.innerHTML = ICON_TICK;
    else if (el.classList.contains("chip-btn")) el.innerHTML = ICON_TICK + "Copied";
    else if (el.classList.contains("num")) el.textContent = "Copied · clears in " + secs + "s";
    el._copyTimer = setTimeout(() => {
      el.classList.remove("is-copied");
      el.innerHTML = el._copyHTML; el._copyTimer = null;
    }, 2500);
  });
}

// ---- Export one card as text (1.3.6) ---------------------------------------
// User request: the whole card as plain text, in this order, to paste into a
// checkout or send to family. A preview first, so it is never sent blind.
const ICON_EXPORT = `<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 3 7.5 7.5l1.4 1.4L11 6.8V15h2V6.8l2.1 2.1 1.4-1.4L12 3ZM5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6h-2v6H7v-6H5Z"/></svg>`;
function cardAsText(c, withCvv) {
  return [
    ["Card no", fullNumber(c.number)],
    ["CVV", withCvv ? c.cvv : ""],
    ["Exp", c.expiry],
    ["Name", titleCase(c.holder || "")],
  ].filter(([, v]) => v).map(([k, v]) => k + ": " + v).join("\n");
}
function openExport(card) {
  // 1.3.9: CVV is OFF by default - number + expiry + CVV + name is everything
  // a fraudster needs, and chat apps keep what you send in their backups.
  let withCvv = false;
  let text = cardAsText(card, withCvv);
  if (!text) return toast("Nothing to export yet");
  const title = displayName(card) || card.bank || "Card";
  const secs = Math.round(window.YCJ.mobile.CLIP_TTL_MS / 1000);
  openModal(`
    <h2>Export card details</h2>
    <p>${esc(card.bank)} · ${esc(title)}</p>
    <pre class="export-text" id="exText">${esc(text)}</pre>
    ${card.cvv ? `<label class="vault-check export-cvv"><input type="checkbox" id="exCvv" /><span>Include CVV</span></label>` : ""}
    <p class="export-note">Includes the full number. A copy clears from the clipboard after ${secs}s; anything you share stays wherever you send it.</p>
    <div class="modal-foot">
      <button class="btn btn-text" id="exClose">Close</button>
      <button class="btn btn-tonal" id="exShare">Share</button>
      <button class="btn btn-filled" id="exCopy">Copy</button>
    </div>`);
  $("#exClose").onclick = closeModal;
  if ($("#exCvv")) $("#exCvv").onchange = () => {
    withCvv = $("#exCvv").checked;
    text = cardAsText(card, withCvv);
    $("#exText").textContent = text;
  };
  $("#exCopy").onclick = async () => {
    const ok = await window.YCJ.mobile.copySensitive(text);
    closeModal();
    toast(ok ? `Card details copied — clears in ${secs}s` : "Could not copy");
  };
  $("#exShare").onclick = async () => {
    closeModal();
    await window.YCJ.mobile.shareText(text, title);
  };
}

// ---- Overflow menu --------------------------------------------------------
function openMenu(anchor, card) {
  const menu = $("#menu");
  // In the post-expiry grace window the vault is readable but frozen. Offer
  // only the actions that still work: showing a user Edit and Delete when the
  // server will refuse them is worse than not offering them at all.
  const frozen = document.body.classList.contains("is-readonly");
  menu.innerHTML = (frozen ? "" : `
    <button data-m="edit"><svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25ZM20.7 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z"/></svg>Edit card</button>`)
    + `
    <button data-m="view"><svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 5c-5 0-9 4.5-10 7 1 2.5 5 7 10 7s9-4.5 10-7c-1-2.5-5-7-10-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"/></svg>View full details</button>`
    + (frozen ? "" : `
    <button data-m="role">${card.addon ? ICON_PRIMARY_18 : ICON_ADDON_18}${card.addon ? "Mark as primary card" : "Mark as add-on card"}</button>
    <button data-m="virtual">${sized18(ICON_VIRTUAL)}${card.virtual ? "Not a virtual card" : "Mark as virtual card"}</button>
    <button data-m="dual">${sized18(ICON_DUAL)}${card.dual ? "Not a dual card" : "Mark as dual card"}</button>
    <div class="sep"></div>
    <button data-m="archive"><svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M3 4h18v4H3V4Zm1 5h16v11H4V9Zm5 3v2h6v-2H9Z"/></svg>${card.archived ? "Unarchive" : "Archive"} card</button>
    <button data-m="delete" class="danger"><svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M6 7h12l-1 14H7L6 7Zm3-3h6l1 2h4v2H2V6h4l1-2Z"/></svg>Delete card</button>`);
  menu.hidden = false;
  const r = anchor.getBoundingClientRect();
  const mw = 200;
  let left = r.right - mw; if (left < 8) left = 8;
  let top = r.bottom + 6;
  const mh = menu.offsetHeight || 200;   // 2.0: two more rows (Virtual, Dual)
  if (top + mh > window.innerHeight) top = r.top - mh;
  menu.style.left = left + "px"; menu.style.top = Math.max(8, top) + "px";
  menu.querySelectorAll("button").forEach((b) => {
    b.onclick = () => { menu.hidden = true; onMenu(b.dataset.m, card); };
  });
}
async function onMenu(action, card) {
  if (action === "edit") return openSheet(card);
  if (action === "view") return openDetails(card);
  if (action === "role") {
    await api.send(`/api/cards/${card.id}`, "PUT", { addon: !card.addon });
    card.addon = !card.addon;
    refreshActiveView();
    return toast(card.addon ? "Marked as add-on card" : "Marked as primary card");
  }
  if (action === "virtual" || action === "dual") {
    // The tag appearing (or leaving) on the tile is the confirmation.
    await api.send(`/api/cards/${card.id}`, "PUT", { [action]: !card[action] });
    card[action] = !card[action];
    return refreshActiveView();
  }
  if (action === "archive") {
    await api.send(`/api/cards/${card.id}`, "PUT", { archived: !card.archived });
    card.archived = !card.archived;
    refreshActiveView();
    return toast(card.archived ? "Card archived" : "Card restored");
  }
  if (action === "delete") return confirmDelete(card);
}

function openDetails(card) {
  const rows = [
    ["Bank", esc(card.bank)],
    ["Card name", esc(titleCase(card.card_name))],
    ["Nickname", esc(card.nickname) || "—"],
    ["Card type", kindLabel(cardKind(card))],
    ["Relation", esc(cardRelation(card))],
    ["Number", fullNumber(card.number) || "—"],
    ["Cardholder", esc(titleCase(card.holder)) || "—"],
    ["Expiry", esc(card.expiry) || "—"],
    ["CVV", esc(card.cvv) || "—"],
    ["Network", esc(netLabel(card)) || "—"],
    ["Role", (card.addon ? "Add-on card" : "Primary card") + (card.dual ? " · Dual" : "") + (card.virtual ? " · Virtual" : "")],
    ["Notes", esc(card.notes) || "—"],
  ];
  openModal(`
    <h2>${esc(displayName(card)) || "Card"}</h2>
    <p>${esc(card.bank)} — full details</p>
    <div class="detail-list">${rows.map(([k, v]) => `<div class="row"><div class="rk">${k}</div><div class="rv">${v}</div></div>`).join("")}</div>
    <div class="modal-foot"><button class="btn btn-text" id="dEdit">Edit</button><button class="btn btn-filled" id="dClose">Done</button></div>`);
  $("#dClose").onclick = closeModal;
  $("#dEdit").onclick = () => { closeModal(); openSheet(card); };
}

function confirmDelete(card) {
  openModal(`
    <div class="reveal-badge" style="background:linear-gradient(135deg,var(--m3-error),#e0685f)">
      <svg viewBox="0 0 24 24" width="26" height="26"><path fill="currentColor" d="M6 7h12l-1 14H7L6 7Zm3-3h6l1 2h4v2H2V6h4l1-2Z"/></svg>
    </div>
    <h2>Delete this card?</h2>
    <p>“${esc(titleCase(card.card_name)) || "Untitled card"}” will be permanently removed from your vault. This can't be undone — confirm your master password to delete.</p>
    <form id="delForm" autocomplete="off">
      <div class="field"><input id="delPw" type="password" placeholder=" " required /><label for="delPw">Master password</label></div>
      <p class="lock-error" id="delErr" hidden></p>
      <div class="modal-foot">
        <button type="button" class="btn btn-text" id="delCancel">Cancel</button>
        <button type="submit" class="btn btn-danger">Delete card</button>
      </div>
    </form>`);
  setTimeout(() => $("#delPw")?.focus(), 30);
  $("#delCancel").onclick = closeModal;
  $("#delForm").onsubmit = async (e) => {
    e.preventDefault();
    const v = await api.send("/api/verify", "POST", { password: $("#delPw").value });
    if (!v.ok) return showErr($("#delErr"), "Wrong password — card not deleted.");
    await api.send(`/api/cards/${card.id}`, "DELETE");
    state.cards = state.cards.filter((c) => c.id !== card.id);
    closeModal(); refreshActiveView(); toast("Card deleted");
  };
}

// ---- Add / edit sheet -----------------------------------------------------
function openSheet(card) {
  const editing = !!card;
  $("#sheetTitle").textContent = editing ? "Edit card" : "Add card";
  // "Paste many" is an alternative way to ADD; it has no meaning while
  // editing one existing card, where it would just be a way to lose your
  // unsaved changes.
  $("#sheetImportBtn").hidden = editing;
  // The scanner is for adding a card; while editing it would overwrite fields
  // the user has already checked.
  $("#sheet").toggleAttribute("data-editing", editing);
  $("#saveBtn").textContent = editing ? "Save changes" : "Save card";
  $("#fId").value = card?.id || "";
  $("#fBank").value = card?.bank || "";
  closeBankSuggest();
  $("#fName").value = card?.card_name || "";
  $("#fNickname").value = card?.nickname || "";
  setSeg("#fKindSeg", "#fKind", "kind", card ? cardKind(card) : "credit");
  fillRelationOptions(card ? cardRelation(card)
    : (state.selectedRelation === "All" ? "Self" : state.selectedRelation));
  $("#fNumber").value = card ? fullNumber(card.number) : "";
  $("#fNumberErr").hidden = true;
  $("#fHolder").value = card?.holder || "";
  $("#fExpiry").value = card?.expiry || "";
  $("#fCvv").value = card?.cvv || "";
  const netSel = $("#fNetwork");
  netSel.innerHTML = `<option value="" disabled ${card?.network ? "" : "selected"}>Choose…</option>`
    + NETWORKS.map((n) => `<option>${n}</option>`).join("");
  netSel.value = card?.network || "";
  fillVariantOptions(card?.variant || "");
  $("#fNotes").value = card?.notes || "";
  $("#fAddon").checked = !!card?.addon;
  reflectAddonToggle();
  $("#fVirtual").checked = !!card?.virtual;
  $("#fDual").checked = !!card?.dual;
  syncHolderClear();
  $("#sheet").hidden = false;
  // A new card starts at the bank; editing starts at the name, as before.
  // 2.0 (feedback): a new card opens at the top - Scan card / Tap card in
  // view, no field focused, no keyboard, no bank list. Editing still starts
  // at the name.
  $("#sheet .sheet").scrollTop = 0;
  if (editing) setTimeout(() => $("#fName").focus(), 40);
}

// ---- Unsaved card survives the auto-lock (1.3.6) ---------------------------
// User feedback: switch apps mid-way through adding a card (to copy the
// number from the bank's app, say), stay past the auto-lock, and everything
// typed was gone - lockNow() closes the sheet. The form is now held IN MEMORY
// ONLY across the lock and put back after the next successful unlock. It is
// never written to storage: it can hold a card number and CVV in clear. If
// Android kills the app while it is in the background, it is lost with it.
let sheetDraft = null;
const DRAFT_TEXT = ["fBank", "fName", "fNickname", "fNumber", "fHolder", "fExpiry", "fCvv", "fNotes"];
function captureSheetDraft() {
  if ($("#sheet").hidden) return null;
  const d = {
    id: $("#fId").value, kind: $("#fKind").value, relation: $("#fRelation").value,
    network: $("#fNetwork").value, variant: $("#fVariant").value, addon: $("#fAddon").checked,
    virtual: $("#fVirtual").checked, dual: $("#fDual").checked,
  };
  DRAFT_TEXT.forEach((f) => { d[f] = $("#" + f).value; });
  // An empty Add sheet is not worth reopening.
  return d.id || DRAFT_TEXT.some((f) => d[f].trim()) ? d : null;
}
function restoreSheetDraft(d) {
  const card = d.id ? state.cards.find((c) => c.id === d.id) : null;
  openSheet(card || undefined);
  DRAFT_TEXT.forEach((f) => { $("#" + f).value = d[f]; });
  setSeg("#fKindSeg", "#fKind", "kind", d.kind || "credit");
  fillRelationOptions(d.relation || "Self");
  $("#fNetwork").value = d.network || "";
  fillVariantOptions(d.variant || "");
  $("#fAddon").checked = !!d.addon;
  reflectAddonToggle();
  $("#fVirtual").checked = !!d.virtual;
  $("#fDual").checked = !!d.dual;
  syncHolderClear();
}

// ---- Bank picker (1.3.6) ---------------------------------------------------
// Type-ahead over the known banks, their full names, the banks already in
// this vault and the ones this phone has added. Ported from Gift Card Vault's
// store picker at the user's request: "st" should offer StanChart and SBI,
// and a bank that is not listed should be one tap to add.
const BANK_ALIASES = {
  "HDFC": "HDFC Bank", "ICICI": "ICICI Bank", "Axis": "Axis Bank", "SBI": "State Bank of India SBI Card",
  "Kotak": "Kotak Mahindra Bank", "IndusInd": "IndusInd Bank", "IDFC": "IDFC First Bank",
  "Yes": "Yes Bank", "RBL": "RBL Bank Ratnakar", "AU": "AU Small Finance Bank", "Amex": "American Express",
  "Citi": "Citibank", "HSBC": "HSBC Bank", "StanChart": "Standard Chartered", "Federal": "Federal Bank",
  "BoB": "Bank of Baroda BOBCARD", "PNB": "Punjab National Bank", "Canara": "Canara Bank",
  "Union": "Union Bank of India", "BoI": "Bank of India", "IDBI": "IDBI Bank", "DBS": "DBS Bank digibank",
  "Bajaj": "Bajaj Finserv", "OneCard": "OneCard", "Equitas": "Equitas Small Finance Bank",
  "CUB": "City Union Bank", "Roar": "Roar Bank", "Slice": "Slice Small Finance Bank",
};
// 2.0 (feedback): the bank list shows ONE name per row, the full one.
const BANK_FULL = {
  "HDFC": "HDFC Bank", "ICICI": "ICICI Bank", "Axis": "Axis Bank", "SBI": "SBI Card",
  "Kotak": "Kotak Mahindra Bank", "IndusInd": "IndusInd Bank", "IDFC": "IDFC First Bank",
  "Yes": "Yes Bank", "RBL": "RBL Bank", "AU": "AU Small Finance Bank", "Amex": "American Express",
  "Citi": "Citibank", "HSBC": "HSBC", "StanChart": "Standard Chartered", "Federal": "Federal Bank",
  "BoB": "Bank of Baroda", "PNB": "Punjab National Bank", "Canara": "Canara Bank",
  "Union": "Union Bank of India", "BoI": "Bank of India", "IDBI": "IDBI Bank", "DBS": "DBS Bank",
  "Bajaj": "Bajaj Finserv", "OneCard": "OneCard", "Equitas": "Equitas Small Finance Bank",
  "CUB": "City Union Bank", "Roar": "Roar Bank", "Slice": "Slice",
};
const bankFullName = (n) => BANK_FULL[n] || n;

// 2.0 (feedback): a mark for each bank, white on the bank's own colours.
// Where the bank publishes a usable logo file (Wikimedia Commons) its EMBLEM
// was cut out and traced, without the wordmark: HDFC, ICICI, Axis, SBI,
// IndusInd, IDFC, Yes, RBL, Amex, Citi, HSBC, StanChart, Canara, Union, Bajaj,
// PNB - a second logo colour becomes a lighter white. The rest are drawn in
// the same weight. A bank the user adds gets BANK_MARK_ANY.
const BANK_MARKS = {
  HDFC: "<g transform=\"scale(0.05594)\" fill-rule=\"evenodd\"><path d=\"M 78 214.5 L 78 413 168.0 413 L 258.0 413 257.7 378.2 L 257.5 343.5 202.7 343.2 L 148 342.9 148 288.4 L 148 234 113.5 234 L 79 234 79 214.5 L 79 195 113.5 195 L 148 195 148 140.5 L 148 86.0 202.7 85.7 L 257.5 85.5 257.7 50.7 L 258.0 16 168.0 16 L 78 16 78 214.5 M 297 51 L 297 86 323.5 86 L 350 86 350 51 L 350 16 323.5 16 L 297 16 297 51 M 247.2 274.7 C 263.6 274.9, 290.3 274.9, 306.7 274.7 C 323.1 274.5, 309.7 274.4, 277 274.4 C 244.2 274.4, 230.8 274.5, 247.2 274.7 M 297 378 L 297 413 323.5 413 L 350 413 350 378 L 350 343 323.5 343 L 297 343 297 378\"/><path opacity=\".55\" d=\"M 217 214.5 L 217 274 277 274 L 337 274 337 214.5 L 337 155 277 155 L 217 155 217 214.5\"/></g>",
  ICICI: "<g transform=\"scale(0.04715)\" fill-rule=\"evenodd\"><path d=\"M 386 20.0 C 245.2 39.4, 90.6 210.5, 80.0 358.6 C 74.9 430.4, 108.3 479.4, 168.6 488.4 C 176.5 489.6, 178.4 489.6, 182.5 488.4 C 209.6 480.2, 234.4 433.3, 254.9 351.5 C 266.0 307.0, 269.1 268.5, 262.3 259.1 C 255.2 249.4, 239.9 249.6, 218 259.9 C 205.0 266.0, 203.5 266.4, 200.0 265.0 C 195.1 263, 195.3 258.1, 200.5 249.9 C 210.7 233.7, 271.0 187.9, 303.0 171.8 C 313.2 166.8, 319.1 165.6, 331.5 166.2 C 347.5 166.9, 357.2 172.8, 359.9 183.6 C 361.5 190.1, 360.6 193.7, 348.9 227 C 308.7 341.4, 294.5 409.8, 306.0 433.6 C 308.6 439.0, 311.9 441.0, 319.1 441.9 L 324.9 442.6 337.6 433.3 C 369.4 410.2, 400.1 381.3, 424.4 351.6 L 430 344.8 430 183.0 C 430 29.8, 429.9 21.1, 428.2 20.4 C 425.5 19.3, 393.4 19.0, 386 20.0 M 378.1 56.4 C 337.6 65.5, 303.8 120.8, 326.9 140.3 C 342.8 153.6, 382.8 135.0, 400.4 106.0 C 410.0 90.3, 412.4 73.4, 406.4 64.8 C 400.7 56.6, 390.6 53.7, 378.1 56.4\"/></g>",
  Axis: "<g transform=\"scale(0.03550)\" fill-rule=\"evenodd\"><path d=\"M 331.2 80.6 C 327.4 87.1, 303.8 127.3, 278.9 170 C 254.0 212.6, 187.5 326.2, 131.2 422.5 C 42.4 574.0, 25 604.3, 25 606.5 C 25 606.8, 68.8 607, 122.4 607 L 219.8 607 228.5 591.7 C 238.9 573.8, 269.7 521.0, 296.9 474.5 C 328.5 420.5, 434 235.1, 434 233.5 C 434 232.4, 340.6 71.4, 338.9 69.6 C 338.5 69.1, 335.0 74.1, 331.2 80.6 M 339 404.0 C 339 405.5, 362.1 446.0, 407.2 523.5 C 428.7 560.3, 448.3 594.1, 450.9 598.5 L 455.5 606.5 553.3 606.7 C 646.3 606.9, 651.1 606.9, 650.5 605.2 C 649.6 602.9, 633.8 575.5, 588.4 497.5 C 568 462.3, 547.4 426.9, 542.8 419 L 534.4 404.5 502.4 403.8 C 446.0 402.8, 339 402.8, 339 404.0\"/></g>",
  SBI: "<g transform=\"scale(0.03715)\" fill-rule=\"evenodd\"><path d=\"M 297.5 24.6 C 221.3 32.3, 153.8 65.4, 103.8 119.5 C 5.5 225.7, -2.7 386.8, 84.1 502 C 135.7 570.4, 210.6 612.0, 297.7 620.4 L 304 621.0 304 498.5 L 304 376.0 298.1 373.0 C 266.2 356.9, 259.4 313.4, 284.9 287.8 C 306.2 266.4, 339.8 266.4, 361.0 287.8 C 368.7 295.7, 372.3 302.0, 375.0 312.5 C 378.3 325.5, 376.6 339.3, 370.2 351.3 C 366.4 358.5, 354.7 369.9, 347.7 373.3 L 342 376.0 342 498.5 L 342 621.0 348.2 620.4 C 468.5 608.5, 567.0 531.8, 605.5 419.8 C 666.2 243.2, 552.3 55.5, 367 26.8 C 354.0 24.8, 309.2 23.4, 297.5 24.6\"/></g>",
  Kotak: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 12c-1.9-2.6-3.6-4-5.6-4a4 4 0 0 0 0 8c2 0 3.7-1.4 5.6-4s3.6-4 5.6-4a4 4 0 0 1 0 8c-2 0-3.7-1.4-5.6-4Z\"/></g>",
  IndusInd: "<g transform=\"scale(0.09091)\" fill-rule=\"evenodd\"><path d=\"M 120.4 11.2 C 119.6 13.6, 68 250.9, 68 252.4 C 68 253.8, 71.4 253.9, 99.7 253.7 L 131.4 253.5 157.6 132.5 C 172.1 65.9, 183.9 11.1, 183.9 10.7 C 184.0 9.3, 120.9 9.8, 120.4 11.2 M 181.0 184.2 C 173.1 221.2, 166.6 251.9, 166.5 252.5 C 166.5 253.1, 172.1 253.6, 181.2 253.7 L 196 254.0 196 185.5 C 196 147.8, 195.8 117, 195.7 117 C 195.5 117, 189.0 147.2, 181.0 184.2\"/></g>",
  IDFC: "<g transform=\"scale(0.05621)\" fill-rule=\"evenodd\"><path d=\"M 16 213 L 16 410 213.5 410 L 411 410 411 213 L 411 16 213.5 16 L 16 16 16 213 M 44 213 L 44 382 213.5 382 L 383 382 383 213 L 383 44 213.5 44 L 44 44 44 213 M 81 112.5 L 81 145 213.5 145 L 346 145 346 112.5 L 346 80 213.5 80 L 81 80 81 112.5 M 81 213 L 81 245 163 245 L 245 245 245 213 L 245 181 163 181 L 81 181 81 213 M 81 313.5 L 81 346 113 346 L 145 346 145 313.5 L 145 281 113 281 L 81 281 81 313.5\"/></g>",
  Yes: "<g transform=\"scale(0.03902)\" fill-rule=\"evenodd\"><path d=\"M 338.8 259.4 L 163.5 495.9 131.6 495.9 C 113.6 495.9, 99.9 496.3, 100.1 496.8 C 100.7 498.4, 193.7 592.0, 194.6 591.9 C 195.1 591.9, 198.1 587.1, 201.4 581.2 C 208.6 568.0, 394.0 238.5, 464.2 114.1 C 492.2 64.4, 514.9 23.6, 514.6 23.3 C 514.4 23.1, 435.3 129.3, 338.8 259.4\"/></g>",
  RBL: "<g transform=\"scale(0.03909)\" fill-rule=\"evenodd\"><path d=\"M 91.0 172.7 C 91.1 319.7, 91.2 322.3, 92.9 312 C 99.0 276.3, 114.6 241.1, 136.9 213 C 150.2 196.1, 177.4 172.0, 192.8 163.4 L 197.9 160.5 197.9 91.7 L 198 23 144.5 23 L 91 23 91.0 172.7 M 320.2 186.1 L 320.5 240.2 329 242.0 C 361.0 248.5, 389.7 271.2, 404.0 301.2 C 427.9 351.7, 409.1 413.0, 361.1 440.9 C 313.0 468.7, 252.6 456.0, 218.9 411 C 209.5 398.3, 200.9 376.4, 199.1 360 C 198.5 355.3, 198.2 387.0, 198.1 443.7 L 198 534.9 202.6 537.6 C 209.8 541.8, 227.4 549.4, 239.1 553.3 C 276.8 565.9, 320.9 567.4, 360.1 557.4 C 443.6 536.2, 507.6 465.5, 520.4 380 C 538.1 261.9, 456.1 150.9, 338.2 133.5 C 332.6 132.6, 326.2 132, 323.9 132 L 319.9 132 320.2 186.1\"/><path opacity=\".55\" d=\"M 273.1 133.6 C 181.4 147.7, 108.1 220.5, 92.9 312.5 C 91.0 324.0, 91 329.6, 91 457.7 L 91 591 144.5 591 L 198 591 198 469.1 C 198 391.9, 198.3 343.4, 199.0 337.0 C 203.8 289.9, 238.3 251.3, 284 242.0 L 292.5 240.2 292.7 186.1 L 293.0 132 287.7 132.0 C 284.8 132.1, 278.3 132.8, 273.1 133.6\"/></g>",
  AU: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 18.5 7.4 5.5l4.4 13M4.6 14h5.6\"/><path d=\"M14.2 5.5v8.2a3.4 3.4 0 0 0 6.8 0V5.5\"/></g>",
  Amex: "<g transform=\"scale(0.03698)\" fill-rule=\"evenodd\"><path d=\"M 24.0 150.7 L 24.0 277.5 35.2 251.2 L 46.5 225.0 65.9 225.2 L 85.3 225.5 91.4 239.4 L 97.5 253.3 97.7 239.1 L 98.0 224.9 122.2 225.2 L 146.4 225.5 149.8 235.2 C 151.7 240.6, 153.5 245, 153.9 245 C 154.3 245, 156.2 240.5, 158.0 235 L 161.4 225 269.7 225 L 378 225 378 230 C 378 235.8, 377.8 235.7, 382.5 232.5 C 392.7 225.6, 393.4 225.5, 438 225.2 L 478.5 224.8 484.5 238.9 C 487.8 246.6, 490.8 252.9, 491.2 252.9 C 491.6 252.9, 492 246.7, 492 239 L 492 225 511.8 225 L 531.7 225 537.1 233.1 L 542.5 241.3 542.7 233.1 L 543.0 225 563.0 225 L 583 225 583 271.5 L 583 318 562.7 317.9 L 542.5 317.9 537.5 309.7 L 532.5 301.6 532.2 309.8 L 531.9 318.0 502.2 317.7 L 472.6 317.5 469.6 310.2 L 466.7 302.9 458.6 303.2 L 450.6 303.5 447.6 310.7 L 444.7 318 421.5 318 C 395.5 318, 392.2 317.4, 383.3 311.5 L 378 307.9 378 312.9 L 378 318 347.6 318 L 317.3 318 311.4 310.7 L 305.5 303.5 305.2 310.7 L 304.9 318 192.1 318 L 79.4 318 76.9 311.4 C 73.8 303.0, 73.5 302.8, 64.8 303.2 L 57.5 303.5 54.5 310.7 L 51.6 318 37.8 318 L 24 318 24 471.0 L 24 624.0 323.7 623.7 L 623.5 623.5 623.7 529.3 L 624.0 435.1 618.6 437.5 C 609.1 441.9, 607.0 442, 503.0 442 L 403.2 442 396.8 434.2 L 390.5 426.5 390.2 434.2 L 389.9 442 370.9 442 L 352 442 352 429.3 L 352 416.7 349.2 417.5 C 342.4 419.3, 337.8 419.9, 329.2 419.9 L 320 420 320 431 L 320 442 290.5 442 L 261.1 442 256 435 C 253.1 431.1, 250.5 428.0, 250.1 428.0 C 249.7 428.0, 247.1 431.2, 244.1 435.0 L 238.8 442 189.9 442 L 141 442 141 395 L 141 348 190.3 348 L 239.7 348 244.5 354.2 C 247.1 357.6, 249.6 360.8, 250.0 361.3 C 250.4 361.7, 253.3 358.9, 256.4 355.0 L 262.2 348 443.1 348 L 624.0 348 623.7 186.2 L 623.5 24.5 323.7 24.2 L 24 23.9 24.0 150.7 M 53.0 238.7 C 50.6 243.9, 24 306.1, 24 306.6 C 24 306.8, 28.5 306.9, 34.1 306.7 L 44.2 306.5 46.8 299.7 L 49.4 293 65.6 293 L 81.8 293 84.5 300 L 87.3 307 97.7 307 C 105.7 307, 108.0 306.7, 107.7 305.7 C 107.4 305.0, 100.5 289.0, 92.4 270.2 L 77.7 236 66.0 236 L 54.3 236 53.0 238.7 M 109.2 271.2 L 109.5 306.5 118.7 306.7 L 127.9 307.0 128.2 282.7 L 128.5 258.5 137.0 282.5 L 145.6 306.5 153.7 306.7 L 161.7 307.0 170.6 282.4 L 179.5 257.7 179.7 282.3 L 180.0 307 189.0 307 L 198 307 198 271.4 L 198 235.9 183.7 236.2 L 169.5 236.5 161.8 258.5 C 157.6 270.6, 153.9 279.8, 153.5 279 C 153.2 278.1, 149.6 268.2, 145.6 257 L 138.2 236.5 123.6 236.2 L 108.9 235.9 109.2 271.2 M 210 271.5 L 210 307 239 307 L 268 307 268 299 L 268 291 248 291 L 228 291 228 285 L 228 279 247.5 279 L 267 279 267 271.5 L 267 264 247.5 264 L 228 264 228 258 L 228 252 248 252 L 268 252 268 244 L 268 236 239 236 L 210 236 210 271.5 M 277 271.4 L 277 307.0 286.2 306.7 L 295.5 306.5 295.7 294.2 L 296.0 282 299.3 282 C 302.3 282, 303.6 283.1, 313.0 294.4 L 323.5 306.9 334.2 306.9 C 340.1 306.9, 345 306.7, 345 306.4 C 345 306.0, 340.1 300.3, 334.1 293.6 L 323.2 281.4 329.0 278.7 C 346.1 270.6, 346.1 247.5, 329 238.3 C 325.9 236.7, 322.6 236.4, 301.2 236.1 L 277 235.8 277 271.4 M 348 271.5 L 348 307 357.5 307 L 367 307 367 271.5 L 367 236 357.5 236 L 348 236 348 271.5 M 396.4 238.0 C 388.3 240.5, 382.8 245.4, 378.7 253.7 C 375.7 260.0, 375.5 261.1, 375.5 270.9 C 375.5 285.0, 377.3 290.4, 384.8 298.0 C 390.9 304.2, 397.2 307, 405.5 307 L 409.7 307 413.2 299.2 L 416.8 291.5 414.1 291.2 C 399.2 289.8, 393.7 284.7, 393.7 272.0 C 393.7 265.0, 395.1 261.0, 399.1 257.3 C 402.9 253.7, 406.4 253, 418.5 253 L 430 253 430 244.5 L 430 236 416.2 236.0 C 405.5 236.1, 401.1 236.5, 396.4 238.0 M 432.4 270.5 C 424.2 289.6, 417.3 305.6, 417.1 306.1 C 416.9 306.6, 421.1 306.9, 427.0 306.7 L 437.3 306.5 440.0 300 L 442.6 293.5 458.9 293.5 L 475.2 293.5 477.8 300.2 L 480.4 307 490.7 307 C 496.3 307, 501 306.8, 501 306.5 C 501 306.3, 494.2 290.4, 486.0 271.3 L 471.1 236.5 459.2 236.2 L 447.4 235.9 432.4 270.5 M 503 271.5 L 503 307 511.9 307 L 520.9 307 521.2 285.0 L 521.5 263.0 535.5 285.0 L 549.5 306.9 560.7 306.9 L 572 307 572 271.5 L 572 236 563.0 236 L 554.0 236 553.7 257.5 L 553.5 279.1 539.6 257.5 L 525.7 236 514.3 236 L 503 236 503 271.5 M 296 258.9 L 296 266 307.2 266 C 320.4 266, 323 264.9, 323 259.5 C 323 253.7, 320.4 252.5, 307.3 252.1 L 296 251.8 296 258.9 M 60.7 265.5 L 56.1 277 65.5 277 C 70.7 277, 75 276.8, 75 276.5 C 75 276.0, 66.0 254.7, 65.6 254.3 C 65.4 254.1, 63.2 259.1, 60.7 265.5 M 454.2 264.8 C 451.9 270.7, 450 275.8, 450 276.2 C 450 276.6, 454.0 277, 459 277 C 463.9 277, 468 276.7, 468 276.4 C 468 275.5, 459.8 255.5, 459.1 254.8 C 458.7 254.4, 456.5 258.9, 454.2 264.8 M 152 394.5 L 152 430 181 430 L 210 430 210 422 L 210 414 190.5 414 L 171 414 171 408 L 171 402 190 402 L 209 402 209 394.5 L 209 387 190 387 L 171 387 171 381.5 L 171 376 190.5 376 L 210 376 210 367.5 L 210 359 181 359 L 152 359 152 394.5 M 214.1 363.2 C 229.9 382.7, 239 394.3, 239 395.1 C 239 395.8, 219.7 420.6, 213.1 428.2 C 211.7 429.9, 212.3 430, 223.1 430 L 234.6 430 241.4 420.4 C 245.2 415.2, 248.8 410.5, 249.4 410.0 C 250.2 409.3, 253.0 412.4, 258.4 419.5 L 266.3 430 277.7 430 C 286.8 430, 289.0 429.7, 288.2 428.7 C 287.7 428.0, 282.0 420.8, 275.7 412.8 C 269.3 404.7, 263.5 397.2, 262.9 396.2 C 261.8 394.5, 263.3 392.3, 275.3 377.2 C 282.8 367.9, 289 359.9, 289 359.6 C 289 359.2, 284.1 359.0, 278.2 359.0 L 267.5 359.0 259.1 370.0 L 250.8 381.0 242.2 370.0 L 233.7 359 222.2 359 L 210.7 359 214.1 363.2 M 291 394.5 L 291 430 300 430 L 309 430 309 419.1 L 309 408.2 323.2 407.8 C 336.3 407.4, 337.9 407.1, 342.7 404.6 C 357.5 397.0, 360.0 376.1, 347.5 365.1 C 341.5 359.9, 336.2 359, 312.3 359 L 291 359 291 394.5 M 363 394.5 L 363 430 372 430 L 381 430 381 417.5 L 381 405 384.3 405 C 387.4 405, 388.5 406.0, 398.1 417.4 L 408.5 429.9 419.8 429.9 L 431.2 430 424.2 422.2 C 420.3 417.9, 415.1 412.1, 412.5 409.2 C 409.3 405.6, 408.3 404, 409.4 404 C 411.9 404, 418.2 400.4, 421.1 397.3 C 429.2 388.8, 428.9 374.8, 420.3 366.3 C 413.9 359.8, 409.6 359, 384.3 359 L 363 359 363 394.5 M 434 394.5 L 434 430 463 430 L 492 430 492 422 L 492 414 472 414 L 452 414 452 408 L 452 402 471.5 402 L 491 402 491 394.5 L 491 387 471.5 387 L 452 387 452 381.5 L 452 376.0 471.7 375.7 L 491.5 375.5 491.7 367.2 L 492.0 359 463.0 359 L 434 359 434 394.5 M 515.7 360.0 C 499.8 363.8, 492.6 378.6, 499.9 392.9 C 503.9 400.6, 509.9 403, 525.9 403 C 538.5 403, 542.0 404.1, 541.9 408.3 C 541.9 413.3, 541.4 413.4, 519.7 414 L 499.5 414.5 499.2 422.2 L 498.9 430 520.7 429.9 C 532.7 429.9, 544.1 429.5, 546.2 428.9 C 559.1 425.3, 565.0 405.6, 556.5 394.4 C 552.3 388.9, 548.0 387.5, 534 387.2 C 527.1 387.0, 520.4 386.7, 519.2 386.4 C 515.9 385.7, 514.5 381.4, 516.4 378.3 C 518.0 376.0, 518.2 376, 535.0 376 L 551.9 376 554.3 371.2 C 555.6 368.6, 557.4 364.8, 558.3 362.7 L 559.8 359 539.6 359.1 C 528.5 359.1, 517.8 359.6, 515.7 360.0 M 579 360.6 C 562.2 365.0, 556.0 385.3, 567.8 397.1 C 572.6 401.8, 577.0 402.9, 591.2 402.9 C 603.7 403, 607 404.1, 607 408.8 C 607 413.4, 604.6 414, 583.6 414 L 564 414 564 422 L 564 430 586.3 430 C 612.2 430, 616.0 428.9, 621.6 420.7 C 625.6 414.7, 625.8 401.3, 622.0 395.7 C 617.4 389.0, 613.4 387.6, 597.1 387.0 C 581.9 386.4, 580 385.7, 580 380.8 C 580 376.5, 582.2 376, 599.9 376 L 616.7 376 620.3 368.3 C 622.3 364.2, 624 360.3, 624 359.8 C 624 358.3, 585.2 358.9, 579 360.6 M 309 383.5 L 309 391 320.9 391 C 332.6 391, 332.8 390.9, 334.9 388.3 C 336.0 386.9, 337 384.7, 337 383.5 C 337 382.2, 336.0 380.0, 334.9 378.6 C 332.8 376.0, 332.6 376, 320.9 376 L 309 376 309 383.5 M 381 383 L 381 390 392.0 390 C 402.9 390, 403.1 389.9, 406.0 387.0 C 409.5 383.6, 409.6 382.1, 406.9 378.6 C 404.8 376.0, 404.6 376, 392.9 376 L 381 376 381 383\"/></g>",
  Citi: "<g transform=\"scale(0.02186)\" fill-rule=\"evenodd\"><path d=\"M 721.7 386.8 L 686 404.3 686 441.6 L 686 479 642.5 479 L 599 479 599 511.5 L 599 544 640.9 544 L 682.9 544 683.2 649.2 L 683.5 754.5 686.2 764.3 C 697.4 805.0, 728.6 830.9, 775.7 838.5 C 793.1 841.3, 823.2 840.3, 841 836.3 C 848.6 834.6, 865.3 829.3, 869.2 827.3 L 872 825.9 872 792.8 C 872 761.7, 871.8 759.8, 870.2 760.5 C 852.6 768.1, 836.8 771.3, 816.5 771.3 C 782.9 771.4, 766.5 761.7, 759.8 737.8 C 758.9 734.6, 758.5 709.6, 758.2 638.7 L 757.9 544 814.9 544 L 872 544 872 511.5 L 872 479 815.0 479 L 758.0 479 757.7 424.1 L 757.5 369.3 721.7 386.8 M 223 466.6 C 172.4 470.5, 129.0 489.9, 94.9 523.9 C 60.4 558.3, 43.3 597.4, 41.3 646 C 38.0 725.7, 85.2 796.4, 161.6 826.3 C 197.8 840.5, 244.2 844.0, 284.5 835.5 C 309.9 830.1, 340.3 817.2, 360 803.2 C 369.9 796.2, 395.3 771.7, 398.0 766.6 L 399.4 763.7 375.5 740.4 L 351.5 717.1 348.5 720.8 C 306.6 772.2, 231.3 787.7, 177.1 756.0 C 130.1 728.6, 108.7 672.0, 124.5 617.5 C 136.4 576.2, 170.4 545.7, 215 536.3 C 227.5 533.6, 252.0 533.9, 265.6 536.8 C 296.9 543.5, 323.0 558.8, 343.8 582.4 L 348.1 587.3 372.6 562.8 L 397.1 538.3 385.8 526.5 C 345.4 484.5, 284.3 462.0, 223 466.6 M 463 653.5 L 463 828 501.5 828 L 540 828 540 653.5 L 540 479 501.5 479 L 463 479 463 653.5 M 933 653.5 L 933 828 971.5 828 L 1010 828 1010 653.5 L 1010 479 971.5 479 L 933 479 933 653.5\"/><path opacity=\".55\" d=\"M 710.5 257.5 C 708.3 257.8, 701.3 258.4, 695 259.0 C 588.6 269.0, 487.6 325.7, 421.6 412.5 L 414.0 422.5 458.7 422.7 L 503.3 423.0 515.9 410.5 C 529.7 396.9, 534.2 392.9, 545.9 384.0 C 589.9 350.5, 643.5 328.9, 700 321.8 C 717.7 319.5, 761.3 320.1, 779 322.8 C 848.3 333.5, 907.4 362.8, 955.8 410.7 L 968.2 423.0 1012.7 422.7 L 1057.1 422.5 1050.1 413.1 C 990.2 333.2, 898.3 277.9, 799.1 261.9 C 776.9 258.3, 727.3 255.9, 710.5 257.5\"/></g>",
  HSBC: "<g transform=\"scale(0.01855)\" fill-rule=\"evenodd\"><path d=\"M 197.9 497.5 L 47.5 648.0 197.5 797.4 L 347.5 946.8 648.5 946.9 L 949.5 947 1097.8 798.6 C 1227.6 668.8, 1246.1 650.0, 1245.8 647.7 C 1245.5 645.8, 1206.6 606.0, 1097.1 496.0 L 948.8 347 648.6 347 L 348.4 347 197.9 497.5 M 798.3 497.8 L 649.1 647.6 798.5 797.0 L 948 946.4 948 647.2 C 948 482.6, 947.8 348.0, 947.7 348.0 C 947.6 348.0, 880.3 415.4, 798.3 497.8 M 349 647.7 L 349 946.4 498.5 797 L 648 647.5 498.7 498.2 C 416.6 416.1, 349.3 349, 349.2 349 C 349.1 349, 349 483.4, 349 647.7\"/></g>",
  StanChart: "<g transform=\"scale(0.03704)\" fill-rule=\"evenodd\"><path d=\"M 343.7 25.5 C 334.9 27.7, 332.9 28.9, 258 77.8 C 193.9 119.6, 186.6 124.6, 178.5 132.6 C 166.2 144.7, 159.0 157.2, 154.2 175 C 151.4 185.4, 151.7 214.8, 154.7 225.5 C 159.8 243.1, 172.1 262.4, 184.6 272.0 C 190.0 276.3, 485.0 468.7, 487.4 469.5 C 489.9 470.5, 502.7 447.5, 507.4 433.5 C 520.9 392.9, 509.5 356.6, 475.5 332.5 C 470.7 329.1, 326.9 235.3, 281.7 206.0 C 276.3 202.6, 272.0 199.5, 272.0 199.1 C 272.0 198.7, 278.0 194.6, 285.3 190.0 C 292.5 185.3, 312.2 172.6, 329 161.6 C 345.7 150.7, 366.2 137.4, 374.5 132.1 C 396.8 117.8, 405.3 108.1, 409.4 92.3 C 419.6 52.5, 383.6 15.8, 343.7 25.5 M 181.4 516.9 C 132.6 524.2, 118.1 587.5, 159.0 614.8 C 175.3 625.7, 198.1 626.7, 215 617.2 C 222.7 612.8, 287.0 570.8, 286.9 570.1 C 286.9 569.5, 246.3 542.8, 223.1 528.2 C 207.3 518.2, 195.0 514.9, 181.4 516.9\"/><path opacity=\".55\" d=\"M 445.5 145.7 C 438.9 146.2, 431.2 148.3, 425.9 151.0 C 420.6 153.6, 354.9 195.9, 352.2 198.3 C 351.0 199.5, 413.0 240.8, 425.5 247.2 C 457.5 263.6, 497.0 242.5, 502.2 206.3 C 506.9 173.5, 478.3 143.0, 445.5 145.7 M 156.6 317.9 C 136.8 347.8, 130.7 383.8, 141.2 409.8 C 145.6 420.6, 150.2 427.2, 160.5 437.5 C 170.8 447.8, 194.8 463.8, 414.8 606.3 C 436.3 620.3, 442.2 622.8, 455 623.6 C 498.6 626.5, 527.6 577.7, 504.3 540.8 C 497.0 529.2, 512.7 539.9, 307 405.9 C 270.4 382.1, 224.9 352.5, 206 340.1 C 187.0 327.8, 169.1 316.1, 166.3 314.3 L 161.2 311.0 156.6 317.9\"/></g>",
  Federal: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M8 19V5h9M8 12h7\"/></g><rect x=\"4\" y=\"20.2\" width=\"16\" height=\"2\" rx=\"1\" opacity=\".55\"/>",
  BoB: "<path d=\"M4 16.5a8 8 0 0 1 16 0Z\"/><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3.2v2.6M5.4 6.2l1.8 1.8M18.6 6.2l-1.8 1.8M2.8 11.6l2.4.7M21.2 11.6l-2.4.7\"/><path d=\"M3.5 20h17\" opacity=\".55\"/></g>",
  PNB: "<g transform=\"scale(0.03902)\" fill-rule=\"evenodd\"><path d=\"M 82.5 24 C 58.5 26.5, 36.2 43.6, 27.9 65.8 C 22.7 79.6, 22.9 69.4, 23.2 311.5 C 23.5 525.6, 23.6 536.7, 25.3 542.5 C 32.6 566.6, 52.1 585.2, 75.6 590.4 C 86.8 592.8, 528.4 592.8, 539.3 590.3 C 559.4 585.8, 575.5 572.9, 584.4 554.5 C 592.0 538.6, 591.5 559.1, 591.5 307.5 C 591.5 93.6, 591.3 80.1, 589.7 74.1 C 583.1 50.3, 565.6 32.6, 541.5 25.3 C 535.8 23.6, 524.1 23.5, 312.5 23.4 C 189.8 23.3, 86.3 23.5, 82.5 24 M 92.4 93.7 C 100.0 112.2, 106.1 139.2, 109.5 169 C 111.0 181.9, 111.1 186.2, 109.9 208.6 C 106.4 279.9, 120.0 324.2, 156.9 361.0 C 221.3 425.1, 301.8 440.1, 401.9 406.5 C 409.3 404.0, 415.7 402, 416.2 402 C 416.6 402, 417 429.4, 417 463 L 417 524 470 524 L 523 524 523 308 L 523 92 470.0 92 L 417.0 92 416.7 167.2 C 416.4 253.2, 416.8 248.2, 407.0 268.5 C 395.6 292.0, 377.0 310.4, 353.6 321.5 C 339.5 328.2, 331.0 330.1, 313.5 330.7 C 290.4 331.4, 275.4 327.9, 252.5 316.1 C 229.8 304.6, 214.0 282.9, 207.9 255.1 C 204.9 241.4, 204.0 223.1, 204.2 185 C 204.4 138.6, 202.1 123.9, 191.2 102 L 186.5 92.5 139.1 92.2 C 94.2 91.9, 91.8 92.0, 92.4 93.7 M 292.1 138.5 C 259.7 145.5, 233.6 169.2, 223.4 201 C 219.3 213.9, 218.8 234.5, 222.3 248.2 C 232.8 289.0, 268.0 316.1, 310.5 316.3 C 336.2 316.4, 355.2 308.9, 373.6 291.6 C 421.5 246.5, 406.4 168.6, 345 143.2 C 330.2 137.1, 307.7 135.1, 292.1 138.5\"/><path opacity=\".55\" d=\"M 92.4 93.7 C 100.0 112.2, 106.1 139.2, 109.5 169 C 111.0 181.9, 111.1 186.2, 109.9 208.6 C 106.4 279.9, 120.0 324.2, 156.9 361.0 C 221.3 425.1, 301.8 440.1, 401.9 406.5 C 409.3 404.0, 415.7 402, 416.2 402 C 416.6 402, 417 429.4, 417 463 L 417 524 470 524 L 523 524 523 308 L 523 92 470.0 92 L 417.0 92 416.7 167.2 C 416.4 253.2, 416.8 248.2, 407.0 268.5 C 395.6 292.0, 377.0 310.4, 353.6 321.5 C 339.5 328.2, 331.0 330.1, 313.5 330.7 C 290.4 331.4, 275.4 327.9, 252.5 316.1 C 229.8 304.6, 214.0 282.9, 207.9 255.1 C 204.9 241.4, 204.0 223.1, 204.2 185 C 204.4 138.6, 202.1 123.9, 191.2 102 L 186.5 92.5 139.1 92.2 C 94.2 91.9, 91.8 92.0, 92.4 93.7 M 292.1 138.5 C 259.7 145.5, 233.6 169.2, 223.4 201 C 219.3 213.9, 218.8 234.5, 222.3 248.2 C 232.8 289.0, 268.0 316.1, 310.5 316.3 C 336.2 316.4, 355.2 308.9, 373.6 291.6 C 421.5 246.5, 406.4 168.6, 345 143.2 C 330.2 137.1, 307.7 135.1, 292.1 138.5\"/></g>",
  Canara: "<g transform=\"scale(0.05053)\" fill-rule=\"evenodd\"><path d=\"M 451.7 177.1 C 449.1 182.7, 447.2 187.5, 447.4 187.7 C 447.7 188.0, 449.9 187.9, 452.4 187.5 L 457 186.8 457 176.9 C 457 171.4, 456.8 167, 456.7 167 C 456.5 167, 454.3 171.5, 451.7 177.1 M 287.2 188.5 C 211.6 201.0, 176.1 207.3, 174.4 208.4 C 170.3 211.1, 168.2 216.5, 170.0 219.7 C 172.4 224.0, 379.5 393.6, 386.5 397.0 C 393.5 400.5, 400.7 400.9, 405.7 398.2 C 407.7 397.1, 415.6 387.6, 427.5 372 C 437.8 358.5, 448.6 344.3, 451.6 340.3 L 457.0 333.2 456.7 299.4 L 456.5 265.7 430.5 297.0 C 394.4 340.4, 396.8 338.0, 390.6 337.9 C 387.7 337.9, 384.1 337.1, 382.3 336.2 C 374.9 332.2, 235.9 232.3, 235.4 230.6 C 234.5 228.0, 236.7 224.3, 239.8 223.0 C 241.3 222.5, 272.8 217.0, 310 211.0 C 347.1 204.9, 378.7 199.7, 380.2 199.4 C 382.3 198.9, 383.9 197.2, 386.9 192.1 C 389.0 188.5, 392.8 182.0, 395.3 177.7 C 397.9 173.4, 399.4 170.0, 398.7 170.1 C 398.0 170.1, 347.8 178.4, 287.2 188.5\"/><path opacity=\".55\" d=\"M 398.9 171.6 C 344.4 264.5, 341.5 269.6, 341.2 274.9 C 340.7 281.0, 342.8 285.3, 348.1 289.2 C 350.4 290.9, 396.8 298.2, 423.6 301.1 C 426.5 301.4, 427.5 300.5, 439.3 286.2 C 446.3 277.9, 452 270.7, 452 270.2 C 452 269.7, 439.2 267.7, 423.5 265.7 C 394.1 262.0, 391 261.2, 391 257.9 C 391 255.0, 391.7 253.7, 425.9 195.5 L 457 142.5 457 108.2 C 457 89.4, 456.8 74, 456.6 74 C 456.4 74, 430.4 117.9, 398.9 171.6 M 18 182.5 L 18 187 30.5 187 L 43 187 43 194.4 L 43 201.8 38.2 199.7 C 34.8 198.2, 31.3 197.6, 26 197.5 L 18.5 197.5 18.2 203.5 C 18.1 206.8, 18.3 208.9, 18.6 208.2 C 19.4 206.3, 24.4 204, 27.6 204 C 31.0 204, 37.6 207.1, 41.2 210.5 L 44 213.0 44 233.6 L 44 254.2 40.1 258.1 C 34.1 264.0, 27.8 263.1, 21.1 255.5 L 18 251.9 18 260.3 L 18 268.8 21.0 269.5 C 27.8 271.0, 40.2 266.9, 42.9 262.2 C 43.6 260.9, 43.9 262.7, 43.9 268.8 L 44 277.2 40.5 276.8 C 37.0 276.4, 37 276.4, 37 280.2 L 37 284 52.5 284 L 68 284 68 280.5 C 68 277.0, 67.9 277, 63.5 277 L 59 277 59 247.9 L 59 218.8 62.0 214.3 C 71.1 201.1, 84.0 201.3, 90.6 214.7 C 93.3 220.2, 93.5 221.1, 93.5 235 C 93.5 247.8, 93.2 250.0, 91.3 254.2 C 86.8 263.9, 81.7 262.7, 77.8 251.1 C 72.9 236.2, 70.8 236.5, 71.2 252.2 L 71.5 264.4 74.5 265.9 C 79.2 268.2, 90.6 267.8, 95.6 265.2 C 101.1 262.3, 106.4 255.9, 109.1 249.0 C 112.3 240.9, 112.2 225.8, 109.0 217.5 C 101.6 198.7, 79.0 191.3, 62.6 202.4 L 59 204.9 59 195.9 L 59 187 85 187 L 111 187 111 182.5 L 111 178 64.5 178 L 18 178 18 182.5\"/></g>",
  Union: "<g transform=\"scale(0.04404)\" fill-rule=\"evenodd\"><path d=\"M 113.5 96.0 C 98.1 98.7, 85.8 107.4, 79.5 119.8 C 77.0 124.9, 32.9 297.3, 28.9 317.7 C 21.3 357.5, 24.6 396.6, 38.5 429.1 C 77.4 520.0, 199.3 552.1, 307.5 499.9 C 353.0 478.0, 387.1 446.1, 405.5 408.5 C 411.3 396.4, 414.3 386.3, 429.9 326.5 C 435.0 307.2, 441.8 281.1, 445.1 268.5 C 448.4 255.8, 453.6 236.8, 456.6 226.2 C 462.2 206.5, 463.2 199.3, 461.0 193.6 C 457.2 183.7, 444.6 175.9, 430.8 175.1 C 415.7 174.3, 403.7 178.9, 393.3 189.5 C 382.4 200.6, 379.5 208.7, 360.4 282.0 C 344.8 341.8, 337.2 369.6, 335.0 374.6 C 326.6 393.6, 302.5 415.3, 274.5 429.0 C 248.0 441.9, 229.2 446.4, 202 446.4 C 137.6 446.4, 99.9 410.8, 103.3 353.4 C 104.2 338.4, 105.0 334.7, 132.5 225.7 C 158.4 123.2, 159.4 118.3, 156.6 111.6 C 151.9 100.3, 131.1 92.8, 113.5 96.0\"/><path opacity=\".55\" d=\"M 407 22.0 C 331.1 33.5, 263.5 77.6, 234.9 134.5 C 228.1 148.1, 225.8 155.7, 209.4 218.6 C 193.4 280.3, 186.3 306.9, 181.4 323.5 C 177.3 337.5, 177.1 339.0, 177.9 344.4 C 180.6 360.7, 192.3 370.8, 209.5 371.7 C 231.6 372.9, 251.2 360.1, 257.3 340.4 C 264.6 316.9, 267.9 305.4, 275.0 278.5 C 304.3 166.1, 303.0 170.4, 311.5 158.4 C 329.9 132.4, 368.9 109.0, 407.5 101.0 C 448.3 92.4, 495.7 103.7, 516.0 126.8 L 520.0 131.3 519.7 83.4 L 519.5 35.5 509 31.8 C 477.6 20.7, 439.8 17.1, 407 22.0 M 499.1 351.5 C 476.9 440.1, 477.2 438.7, 481.8 447.6 C 487.3 458.3, 505.6 467.5, 517.2 465.2 L 520 464.7 520 367.3 C 520 313.8, 519.8 270, 519.7 270 C 519.6 270, 510.3 306.6, 499.1 351.5\"/></g>",
  BoI: "<path d=\"M12 2.6c.5 0 .9.3 1.1.7l2.3 4.8 5.2.7c1 .1 1.4 1.4.7 2.1l-3.8 3.7.9 5.2c.2 1-.9 1.8-1.8 1.3L12 18.6l-4.6 2.5c-.9.5-2-.3-1.8-1.3l.9-5.2-3.8-3.7c-.7-.7-.3-2 .7-2.1l5.2-.7 2.3-4.8c.2-.4.6-.7 1.1-.7Z\"/>",
  IDBI: "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"4\" opacity=\".55\"/><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M8.2 7.5v9M11.8 7.5v9h1.6a4.5 4.5 0 0 0 0-9h-1.6Z\" stroke=\"#fff\"/></g>",
  DBS: "<path d=\"M12 2.5 14 10l7.5 2-7.5 2-2 7.5-2-7.5-7.5-2 7.5-2Z\" transform=\"rotate(45 12 12)\"/>",
  Bajaj: "<g transform=\"scale(0.05240)\" fill-rule=\"evenodd\"><path d=\"M 210.1 18.0 C 143.1 24.0, 81.4 62.9, 46.8 121.1 C 14.9 174.7, 8.6 239.8, 29.4 299.5 C 65.1 402.2, 175.9 461.2, 281.7 433.9 C 394.7 404.8, 462.9 289.2, 433.9 176.2 C 408.2 76.2, 312.9 8.9, 210.1 18.0 M 109 229 L 109 347 135.4 347 L 161.9 347 162.2 253.2 L 162.5 159.5 231.2 159.2 L 300 158.9 300 179.9 L 300 201 255 201 L 210 201 210 228 L 210 255 250.5 255 L 291 255 291 275 L 291 295 250.5 295 L 210 295 210 321 L 210 347 237.7 346.9 C 275.0 346.9, 295.8 345.0, 313 340.1 C 345.4 330.7, 361.0 312.2, 360.9 283.2 C 360.9 256.4, 347.9 241.6, 313.5 228.5 C 311.8 227.9, 312.3 227.4, 316.5 226.0 C 344.7 216.1, 361.0 196.4, 360.9 172.0 C 360.9 137.0, 333.5 117.0, 278.5 112.0 C 272.2 111.4, 233.5 111.0, 188.2 111.0 L 109 111 109 229\"/></g>",
  OneCard: "<rect x=\"5\" y=\"2\" width=\"14\" height=\"20\" rx=\"3\" opacity=\".55\"/><path d=\"M10.2 8.6 12.6 7h1.2v10h-2.2V9.6l-1.4.9Z\"/>",
  Equitas: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M17 5h-10v14h10M7 12h8\"/></g>",
  CUB: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M17.5 7.2a7 7 0 1 0 0 9.6\"/></g><circle cx=\"15.5\" cy=\"12\" r=\"2.2\"/>",
  Roar: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4\"/></g>",
  Slice: "<path d=\"M11 3.1V13h9.9A9.9 9.9 0 1 1 11 3.1Z\"/><path d=\"M13.2 1.6a9.4 9.4 0 0 1 9.2 9.2h-9.2Z\" opacity=\".55\"/>",
};
const BANK_MARK_ANY = "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3.5 9.5 12 4.5l8.5 5\"/><path d=\"M6.5 11v6.5M10 11v6.5M14 11v6.5M17.5 11v6.5\" opacity=\".6\"/><path d=\"M3.5 20.5h17\"/></g>";
const bankMarkSvg = (n, size) => '<svg viewBox="0 0 24 24" width="' + (size || 20) + '" height="' + (size || 20)
  + '" fill="currentColor" aria-hidden="true">' + (BANK_MARKS[n] || BANK_MARK_ANY) + "</svg>";

const CUSTOM_BANKS_KEY = "cv-custom-banks";
function customBanks() {
  try { const v = JSON.parse(localStorage.getItem(CUSTOM_BANKS_KEY) || "[]"); return Array.isArray(v) ? v : []; }
  catch (e) { return []; }
}
function allBankNames() {
  const out = [], seen = new Set();
  const add = (n) => { n = String(n || "").trim(); const k = n.toLowerCase(); if (n && !seen.has(k)) { seen.add(k); out.push(n); } };
  (state.banks || []).forEach(add);
  state.cards.forEach((c) => add(c.bank));
  customBanks().forEach(add);
  return out;
}
/** The listed spelling of a typed bank ("hdfc", "Standard Chartered" ->
 *  "HDFC", "StanChart"), or null when it is not a bank we know. */
function canonicalBank(q) {
  const k = String(q || "").trim().toLowerCase();
  if (!k) return null;
  const names = allBankNames();
  return names.find((n) => n.toLowerCase() === k)
      || names.find((n) => (BANK_ALIASES[n] || "").toLowerCase() === k) || null;
}
function addCustomBank(name) {
  const known = canonicalBank(name);
  if (known) return known;
  const clean = String(name).trim().replace(/\s+/g, " ");
  const list = customBanks(); list.push(clean);
  try { localStorage.setItem(CUSTOM_BANKS_KEY, JSON.stringify(list)); } catch (e) {}
  return clean;
}
function suggestBanks(q) {
  const k = q.trim().toLowerCase();
  const used = new Set(state.cards.map((c) => c.bank));
  if (!k) return [...used].filter(Boolean).sort().slice(0, 6);   // empty field: your banks
  const scored = [];
  allBankNames().forEach((n) => {
    const nl = n.toLowerCase(), al = (BANK_ALIASES[n] || "").toLowerCase();
    let s = -1;
    if (nl.startsWith(k)) s = 0;
    else if (al.split(/\s+/).some((w) => w.startsWith(k)) || al.startsWith(k)) s = 1;
    else if (nl.includes(k) || al.includes(k)) s = 2;
    if (s >= 0) scored.push({ n, s: s - (used.has(n) ? 0.5 : 0) });
  });
  return scored.sort((a, b) => a.s - b.s || a.n.localeCompare(b.n)).slice(0, 6).map((x) => x.n);
}
let bankSugItems = [];
function closeBankSuggest() {
  const box = $("#fBankSug");
  if (box) { box.hidden = true; box.innerHTML = ""; }
  const input = $("#fBank"); if (input) input.setAttribute("aria-expanded", "false");
  bankSugItems = [];
}
function paintBankSuggest() {
  const input = $("#fBank"), box = $("#fBankSug");
  const q = input.value.trim();
  if (!q) return closeBankSuggest();               // 2.0: nothing typed, no list
  const custom = new Set(customBanks());
  bankSugItems = suggestBanks(q).map((n) => ({ kind: "pick", name: n }));
  const exact = !!canonicalBank(q);
  if (q.length >= 2 && !exact) bankSugItems.push({ kind: "add", name: q.replace(/\s+/g, " ") });
  if (!bankSugItems.length || (exact && bankSugItems.length === 1 && bankSugItems[0].name === q)) return closeBankSuggest();
  box.innerHTML = bankSugItems.map((it, i) => it.kind === "add"
    ? '<button type="button" class="bs-item is-add" role="option" data-i="' + i + '">'
      + '<span class="bs-add-ico">+</span><span class="bs-name bs-add-text">Add <b>' + esc(it.name) + '</b> as a new bank</span></button>'
    : '<button type="button" class="bs-item" role="option" data-i="' + i + '">'
      + '<span class="bs-glyph" style="' + bankStyle(it.name) + '">' + bankMarkSvg(it.name) + '</span>'
      + '<span class="bs-name">' + esc(bankFullName(it.name)) + '</span>' + (custom.has(it.name) ? '<span class="bs-tag">Added</span>' : "") + '</button>').join("");
  box.hidden = false;
  input.setAttribute("aria-expanded", "true");
  // pointerdown, not click: a click lands after the field's blur, by which
  // time the list would already have closed under the finger.
  box.querySelectorAll(".bs-item").forEach((b) => b.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    const it = bankSugItems[+b.dataset.i];
    if (!it) return;
    if (it.kind === "add") {
      const saved = addCustomBank(it.name);
      input.value = saved;
      toast(saved === it.name ? saved + " added to your banks" : "That's " + saved + " - already listed");
    } else input.value = it.name;
    // An Amex card can only be on the Amex network - fill it in.
    if (input.value === "Amex" && !$("#fNetwork").value) { $("#fNetwork").value = "Amex"; fillVariantOptions(""); }
    closeBankSuggest();
    $("#fName").focus();
  }));
}
function wireBankPicker() {
  const input = $("#fBank");
  if (!input) return;
  input.addEventListener("input", paintBankSuggest);
  // 2.0 (feedback): no list on focus - it opens once the user types.
  input.addEventListener("blur", () => setTimeout(closeBankSuggest, 150));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const first = $("#fBankSug .bs-item");
      if (first && !$("#fBankSug").hidden) first.dispatchEvent(new Event("pointerdown"));
      else $("#fName").focus();
    } else if (e.key === "Escape") closeBankSuggest();
  });
}
// Keep the toggle's label, helper text and accent in sync with its state.
function reflectAddonToggle() {
  const on = $("#fAddon").checked;
  $("#fAddon").closest(".switch-row").classList.toggle("is-addon", on);
  $("#addonLabel").textContent = on ? "Add-on card" : "Primary card";
  $("#addonHelp").textContent = on
    ? "Branches off the primary card of the same name at this bank."
    : "The main card on this account. Turn on for an add-on issued to family.";
}
// Populate the Variant dropdown from whichever network is currently chosen.
function fillVariantOptions(selected) {
  const net = $("#fNetwork").value;
  const vars = NETWORK_VARIANTS[net] || [];
  const varSel = $("#fVariant");
  const none = !!net && !vars.length;          // Amex: no tiers to pick
  varSel.disabled = !net || none;
  varSel.required = !none;
  // An Amex card saved before 1.3.6 may carry a variant ("Gold"); editing it
  // must not silently drop that, so the old value rides along unseen.
  varSel.innerHTML = none
    ? `<option value="${esc(selected || "")}" selected>Not needed for ${esc(net)}</option>`
    : `<option value="" disabled ${selected ? "" : "selected"}>${net ? "Choose…" : "Pick a network first"}</option>`
      + vars.map((v) => `<option>${v}</option>`).join("");
  if (selected && vars.includes(selected)) varSel.value = selected;
}
function closeSheet() { $("#sheet").hidden = true; }

// live formatting of the number field
function wireNumberFormat() {
  $("#fNumber").addEventListener("input", (e) => {
    const d = e.target.value.replace(/\D/g, "").slice(0, 19);
    e.target.value = d.replace(/(.{4})/g, "$1 ").trim();
    $("#fNumberErr").hidden = true;
  });
  $("#fExpiry").addEventListener("input", (e) => {
    let d = e.target.value.replace(/[^\d]/g, "").slice(0, 4);
    if (d.length >= 3) d = d.slice(0, 2) + "/" + d.slice(2);
    e.target.value = d;
  });
}

async function submitCard(e) {
  e.preventDefault();
  // A typed bank is matched to its listed spelling; one we do not know is
  // kept as typed and remembered for next time.
  const typedBank = $("#fBank").value.trim();
  if (!typedBank) { $("#fBank").focus(); return; }
  const bank = canonicalBank(typedBank) || addCustomBank(typedBank);
  $("#fBank").value = bank;
  const payload = {
    bank, card_name: $("#fName").value.trim(),
    number: $("#fNumber").value, holder: $("#fHolder").value.trim(),
    expiry: $("#fExpiry").value, cvv: $("#fCvv").value,
    network: $("#fNetwork").value, variant: $("#fVariant").value,
    notes: $("#fNotes").value.trim(),
    addon: $("#fAddon").checked,
    nickname: $("#fNickname").value.trim(),
    kind: $("#fKind").value,
    relation: $("#fRelation").value || "Self",
  };
  if (!payload.card_name) return;
  const id = $("#fId").value;
  // 2.0 Virtual / Dual: sent only when on, or to turn off one the card has -
  // so saving a card from an older version adds no new fields to it.
  const before = id ? state.cards.find((c) => c.id === id) : null;
  ["virtual", "dual"].forEach((k) => {
    const on = $(k === "virtual" ? "#fVirtual" : "#fDual").checked;
    if (on || (before && k in before)) payload[k] = on;
  });
  // Same card twice (1.3.8, closed-test feedback): the number is the card's
  // identity, so a second card with the same digits is refused - archived
  // ones included, the card being edited excluded. No number, no check.
  const digits = String(payload.number || "").replace(/\D/g, "");
  if (digits.length >= 12) {
    const twin = state.cards.find((c) => c.id !== id
      && String(c.number || "").replace(/\D/g, "") === digits);
    if (twin) {
      showErr($("#fNumberErr"), "This card is already in your vault"
        + (twin.archived ? " (archived)" : "") + ": " + twin.bank + " " + twin.card_name + ".");
      $("#fNumber").focus();
      return;
    }
  }
  if (id) {
    const res = await api.send(`/api/cards/${id}`, "PUT", payload);
    const i = state.cards.findIndex((c) => c.id === id);
    if (res.card && i > -1) state.cards[i] = res.card;
    toast("Card updated");
  } else {
    const res = await api.send("/api/cards", "POST", payload);
    if (res.card) state.cards.push(res.card);
    state.selectedBank = payload.bank; // jump to the bank you just added to
    // ...and to the person you just added it for, or it would vanish from a
    // home page filtered to someone else.
    if (state.selectedRelation !== "All") state.selectedRelation = payload.relation;
    toast("Card added");
  }
  closeSheet(); refreshActiveView();
}

// ---- Sample-card cleanup --------------------------------------------------
// An earlier build seeded 25 placeholder cards from a bank list. Cards are now
// added manually only. These are the exact (bank + name) signatures of that
// seed, used to offer a one-time removal — but ONLY for cards that are still
// untouched (no number/holder/expiry/CVV/notes), so anything you've since
// filled in or added yourself is never deleted.
const SAMPLE_SEED = [
  ["Axis", "Atlas"], ["Equitas", "PowerMiles"], ["IDFC", "IndiGo"],
  ["IDFC", "Gaj"], ["IDFC", "Wealth"], ["HDFC", "Diners Black"],
  ["HDFC", "Tata Neu"], ["HDFC", "Marriott Bonvoy"], ["ICICI", "Sapphiro (Mastercard)"],
  ["ICICI", "Sapphiro (Amex)"], ["CUB", "Level Up"], ["RBL", "IndianOil"],
  ["Amex", "Platinum"], ["Amex", "Gold Charge"], ["BoB", "Etihad"],
  ["BoB", "Eterna"], ["IndusInd", "Qatar Avios"], ["Federal", "Scapia (Visa)"],
  ["Federal", "Scapia (RuPay)"], ["HSBC", "TravelOne"], ["Yes", "Marquee"],
  ["Roar", "Roar Card"], ["PNB", "Luxura"], ["PNB", "RuPay Select"],
  ["SBI", "Tata"],
];
const SAMPLE_KEYS = new Set(SAMPLE_SEED.map(([b, n]) => `${b}|${n}`));
// A card counts as an untouched sample if it matches a seed name AND still has
// none of its sensitive fields filled in.
function isUntouchedSample(c) {
  if (!SAMPLE_KEYS.has(`${c.bank}|${c.card_name}`)) return false;
  return !c.number && !c.holder && !c.expiry && !c.cvv && !(c.notes || "").trim();
}
function sampleCards() { return state.cards.filter(isUntouchedSample); }

function renderSampleBanner() {
  const banner = $("#sampleBanner");
  const samples = sampleCards();
  if (!samples.length) { banner.hidden = true; banner.innerHTML = ""; return; }
  banner.hidden = false;
  banner.innerHTML = `
    <div class="sb-text">
      <b>${samples.length} sample card${samples.length === 1 ? "" : "s"}</b> were added earlier from a bank list.
      They have no details filled in — remove them and add your own cards manually.
    </div>
    <div class="sb-actions">
      <button class="btn btn-text" id="sbKeep">Keep</button>
      <button class="btn btn-filled" id="sbRemove">Remove sample cards</button>
    </div>`;
  $("#sbKeep").onclick = () => { banner.hidden = true; };
  $("#sbRemove").onclick = removeSampleCards;
}
async function removeSampleCards() {
  const samples = sampleCards();
  if (!samples.length) return;
  $("#sbRemove").disabled = true;
  for (const c of samples) {
    await api.send(`/api/cards/${c.id}`, "DELETE");
    state.cards = state.cards.filter((x) => x.id !== c.id);
  }
  renderSampleBanner(); renderBankBar(); renderCards();
  toast(`${samples.length} sample card${samples.length === 1 ? "" : "s"} removed`);
}

// ---- Bulk import (paste many cards at once) --------------------------------
// One card per line, comma-separated, in this fixed column order:
const IMPORT_ORDER = ["bank", "card_name", "number", "holder", "expiry", "cvv", "network", "variant"];
// The optional 9th column marks add-on cards. Anything like add-on/addon/yes/1
// counts as an add-on; blank (or "primary") stays a primary card. Parsed to a
// real boolean here so the server never mis-reads a non-empty word as truthy.
const IMPORT_ADDON_RE = /^(1|y|yes|true|add[\s-]?on|addon)$/i;
function parseImport(text) {
  const lines = (text || "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const cards = [];
  lines.forEach((line, i) => {
    // Ignore an optional header row (first line, words only, names a column).
    if (i === 0 && /\bbank\b/i.test(line) && /card\s*name/i.test(line) && !/\d/.test(line)) return;
    const parts = line.split(",").map((s) => s.trim());
    if (parts.length < 2) return;
    const c = {};
    IMPORT_ORDER.forEach((k, j) => { c[k] = parts[j] || ""; });
    c.addon = IMPORT_ADDON_RE.test(parts[8] || "");   // 9th column: add-on?
    // 10th column (1.3.9 feedback): whose card. Matched to an existing
    // relation whatever the case ("spouse" -> "Spouse"); blank = Self.
    c.relation = importRelation(parts[9] || "");
    if (!c.card_name && !c.bank) return;   // need at least a name or a bank
    cards.push(c);
  });
  return cards;
}
function importRelation(raw) {
  const r = String(raw || "").trim().slice(0, 30);
  if (!r) return "Self";
  const hit = availableRelations().find((x) => x.toLowerCase() === r.toLowerCase());
  return hit || titleCase(r);
}
function openImport() {
  $("#importText").value = "";
  updateImportCount();
  $("#importSheet").hidden = false;
  setTimeout(() => $("#importText").focus(), 40);
}
function closeImport() { $("#importSheet").hidden = true; }
function updateImportCount() {
  const n = parseImport($("#importText").value).length;
  const el = $("#importCount");
  el.textContent = `${n} card${n === 1 ? "" : "s"} detected`;
  el.classList.toggle("ready", n > 0);
  $("#importDo").disabled = n === 0;
}
async function submitImport() {
  const cards = parseImport($("#importText").value);
  if (!cards.length) return;
  const res = await api.send("/api/cards/bulk", "POST", { cards });
  (res.added || []).forEach((c) => state.cards.push(c));
  state.selectedBank = "All";
  closeImport(); renderBankBar(); renderCards();
  toast(`${res.count} card${res.count === 1 ? "" : "s"} imported`);
}

// ==========================================================================
//  RELATIONSHIP VIEW — ONE joint knowledge graph of every card
// ==========================================================================
// A single pane holds every bank as its own coloured tree, joined at a central
// "My Cards" root: root → bank → primary card → add-on cards. The bank filter
// at the top drives it — "All" shows the whole graph, a bank shows just that
// bank's tree. Pan by dragging, zoom with the wheel or the on-canvas controls.

// Tabs switch between the "My Cards" dashboard and the "Relationship" graph.
function wireTabs() {
  document.querySelectorAll(".tab").forEach((t) => { t.onclick = () => switchTab(t.dataset.tab); });
}
function switchTab(name) {
  if (!name) return;
  state.tab = name;
  document.querySelectorAll(".tab").forEach((t) => {
    const on = t.dataset.tab === name;
    t.classList.toggle("is-active", on);
    t.setAttribute("aria-selected", String(on));
  });
  const cards = name === "cards", pp = name === "pp";
  $("#cardsView").hidden = !cards;
  $("#relView").hidden = name !== "rel";
  $("#ppView").hidden = !pp;
  // The bank filter stays visible on the cards and graph tabs (it drives the
  // graph too); a rel-mode class hides the My-Cards-only network filter via
  // CSS. Priority Pass is isolated: no search, no relation, no bank filter.
  $("#bankbar").hidden = pp;
  $("#tabsRight").hidden = pp;
  if (pp && searchOpen()) closeSearch();
  if (filtersAreMobile) $("#mFilterBar").hidden = pp;
  $("#app").classList.toggle("rel-mode", name === "rel");
  $("#app").classList.toggle("pp-mode", pp);
  $("#addBtn").title = pp ? "Add Priority Pass" : "Add card";
  renderBankBar();
  renderNudge();
  if (name === "rel") renderRelationship();
  if (pp) renderPasses();
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

const normName = (s) => (s || "").trim().toLowerCase();
const truncate = (s, n) => { s = String(s || ""); return s.length > n ? s.slice(0, n - 1) + "…" : s; };
const cssId = (s) => "b" + String(s || "").replace(/[^a-z0-9]/gi, "");
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const f1 = (v) => Math.round(v * 10) / 10;
function nodeInitials(card) {
  const src = (card.holder || card.card_name || "").trim();
  if (!src) return "";
  const p = src.split(/\s+/);
  return (p[0][0] + (p[1] ? p[1][0] : "")).toUpperCase();
}
// Cards feeding the graph: active only, narrowed to the person on screen (the
// relation pill - 1.3.8, closed-test feedback: a "Self" map showed the
// spouse's add-ons too) and to the selected bank filter.
function relCards() {
  let cs = state.cards.filter((c) => !c.archived
    && (state.selectedRelation === "All" || cardRelation(c) === state.selectedRelation));
  if (state.selectedBank !== "All") cs = cs.filter((c) => c.bank === state.selectedBank);
  return cs;
}

// -- Build the node/link model -------------------------------------------- //
// Nodes: root · bank · primary · orphanPrimary · addon.  A primary's add-ons
// are the add-on cards sharing its name at its bank; add-ons with no matching
// primary hang off a dashed synthetic "orphan" primary so the gap is visible.
function buildGraphModel(cards) {
  const nodes = [], links = [];
  const single = state.selectedBank !== "All";
  let root = null;
  // 2.0: the centre is the app itself - its own mark, bigger, named Card Vault.
  if (!single) { root = { id: "__root", type: "root", label: "Card Vault", r: 48 }; nodes.push(root); }

  const byBank = {};
  cards.forEach((c) => (byBank[c.bank] = byBank[c.bank] || []).push(c));
  const banks = Object.keys(byBank).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

  banks.forEach((bank) => {
    const m = bankMeta(bank);
    const bankNode = { id: "bank:" + bank, type: "bank", bank, m, label: bank, r: single ? 42 : 34 };
    nodes.push(bankNode);
    if (root) links.push({ s: root, t: bankNode, kind: "root" });

    const list = byBank[bank];
    const addons = list.filter((c) => c.addon);
    const primaries = list.filter((c) => !c.addon);
    const used = new Set();

    const attachAddons = (parent, kids) => kids.forEach((a) => {
      used.add(a.id);
      const an = { id: a.id, type: "addon", bank, m, card: a, label: titleCase(a.holder || a.card_name) || "Add-on", r: 21 };
      nodes.push(an); links.push({ s: parent, t: an, kind: "primary" });
    });

    // Each add-on hangs off exactly ONE primary (1.3.8). Before, every primary
    // took every add-on of its name, so two "SBI PP" primaries (yours and your
    // spouse's) each showed all six add-ons. Prefer the primary of the same
    // name held by the same person (relation); else the first of that name.
    const owner = new Map();   // primary id -> its add-ons
    primaries.forEach((p) => owner.set(p.id, []));
    addons.forEach((a) => {
      const same = primaries.filter((p) => normName(p.card_name) === normName(a.card_name));
      const p = same.find((x) => cardRelation(x) === cardRelation(a)) || same[0];
      if (p) owner.get(p.id).push(a);
    });

    primaries.forEach((p) => {
      const pn = { id: p.id, type: "primary", bank, m, card: p, label: titleCase(p.card_name) || "Primary", r: 29 };
      nodes.push(pn); links.push({ s: bankNode, t: pn, kind: "bank" });
      attachAddons(pn, owner.get(p.id));
    });

    const orphans = {};
    addons.filter((a) => !used.has(a.id)).forEach((a) => {
      const k = normName(a.card_name) || ("__" + a.id);
      (orphans[k] = orphans[k] || []).push(a);
    });
    Object.values(orphans).forEach((kids) => {
      const pn = { id: "orphan:" + bank + ":" + normName(kids[0].card_name), type: "orphanPrimary",
                   bank, m, label: titleCase(kids[0].card_name) || "Unlinked", r: 29 };
      nodes.push(pn); links.push({ s: bankNode, t: pn, kind: "bank" });
      attachAddons(pn, kids);
    });
  });
  return { nodes, links, root };
}

// -- Radial (centric) layout, stretched wide ---------------------------------
// The knowledge-graph look the vault settled on: "My Cards" in the centre,
// banks on ring 1, primaries on ring 2, add-ons on ring 3, each branch owning
// an angular sector proportional to its size. The rings are ELLIPTICAL — wider
// than tall to match the panoramic stage — so the left/right space carries the
// spread and the whole graph still fits on screen in one view.
function layoutRadial(model, aspect) {
  const { nodes, links } = model;
  // Root of the graph: the "My Cards" node on the All view, or the single bank
  // node when a bank filter is applied.
  const root = model.root || nodes.find((n) => n.type === "bank");
  if (!root) return;

  const kids = new Map();
  nodes.forEach((n) => kids.set(n, []));
  links.forEach((l) => kids.get(l.s).push(l.t));
  // Stable sibling order: bigger branches first, then A→Z.
  kids.forEach((arr) => arr.sort((a, b) =>
    (kids.get(b).length - kids.get(a).length) ||
    (a.label || "").localeCompare(b.label || "", undefined, { sensitivity: "base" })));

  const countLeaves = (n) => {
    const c = kids.get(n);
    n._leaves = c.length ? c.reduce((s, x) => s + countLeaves(x), 0) : 1;
    return n._leaves;
  };
  countLeaves(root);

  // Count how many nodes actually sit on each ring, then give every ring the
  // radius its own crowd needs: banks want ~120px of arc each (hub + label),
  // primaries ~95px (node + radial name), add-ons ~50px (initials bubble).
  // This is what stops bank hubs piling onto each other as the vault grows.
  const depthCount = [0, 0, 0, 0];
  const tally = (n, d) => { if (d > 0) depthCount[Math.min(d, 3)]++; kids.get(n).forEach((c) => tally(c, d + 1)); };
  tally(root, 0);
  // Bank labels sit radially (outward) rather than under the hub, so the bank
  // ring only needs arc for the hubs themselves — keeps the tree compact and
  // the nodes big when everything is fitted on screen.
  const eff = 2 * Math.PI * Math.sqrt(aspect);   // ellipse stretch buys extra arc
  const r1 = Math.max(175, (depthCount[1] * 132) / eff);
  const r2 = Math.max(r1 + 185, (depthCount[2] * 130) / eff);
  const r3 = Math.max(r2 + 110, (depthCount[3] * 72) / eff);
  const rings = [0, r1, r2, r3];
  const ringR = (depth) => depth <= 3 ? rings[depth] : r3 + (depth - 3) * 100;

  root.x = 0; root.y = 0;
  // Sector share blends leaf count with a fixed floor so a one-card bank still
  // gets a readable slice instead of being crushed between big branches.
  const PAD = 1.15;
  const place = (n, depth, a0, a1) => {
    const c = kids.get(n);
    const wsum = c.reduce((s, x) => s + x._leaves + PAD, 0) || 1;
    let a = a0;
    c.forEach((ch) => {
      const span = (a1 - a0) * ((ch._leaves + PAD) / wsum);
      const mid = a + span / 2;
      const r = ringR(depth + 1);
      // Elliptical rings: x stretched by the stage aspect, y as-is.
      ch.x = r * aspect * Math.cos(mid);
      ch.y = r * Math.sin(mid);
      place(ch, depth + 1, a, a + span);
      a += span;
    });
  };
  const single = !model.root;
  const start = -Math.PI / 2;
  place(root, 0, start, start + 2 * Math.PI * (single && root._leaves <= 3 ? 0.6 : 1));
}

function graphBBox(nodes) {
  let minx = 1e9, miny = 1e9, maxx = -1e9, maxy = -1e9;
  nodes.forEach((n) => {
    // Label allowance depends on the node type: primaries AND banks carry a
    // sideways radial label, the root a centred one below, add-ons none.
    const radial = n.type === "primary" || n.type === "orphanPrimary" || n.type === "bank";
    const padx = n.r + (radial ? 115 : n.type === "addon" ? 18 : 55);
    const top = n.r + (radial ? 32 : 18);
    const bot = n.r + (radial ? 32 : n.type === "addon" ? 18 : 34);
    minx = Math.min(minx, n.x - padx); maxx = Math.max(maxx, n.x + padx);
    miny = Math.min(miny, n.y - top); maxy = Math.max(maxy, n.y + bot);
  });
  return { minx, miny, maxx, maxy };
}

// Module-level view state so zoom/pan and "fit" persist between operations.
let relLast = null;  // { nodes, W, H }
function fitView(bbox, W, H) {
  const pad = 40;
  const bw = (bbox.maxx - bbox.minx) || 1, bh = (bbox.maxy - bbox.miny) || 1;
  // The whole graph always fits on screen, centred; wheel/buttons zoom deeper.
  const s = clamp(Math.min((W - 2 * pad) / bw, (H - 2 * pad) / bh), 0.25, 1.5);
  state.rel.scale = s;
  state.rel.tx = (W - bw * s) / 2 - bbox.minx * s;
  state.rel.ty = (H - bh * s) / 2 - bbox.miny * s;
}
function applyRelTransform() {
  const g = document.getElementById("relZoom");
  if (g) g.setAttribute("transform", `translate(${f1(state.rel.tx)} ${f1(state.rel.ty)}) scale(${state.rel.scale.toFixed(4)})`);
}

function renderRelationship() {
  const stage = $("#relStage"), empty = $("#relEmpty"), canvas = $("#relCanvas");
  const cards = relCards();
  if (!cards.length) {
    stage.hidden = true; canvas.innerHTML = ""; empty.hidden = false;
    // Cards exist, just not for the person on screen (1.3.8 relation filter).
    const others = state.selectedRelation !== "All" && state.cards.some((c) => !c.archived);
    $("#relEmptyTitle").textContent = others ? "No cards for " + state.selectedRelation : "No cards yet";
    $("#relEmptyMsg").textContent = others
      ? "Switch the person above to see their cards here."
      : "Add cards on the My Cards tab, then mark family cards as add-ons to map them here.";
    return;
  }
  empty.hidden = true; stage.hidden = false;

  const rect = canvas.getBoundingClientRect();
  const W = Math.max(320, Math.round(rect.width) || 900);
  const H = Math.max(320, Math.round(rect.height) || 560);

  const model = buildGraphModel(cards);
  // Stretch factor: how much wider than tall the stage is (clamped so the
  // ellipse stays graceful on odd window shapes).
  layoutRadial(model, clamp(W / H, 1.15, 2.1));
  relLast = { nodes: model.nodes, W, H };

  canvas.innerHTML =
    `<svg id="relSvg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" aria-label="Joint card relationship graph">
      <defs>${graphDefs(model.nodes)}</defs>
      <g id="relZoom">
        ${model.links.map(linkSVG).join("")}
        ${model.nodes.map(nodeSVG).join("")}
      </g>
    </svg>`;

  fitView(graphBBox(model.nodes), W, H);
  applyRelTransform();
  wireRelInteractions(W, H);
}

function graphDefs(nodes) {
  const banks = [...new Set(nodes.filter((n) => n.bank).map((n) => n.bank))];
  const perBank = banks.map((bank) => {
    const m = bankMeta(bank), id = cssId(bank);
    return `<radialGradient id="hub_${id}" cx="35%" cy="28%" r="85%"><stop offset="0" stop-color="${m.b}"/><stop offset="1" stop-color="${m.a}"/></radialGradient>
      <linearGradient id="lg_${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${m.b}"/><stop offset="1" stop-color="${m.accent}"/></linearGradient>`;
  }).join("");
  // Brand purple (matches the app icon / favicon) for the central My Cards node.
  const rootG = `<radialGradient id="hub_root" cx="35%" cy="28%" r="85%"><stop offset="0" stop-color="#8f7bf7"/><stop offset=".55" stop-color="#7c3aed"/><stop offset="1" stop-color="#9333ea"/></radialGradient>`;
  return perBank + rootG;
}

function linkSVG(l) {
  const stroke = l.kind === "root" ? "var(--m3-outline)" : `url(#lg_${cssId(l.t.bank)})`;
  const w = l.kind === "root" ? 2.6 : l.kind === "bank" ? 3 : 2.4;
  const op = l.kind === "root" ? 0.45 : 0.6;
  // A gentle quadratic bow (control point nudged perpendicular to the chord)
  // keeps the organic knowledge-graph feel instead of rigid straight spokes.
  const x1 = l.s.x, y1 = l.s.y, x2 = l.t.x, y2 = l.t.y;
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy) || 1;
  const bow = d * 0.08;
  const cx = mx - (dy / d) * bow, cy = my + (dx / d) * bow;
  return `<path class="glink" d="M${f1(x1)} ${f1(y1)} Q${f1(cx)} ${f1(cy)} ${f1(x2)} ${f1(y2)}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" opacity="${op}"/>`;
}

function starMark(cx, cy, size, fill) {
  return `<path transform="translate(${cx},${cy}) scale(${(size / 24).toFixed(3)}) translate(-12,-12)" fill="${fill}" d="m12 2 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17l-5.8 3 1.1-6.5L2.6 8.8l6.5-.9L12 2Z"/>`;
}
function personMark(cx, cy, size, fill) {
  return `<path transform="translate(${cx},${cy}) scale(${(size / 24).toFixed(3)}) translate(-12,-12)" fill="${fill}" d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.4 0-7 2.2-7 4.6V20h14v-1.4C19 16.2 16.4 14 12 14Z"/>`;
}
// The app's own "card" glyph (from the favicon / brand-mark) — shown on the
// central My Cards node so the root reads as the app itself.
function cardMark(cx, cy, size, fill) {
  const s = (size / 24).toFixed(3);
  return `<g transform="translate(${cx},${cy}) scale(${s}) translate(-12,-12)" fill="${fill}">
    <rect x="2" y="5" width="20" height="14" rx="3" opacity=".28"/>
    <rect x="2" y="8.2" width="20" height="2.6"/>
    <rect x="5" y="14" width="6" height="2" rx="1"/>
  </g>`;
}

function nodeSVG(n) {
  const x = f1(n.x), y = f1(n.y), r = n.r;
  if (n.type === "root") {
    return `<g class="gnode">
      <circle class="halo" cx="${x}" cy="${y}" r="${r + 15}" fill="#7c3aed" opacity=".18"/>
      <circle class="ndot" cx="${x}" cy="${y}" r="${r}" fill="url(#hub_root)" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>
      <svg x="${f1(x - r * 0.95)}" y="${f1(y - r * 0.95)}" width="${f1(r * 1.9)}" height="${f1(r * 1.9)}" viewBox="0 0 72 72">${CV_MARK}</svg>
      <text class="glabel" x="${x}" y="${y + r + 23}" text-anchor="middle" font-size="17" font-weight="800" fill="var(--m3-on-surface)">${esc(n.label)}</text>
    </g>`;
  }
  const id = cssId(n.bank);
  if (n.type === "bank") {
    // Bank name reads radially outward (like the card names) so the hub ring
    // stays tight and the fitted graph keeps its nodes big.
    return `<g class="gnode">
      <circle class="halo" cx="${x}" cy="${y}" r="${r + 14}" fill="${n.m.a}" opacity=".18"/>
      <circle class="g-pulse" cx="${x}" cy="${y}" r="${r + 7}" fill="${n.m.b}"/>
      <circle class="ndot" cx="${x}" cy="${y}" r="${r}" fill="url(#hub_${id})" stroke="#fff" stroke-opacity=".28" stroke-width="2"/>
      <svg x="${f1(x - r * 0.62)}" y="${f1(n.y - r * 0.62)}" width="${f1(r * 1.24)}" height="${f1(r * 1.24)}" viewBox="0 0 24 24" fill="#fff" style="color:#fff">${BANK_MARKS[n.bank] || BANK_MARK_ANY}</svg>
      ${radialLabel(n, esc(n.label), 15.5, 800, "var(--m3-on-surface)")}
    </g>`;
  }
  if (n.type === "primary") {
    // Holder's initials INSIDE the circle (e.g. "Bejgam Nishanth" → BN); the
    // star shrinks to a small rim badge so it never covers the identity. The
    // card name sits radially OUTWARD from the centre, so labels of
    // neighbouring primaries fan apart instead of overlapping.
    const ini = nodeInitials(n.card);
    const bx = f1(n.x + r * 0.72), by = f1(n.y - r * 0.72);
    return `<g class="gnode" data-id="${n.card.id}">
      <circle class="halo" cx="${x}" cy="${y}" r="${r + 12}" fill="${n.m.b}" opacity=".16"/>
      <circle class="ndot" cx="${x}" cy="${y}" r="${r}" fill="url(#hub_${id})" stroke="#fff" stroke-opacity=".3" stroke-width="2"/>
      ${ini
        ? `<text x="${x}" y="${f1(n.y + 6)}" text-anchor="middle" font-size="16" font-weight="800" letter-spacing=".5" fill="#fff">${esc(ini)}</text>`
        : starMark(x, y, 24, "#fff")}
      <circle cx="${bx}" cy="${by}" r="10" fill="#fff" stroke="${n.m.a}" stroke-width="1.5"/>
      ${starMark(bx, by, 13, n.m.a)}
      ${radialLabel(n, esc(truncate(n.label, 16)), 14, 800, "var(--m3-on-surface)")}
    </g>`;
  }
  if (n.type === "orphanPrimary") {
    return `<g class="gnode">
      <circle class="ndot" cx="${x}" cy="${y}" r="${r}" fill="var(--m3-surface-2)" stroke="var(--m3-outline)" stroke-width="2.5" stroke-dasharray="5 6"/>
      ${starMark(x, y - 4, 22, "var(--m3-outline)")}
      <text x="${x}" y="${y + 18}" text-anchor="middle" font-size="9.5" font-weight="700" fill="var(--m3-outline)">PRIMARY?</text>
      ${radialLabel(n, esc(truncate(n.label, 16)), 14, 800, "var(--m3-on-surface-var)")}
    </g>`;
  }
  // Add-on: just the initials inside the ring — no name label below (the two
  // letters identify the family member; click the node for full details).
  const ini = nodeInitials(n.card);
  return `<g class="gnode" data-id="${n.card.id}">
    <circle class="halo" cx="${x}" cy="${y}" r="${r + 9}" fill="${n.m.b}" opacity=".14"/>
    <circle class="ndot" cx="${x}" cy="${y}" r="${r}" fill="var(--m3-surface-1)" stroke="${n.m.b}" stroke-width="3.5"/>
    ${ini
      ? `<text x="${x}" y="${y + 5}" text-anchor="middle" font-size="14" font-weight="800" fill="var(--m3-on-surface)">${esc(ini)}</text>`
      : personMark(x, y, 22, n.m.b)}
  </g>`;
}

// Place a node's label pointing AWAY from the graph centre: right-side nodes
// get left-anchored text to their right, left-side nodes the mirror, and
// nodes near the top/bottom put the label above/below. Keeps neighbouring
// labels fanning outward instead of stacking on each other.
function radialLabel(n, text, size, weight, fill) {
  const ang = Math.atan2(n.y, n.x);
  const c = Math.cos(ang), s = Math.sin(ang);
  let anchor, lx, ly;
  if (Math.abs(c) < 0.35) {                       // near vertical → above/below
    anchor = "middle"; lx = n.x;
    ly = n.y + (s > 0 ? n.r + 12 + size : -(n.r + 14));
  } else {
    // Fully radial: the label starts on the outward ray from the graph centre
    // through the node, so it walks AWAY from ring-neighbours instead of
    // sweeping sideways across them.
    anchor = c > 0 ? "start" : "end";
    lx = n.x + c * (n.r + 12);
    ly = n.y + s * (n.r + 12) + 5;
  }
  return `<text class="glabel" x="${f1(lx)}" y="${f1(ly)}" text-anchor="${anchor}" font-size="${size}" font-weight="${weight}" fill="${fill}">${text}</text>`;
}

// -- Pan / zoom / click on the single canvas ------------------------------ //
function wireRelInteractions(W, H) {
  const svg = document.getElementById("relSvg");
  if (!svg) return;
  const toVB = (cx, cy) => { const r = svg.getBoundingClientRect(); return { x: (cx - r.left) / r.width * W, y: (cy - r.top) / r.height * H }; };

  svg.onwheel = (e) => {
    e.preventDefault();
    const p = toVB(e.clientX, e.clientY);
    const ns = clamp(state.rel.scale * (e.deltaY < 0 ? 1.12 : 1 / 1.12), 0.25, 4.5);
    state.rel.tx = p.x - (p.x - state.rel.tx) * (ns / state.rel.scale);
    state.rel.ty = p.y - (p.y - state.rel.ty) * (ns / state.rel.scale);
    state.rel.scale = ns; applyRelTransform();
  };

  let drag = false, lx = 0, ly = 0, moved = 0;
  svg.onpointerdown = (e) => { drag = true; moved = 0; lx = e.clientX; ly = e.clientY; svg.classList.add("dragging"); try { svg.setPointerCapture(e.pointerId); } catch (_) {} };
  svg.onpointermove = (e) => {
    if (!drag) return;
    const r = svg.getBoundingClientRect(), rx = W / r.width, ry = H / r.height;
    const dx = e.clientX - lx, dy = e.clientY - ly; moved += Math.abs(dx) + Math.abs(dy);
    state.rel.tx += dx * rx; state.rel.ty += dy * ry; lx = e.clientX; ly = e.clientY; applyRelTransform();
  };
  const end = () => { if (!drag) return; drag = false; svg.classList.remove("dragging"); svg._moved = moved; };
  svg.onpointerup = end; svg.onpointercancel = end; svg.onpointerleave = end;

  svg.querySelectorAll(".gnode[data-id]").forEach((g) => {
    g.addEventListener("click", () => {
      if ((svg._moved || 0) > 6) { svg._moved = 0; return; }  // was a drag, not a click
      const c = state.cards.find((x) => x.id === g.dataset.id);
      if (c) openDetails(c);
    });
  });

  const zoomBy = (factor) => {
    const ns = clamp(state.rel.scale * factor, 0.25, 4.5), cx = W / 2, cy = H / 2;
    state.rel.tx = cx - (cx - state.rel.tx) * (ns / state.rel.scale);
    state.rel.ty = cy - (cy - state.rel.ty) * (ns / state.rel.scale);
    state.rel.scale = ns; applyRelTransform();
  };
  const zi = $("#relZoomIn"), zo = $("#relZoomOut"), full = $("#relFull");
  if (zi) zi.onclick = () => zoomBy(1.2);
  if (zo) zo.onclick = () => zoomBy(1 / 1.2);
  // Third control: full-screen the graph stage (and it re-fits to the bigger
  // canvas on the resulting fullscreenchange). Clicking again exits.
  if (full) full.onclick = () => {
    const stage = $("#relStage");
    if (document.fullscreenElement) document.exitFullscreen?.();
    else stage.requestFullscreen?.();
  };
}

// Re-render whichever view is active after a data change.
// 2.0: the ✕ in Cardholder name and Card number - shown while the field has text.
const CLEARABLE = [["#fHolder", "#fHolderClear"], ["#fNumber", "#fNumberClear"]];
function syncHolderClear() {
  CLEARABLE.forEach(([f, b]) => { const el = $(b); if (el) el.hidden = !$(f).value; });
}
function wireHolderClear() {
  CLEARABLE.forEach(([fs, bs]) => {
    const b = $(bs), f = $(fs);
    if (!b) return;
    f.addEventListener("input", syncHolderClear);
    b.addEventListener("pointerdown", (e) => e.preventDefault());   // keep the keyboard up
    b.onclick = () => { f.value = ""; $("#fNumberErr").hidden = true; syncHolderClear(); f.focus(); };
  });
}
function goHome() {
  $("#menu").hidden = true;
  state.selectedBank = "All"; state.selectedNetwork = "All"; state.selectedVariant = "All";
  state.showArchived = false; state.search = ""; state.selectedKind = "All";
  state.selectedRelation = relDefault();
  const si = $("#searchInput"); if (si) si.value = "";
  closeSearch();
  const ab = $("#archiveBtn");
  if (ab) { ab.classList.remove("is-active"); ab.setAttribute("aria-pressed", "false"); ab.title = "Show archived cards"; }
  switchTab("cards");
  refreshActiveView();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function refreshActiveView() {
  renderHomeTools();
  renderBankBar(); renderCards();
  if (state.tab === "rel") renderRelationship();
  if (state.tab === "pp") renderPasses();
}


// ==========================================================================
//  1.3.0 - RELATIONS, SEARCH, CARD TYPE, PRIORITY PASS
// ==========================================================================
// All four came from the closed test. They are additive: a card gains three
// optional string keys (nickname, kind, relation) and one optional array
// (passes). Nothing about the vault file format changes, and a pre-1.3.0 card
// reads as a Credit card belonging to Self.

// ---- Relations ------------------------------------------------------------
// The list itself is a DEVICE setting (localStorage), like the theme: it is
// not secret and the vault payload is a bare list of cards with nowhere else
// to put it. To make sure an imported vault never shows a relation the list
// does not know, availableRelations() also folds in whatever is used on a
// card - so "Business Partner" survives the trip even to a phone that never
// added it.
// Deliberately two. The first list shipped eight, and a settings page that
// opens on eight chips - six of them empty - reads as clutter you have to
// tidy rather than a feature. Add your own in Settings > Relations.
const DEFAULT_RELATIONS = ["Self", "Spouse"];
const RELATIONS_KEY = "cv-relations";     // JSON: the user's edited list
const REL_LOCK_KEY = "cv-rel-lock";       // the relation the home page opens on

const ICON_PERSON = `<svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.3 0-8 1.7-8 4v2h16v-2c0-2.3-4.7-4-8-4Z"/></svg>`;

const cardRelation = (c) => (c && c.relation) || "Self";
const cardKind = (c) => (c && c.kind === "debit") ? "debit" : "credit";
const kindLabel = (k) => k === "debit" ? "Debit card" : "Credit card";
// The tile title. A nickname, when set, is what the user calls the card.
const displayName = (c) => c.nickname ? c.nickname : titleCase(c.card_name);

function storedRelations() {
  try {
    const v = JSON.parse(localStorage.getItem(RELATIONS_KEY));
    if (Array.isArray(v) && v.length) return v.map(String);
  } catch (e) {}
  return DEFAULT_RELATIONS.slice();
}
function saveRelations(list) {
  try { localStorage.setItem(RELATIONS_KEY, JSON.stringify(list)); } catch (e) {}
}
/** The edited list, Self first, plus anything a card uses that the list has
 *  forgotten. Case-insensitive de-dupe, keeping the first spelling seen. */
function availableRelations() {
  const out = [], seen = new Set();
  const push = (r) => {
    r = String(r || "").trim();
    if (!r) return;
    const k = r.toLowerCase();
    if (seen.has(k)) return;
    seen.add(k); out.push(r);
  };
  push("Self");
  storedRelations().forEach(push);
  state.cards.forEach((c) => push(cardRelation(c)));
  return out;
}
function relationCounts() {
  const counts = {};
  state.cards.forEach((c) => {
    if (c.archived) return;
    const r = cardRelation(c);
    counts[r] = (counts[r] || 0) + 1;
  });
  return counts;
}
/** The relation the home page should open on: the locked one, if it still
 *  exists, else Self. */
function relDefault() {
  let locked = "";
  try { locked = localStorage.getItem(REL_LOCK_KEY) || ""; } catch (e) {}
  if (!locked) return "Self";
  if (locked === "All") return "All";
  const known = availableRelations().some((r) => r.toLowerCase() === locked.toLowerCase());
  return known ? locked : "Self";
}
function relLocked() {
  try { return localStorage.getItem(REL_LOCK_KEY) || ""; } catch (e) { return ""; }
}
function setRelLock(rel) {
  try {
    if (rel) localStorage.setItem(REL_LOCK_KEY, rel);
    else localStorage.removeItem(REL_LOCK_KEY);
  } catch (e) {}
}

// ---- Home tools: search box + relation pill --------------------------------
function wireHomeTools() {
  const input = $("#searchInput"), clear = $("#searchClear");
  if (!input) return;
  input.addEventListener("input", () => {
    state.search = input.value;
    clear.hidden = !input.value;
    renderCards();
  });
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") input.blur(); });
  clear.onclick = () => {
    input.value = ""; state.search = ""; clear.hidden = true;
    renderCards(); input.focus();
  };
  $("#searchBtn").onclick = () => openSearch();
  $("#searchBack").onclick = () => closeSearch();
  $("#relPill").onclick = openRelSheet;
  $("#relSheetClose").onclick = closeRelSheet;
  $("#relSheet").onclick = (e) => { if (e.target.id === "relSheet") closeRelSheet(); };
  $("#relManageBtn").onclick = () => { closeRelSheet(); openVaultSheet(); };

  $("#relLockBtn").onclick = () => {
    const cur = state.selectedRelation;
    const isLocked = relLocked().toLowerCase() === cur.toLowerCase();
    if (isLocked) {
      setRelLock("");
      toast("Home page will open on Self again");
    } else {
      setRelLock(cur);
      toast((cur === "All" ? "All cards" : cur) + " is now your home view");
    }
    renderHomeTools();
  };
}

/** Show the search field in place of the header's own contents. */
function openSearch() {
  $(".topbar-inner").classList.add("is-searching");
  $("#topSearch").hidden = false;
  const input = $("#searchInput");
  input.value = state.search;
  $("#searchClear").hidden = !state.search;
  setTimeout(() => input.focus(), 40);
}
/** Close it and drop the query - a search you cannot see must not keep
 *  filtering the list, which is how a user ends up with "missing" cards. */
function closeSearch() {
  $(".topbar-inner").classList.remove("is-searching");
  $("#topSearch").hidden = true;
  if (state.search) { state.search = ""; $("#searchInput").value = ""; renderCards(); }
  $("#searchClear").hidden = true;
}
function searchOpen() { return !$("#topSearch").hidden; }

function renderHomeTools() {
  const pill = $("#relPill"), lock = $("#relLockBtn");
  if (!pill) return;
  queueFit();
  const rel = state.selectedRelation;
  const counts = relationCounts();
  const n = rel === "All"
    ? state.cards.filter((c) => !c.archived).length
    : (counts[rel] || 0);
  const caret = '<svg class="mfp-caret" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="m7 10 5 5 5-5z"/></svg>';
  pill.innerHTML = '<span class="rel-pill-ico">' + ICON_PERSON + '</span>'
    + '<span class="rel-pill-text">' + esc(rel === "All" ? "Everyone" : rel) + '</span>'
    + '<span class="mfp-count">' + n + '</span>' + caret;
  pill.title = "Showing " + (rel === "All" ? "everyone\u2019s cards" : rel === "Self" ? "your own cards" : rel + "\u2019s cards");
  pill.classList.toggle("is-set", rel !== "Self");

  const locked = relLocked().toLowerCase() === rel.toLowerCase();
  lock.classList.toggle("is-locked", locked);
  lock.setAttribute("aria-pressed", String(locked));
  lock.title = locked
    ? "Home page opens on " + (rel === "All" ? "everyone\u2019s cards" : rel) + " \u2014 tap to unlock"
    : "Remember " + (rel === "All" ? "everyone" : rel) + " as my default view";
  const si = $("#searchInput");
  if (si && si.value !== state.search) { si.value = state.search; $("#searchClear").hidden = !state.search; }
}

function openRelSheet() {
  const list = $("#relList");
  const counts = relationCounts();
  const total = state.cards.filter((c) => !c.archived).length;
  const rels = availableRelations();
  const row = (name, label, count) => {
    const on = state.selectedRelation === name;
    return '<button type="button" class="rel-opt ' + (on ? "is-on" : "") + '" data-rel="' + esc(name) + '">'
      + '<span class="rel-opt-ico">' + (name === "All" ? "\u25A4" : ICON_PERSON) + '</span>'
      + '<span class="rel-opt-text">' + esc(label) + '</span>'
      + '<span class="count">' + count + '</span>'
      + (on ? '<svg class="rel-opt-tick" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z"/></svg>' : "")
      + '</button>';
  };
  list.innerHTML = rels.map((r) => row(r, r, counts[r] || 0)).join("") + row("All", "Everyone", total);
  list.querySelectorAll(".rel-opt").forEach((b) => {
    b.onclick = () => {
      state.selectedRelation = b.dataset.rel;
      state.selectedBank = "All";
      closeRelSheet();
      refreshActiveView();
    };
  });
  $("#relSheet").hidden = false;
}
function closeRelSheet() { const el = $("#relSheet"); if (el) el.hidden = true; }

// ---- Fit to the screen (1.3.6) ----------------------------------------------
// User report: rows ran past the right edge. A width breakpoint cannot see
// the cause on most phones - Android hands the system font size and "Screen
// zoom" to the WebView, so a 393px phone can lay out like a 320px one. So
// MEASURE instead: if any of these labels is cut short, step down to the
// compact layout (html.fit-narrow), and if that is still not enough, to the
// tightest one (html.fit-tiny). See the matching rules in mobile.css.
const FIT_PROBES = ".tabs .tab, .rel-pill-text, .mfilter-pill .mfp-text, .tile-number .num, .tile-bank-name";
let fitQueued = false;
function queueFit() {
  if (fitQueued) return;
  fitQueued = true;
  requestAnimationFrame(() => { fitQueued = false; fitToScreen(); });
}
function labelsCut() {
  return [...document.querySelectorAll(FIT_PROBES)]
    .some((el) => el.offsetParent && el.scrollWidth > el.clientWidth + 1);
}
function fitToScreen() {
  const root = document.documentElement;
  root.classList.remove("fit-narrow", "fit-tiny");
  if (!labelsCut()) return;
  root.classList.add("fit-narrow");
  if (labelsCut()) root.classList.add("fit-tiny");
}

// ---- Search ---------------------------------------------------------------
// Every token typed has to match SOMETHING on the card, so "hdfc visa" finds
// HDFC Visa cards and "1234" finds the card ending 1234. Nothing here reads a
// pass number: Priority Pass is its own view by design.
function searchHaystack(c) {
  const d = (c.number || "").replace(/\D/g, "");
  return [
    c.bank, c.card_name, c.nickname, c.holder, c.notes,
    c.network, c.variant, kindLabel(cardKind(c)), cardRelation(c),
    c.addon ? "add-on addon" : "primary",
    d.slice(-4),
  ].filter(Boolean).join(" \u0001 ").toLowerCase();
}
function matchesSearch(c, q) {
  const hay = searchHaystack(c);
  return q.toLowerCase().split(/\s+/).filter(Boolean).every((t) => hay.indexOf(t) >= 0);
}

// ---- Credit / Debit filter ---------------------------------------------------
function renderKindBar() {
  const wrap = $("#kindFilter");
  if (!wrap) return;
  const base = visibleCards();
  const counts = { credit: 0, debit: 0 };
  base.forEach((c) => { counts[cardKind(c)]++; });
  const opts = [["All", "All types", base.length], ["credit", "Credit", counts.credit], ["debit", "Debit", counts.debit]];
  wrap.innerHTML = '<span class="filter-label">Card type</span>' + opts.map(([k, label, n]) =>
    '<button type="button" class="var-chip ' + (state.selectedKind === k ? "is-active" : "") + '" data-kind="' + k + '">'
    + '<span>' + label + '</span><span class="count">' + n + '</span></button>').join("");
  wrap.querySelectorAll(".var-chip").forEach((b) => {
    b.onclick = () => {
      state.selectedKind = b.dataset.kind;
      renderKindBar(); renderMobileFilterBar(); renderCards();
      closeFilterSheet();
    };
  });
}

// ---- Segmented control (card type, pass status) ----------------------------
function wireSeg(segSel, hiddenSel, attr) {
  $(segSel).querySelectorAll(".seg-btn").forEach((b) => {
    b.onclick = () => setSeg(segSel, hiddenSel, attr, b.dataset[attr]);
  });
}
function setSeg(segSel, hiddenSel, attr, value) {
  $(segSel).querySelectorAll(".seg-btn").forEach((b) => {
    const on = b.dataset[attr] === value;
    b.classList.toggle("is-on", on);
    b.setAttribute("aria-checked", String(on));
  });
  $(hiddenSel).value = value;
}

function fillRelationOptions(selected) {
  const sel = $("#fRelation");
  const rels = availableRelations();
  sel.innerHTML = rels.map((r) => '<option>' + esc(r) + '</option>').join("")
    // 1.3.8 (closed-test feedback): nobody found the Relations list in
    // Settings from here. Picking this opens it; it is never a saved value.
    + '<option value="' + ADD_REL + '">+ Add more relations…</option>';
  sel.value = rels.some((r) => r === selected) ? selected : "Self";
  sel.dataset.prev = sel.value;
}
const ADD_REL = "__add_relation";
// Open Settings at the Relations block from the Add card sheet. The sheet stays
// open underneath with everything typed; a relation added now is selected.
function wireRelationPicker() {
  const sel = $("#fRelation");
  sel.addEventListener("change", () => {
    if (sel.value !== ADD_REL) { sel.dataset.prev = sel.value; return; }
    sel.value = sel.dataset.prev || "Self";
    relPickPending = true;
    openVaultSheet().then(() => {
      const block = $("#relBlock");
      if (block) block.scrollIntoView({ block: "start" });
      const input = $("#relAddInput");
      if (input) input.focus();
    });
  });
}
let relPickPending = false;
// After the Relations list changes: keep the Add card dropdown current, and
// select the one just added if the user came from that dropdown.
function syncRelationPicker(added) {
  const sheetOpen = !$("#sheet").hidden;
  if (!sheetOpen) { relPickPending = false; return; }
  const sel = $("#fRelation");
  fillRelationOptions(added && relPickPending ? added : sel.value);
  if (added) relPickPending = false;
}

// ---- Relations in Settings --------------------------------------------------
function wireRelationSettings() {
  const form = $("#relAddForm");
  if (!form) return;
  form.onsubmit = (e) => {
    e.preventDefault();
    const msg = $("#relMsg"); msg.hidden = true;
    const input = $("#relAddInput");
    const name = input.value.trim().replace(/\s+/g, " ").slice(0, 30);
    if (!name) return;
    const list = storedRelations();
    if (list.some((r) => r.toLowerCase() === name.toLowerCase())) {
      return showErr(msg, "\u201C" + name + "\u201D is already in the list.");
    }
    list.push(name);
    saveRelations(list);
    input.value = "";
    renderRelChips();
    syncRelationPicker(name);
    toast("Added " + name);
  };
  wireRelationPicker();
}
function renderRelChips() {
  const wrap = $("#relChips");
  if (!wrap) return;
  const counts = relationCounts();
  const list = storedRelations();
  wrap.innerHTML = list.map((r) => {
    const n = counts[r] || 0;
    const fixed = r === "Self";
    return '<span class="rel-chip ' + (fixed ? "is-fixed" : "") + '">'
      + '<span>' + esc(r) + '</span>'
      + (n ? '<span class="count">' + n + '</span>' : "")
      + (fixed ? "" : '<button type="button" class="rel-chip-x" data-rel="' + esc(r) + '" aria-label="Remove ' + esc(r) + '">&times;</button>')
      + '</span>';
  }).join("");
  wrap.querySelectorAll(".rel-chip-x").forEach((b) => {
    b.onclick = () => {
      const msg = $("#relMsg"); msg.hidden = true;
      const r = b.dataset.rel;
      const n = counts[r] || 0;
      if (n) return showErr(msg, n + (n === 1 ? " card is" : " cards are") + " marked " + r + ". Move them to another relation first.");
      saveRelations(storedRelations().filter((x) => x !== r));
      if (relLocked() === r) setRelLock("");
      if (state.selectedRelation === r) state.selectedRelation = "Self";
      renderRelChips(); renderHomeTools(); syncRelationPicker();
      toast("Removed " + r);
    };
  });
}

// ---- Priority Pass ---------------------------------------------------------
// Passes live on the card: card.passes = [{ id, number, issued, expiry,
// status, notes }]. The card supplies the bank, the name and whose it is, so
// none of that is duplicated and none of it can drift.
const passLabel = (c) => displayName(c) + " \u00B7 " + c.bank;

/** Active cards that can carry a pass, newest relation grouping first. */
function passCards() {
  return state.cards.filter((c) => !c.archived)
    .sort((a, b) => passLabel(a).localeCompare(passLabel(b), undefined, { sensitivity: "base" }));
}
/** All passes with their card, for the list. */
function allPasses() {
  const out = [];
  state.cards.forEach((c) => {
    if (c.archived || !Array.isArray(c.passes)) return;
    c.passes.forEach((p) => out.push({ pass: p, card: c }));
  });
  return out;
}
/** A pass is expired if it says so, or if its expiry month has gone by. */
function passExpired(p) {
  if (p.status === "expired") return true;
  if (!p.expiry) return false;
  const m = /^(\d{4})-(\d{2})$/.exec(p.expiry);
  if (!m) return false;
  const now = new Date();
  const ym = now.getFullYear() * 100 + (now.getMonth() + 1);
  return (parseInt(m[1], 10) * 100 + parseInt(m[2], 10)) < ym;
}
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmtMonth(v) {
  const m = /^(\d{4})-(\d{2})$/.exec(v || "");
  if (!m) return v || "";
  return MONTHS[parseInt(m[2], 10) - 1] + " " + m[1];
}

function renderPasses() {
  const list = $("#ppList"), empty = $("#ppEmpty");
  if (!list) return;
  const rows = allPasses();
  const hasCards = state.cards.some((c) => !c.archived);
  if (!rows.length) {
    list.innerHTML = ""; empty.hidden = false;
    $("#ppEmptyTitle").textContent = hasCards ? "No Priority Pass saved yet" : "Add a card first";
    $("#ppEmptyMsg").textContent = hasCards
      ? "Add the pass number that came with a card and it will show up here, linked to that card."
      : "A Priority Pass is stored against the card it came with, so there needs to be a card to attach it to.";
    $("#ppEmptyAddBtn").hidden = !hasCards;
    return;
  }
  empty.hidden = true;

  // Grouped by card, cards A-Z, so several passes on one card sit together.
  const groups = new Map();
  rows.forEach(({ pass, card }) => {
    if (!groups.has(card.id)) groups.set(card.id, { card, passes: [] });
    groups.get(card.id).passes.push(pass);
  });
  const ordered = Array.from(groups.values()).sort((a, b) =>
    passLabel(a.card).localeCompare(passLabel(b.card), undefined, { sensitivity: "base" }));
  const copyIcon = `<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H8V7h11v14Z"/></svg>`;

  list.innerHTML = ordered.map(({ card, passes }) => {
    const m = bankMeta(card.bank);
    const items = passes.map((p) => {
      const expired = passExpired(p);
      const dates = [p.issued ? "Issued " + fmtMonth(p.issued) : "", p.expiry ? "Expires " + fmtMonth(p.expiry) : ""]
        .filter(Boolean).join(" \u00B7 ");
      return `
      <div class="pp-item ${expired ? "is-expired" : ""}" data-pid="${esc(p.id)}">
        <div class="pp-item-main">
          <div class="pp-num sensitive">${esc(p.number)}</div>
          <div class="pp-meta">
            <span class="pp-status">${expired ? "Expired" : "Active"}</span>
            ${dates ? `<span class="pp-dates">${esc(dates)}</span>` : ""}
          </div>
          ${p.notes ? `<div class="pp-notes">${esc(p.notes)}</div>` : ""}
        </div>
        <div class="pp-item-actions">
          <button class="icon-btn" data-pact="copy" title="Copy pass number" aria-label="Copy pass number">${copyIcon}</button>
          <button class="icon-btn" data-pact="edit" title="Edit" aria-label="Edit pass"><svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25ZM20.7 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z"/></svg></button>
          <button class="icon-btn" data-pact="delete" title="Remove" aria-label="Remove pass"><svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M6 7h12l-1 14H7L6 7Zm3-3h6l1 2h4v2H2V6h4l1-2Z"/></svg></button>
        </div>
      </div>`;
    }).join("");
    return `
    <section class="pp-group" style="${bankStyle(card.bank)}" data-cid="${esc(card.id)}">
      <div class="pp-card">
        <span class="glyph has-mark">${bankMarkSvg(card.bank, 18)}</span>
        <div class="pp-card-text">
          <div class="pp-card-name">${esc(displayName(card))}</div>
          <div class="pp-card-sub">${esc(card.bank)}${card.nickname ? " \u00B7 " + esc(titleCase(card.card_name)) : ""} \u00B7 ${kindLabel(cardKind(card))}</div>
        </div>
        <span class="tile-tag rel">${ICON_PERSON}${esc(cardRelation(card))}</span>
      </div>
      ${items}
    </section>`;
  }).join("");

  list.querySelectorAll(".pp-item").forEach((row) => {
    const cid = row.closest(".pp-group").dataset.cid;
    const pid = row.dataset.pid;
    const card = () => state.cards.find((c) => c.id === cid);
    const pass = () => (card().passes || []).find((p) => p.id === pid);
    row.querySelectorAll("[data-pact]").forEach((b) => {
      b.onclick = async (e) => {
        e.stopPropagation();
        const act = b.dataset.pact;
        if (act === "edit") return openPassSheet(card(), pass());
        if (act === "delete") return confirmDeletePass(card(), pass());
        if (act === "copy") {
          const ok = await window.YCJ.mobile.copySensitive(pass().number || "");
          const secs = Math.round(window.YCJ.mobile.CLIP_TTL_MS / 1000);
          return toast(ok ? "Pass number copied \u2014 clears in " + secs + "s" : "Could not copy");
        }
      };
    });
  });
}

function wirePassSheet() {
  if (!$("#ppSheet")) return;
  $("#ppForm").onsubmit = submitPass;
  $("#ppSheetClose").onclick = closePassSheet;
  $("#ppCancelBtn").onclick = closePassSheet;
  $("#ppSheet").onclick = (e) => { if (e.target.id === "ppSheet") closePassSheet(); };
  $("#ppEmptyAddBtn").onclick = () => openPassSheet(null);
  wireSeg("#ppStatusSeg", "#ppStatus", "status");
  $("#ppCard").addEventListener("change", reflectPassCard);
  // Typing an expiry that has already gone by flips the status for you.
  $("#ppExpiry").addEventListener("change", () => {
    if (passExpired({ expiry: $("#ppExpiry").value })) setSeg("#ppStatusSeg", "#ppStatus", "status", "expired");
  });
}
function reflectPassCard() {
  const c = state.cards.find((x) => x.id === $("#ppCard").value);
  $("#ppCardHint").textContent = c
    ? "Whose: " + cardRelation(c) + (c.holder ? " \u00B7 " + titleCase(c.holder) : "") + " \u00B7 " + kindLabel(cardKind(c))
    : "";
}
function openPassSheet(card, pass) {
  const cards = passCards();
  if (!cards.length) return toast("Add a card first");
  const editing = !!pass;
  $("#ppSheetTitle").textContent = editing ? "Edit Priority Pass" : "Add Priority Pass";
  $("#ppSaveBtn").textContent = editing ? "Save changes" : "Save pass";
  const sel = $("#ppCard");
  sel.innerHTML = cards.map((c) => '<option value="' + esc(c.id) + '">' + esc(passLabel(c)) + " (" + esc(cardRelation(c)) + ")</option>").join("");
  sel.value = card ? card.id : cards[0].id;
  sel.disabled = editing;           // a pass does not move between cards
  $("#ppId").value = pass ? pass.id : "";
  $("#ppCardId").value = card ? card.id : "";
  $("#ppNumber").value = pass ? pass.number || "" : "";
  $("#ppIssued").value = pass ? pass.issued || "" : "";
  $("#ppExpiry").value = pass ? pass.expiry || "" : "";
  setSeg("#ppStatusSeg", "#ppStatus", "status", pass && pass.status === "expired" ? "expired" : "active");
  $("#ppNotes").value = pass ? pass.notes || "" : "";
  reflectPassCard();
  $("#ppSheet").hidden = false;
  setTimeout(() => $("#ppNumber").focus(), 40);
}
function closePassSheet() { const el = $("#ppSheet"); if (el) el.hidden = true; }

async function savePasses(card, passes) {
  const res = await api.send("/api/cards/" + card.id, "PUT", { passes });
  if (res.card) {
    const i = state.cards.findIndex((c) => c.id === card.id);
    if (i > -1) state.cards[i] = res.card;
  }
}
async function submitPass(e) {
  e.preventDefault();
  const number = $("#ppNumber").value.trim().toUpperCase();
  if (!number) return;
  const cid = $("#ppCard").value || $("#ppCardId").value;
  const card = state.cards.find((c) => c.id === cid);
  if (!card) return;
  const entry = {
    id: $("#ppId").value || ("pp-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7)),
    number,
    issued: $("#ppIssued").value || "",
    expiry: $("#ppExpiry").value || "",
    status: $("#ppStatus").value === "expired" ? "expired" : "active",
    notes: $("#ppNotes").value.trim(),
  };
  const passes = Array.isArray(card.passes) ? card.passes.slice() : [];
  const i = passes.findIndex((p) => p.id === entry.id);
  if (i > -1) passes[i] = entry; else passes.push(entry);
  await savePasses(card, passes);
  closePassSheet(); renderPasses();
  toast(i > -1 ? "Pass updated" : "Pass added to " + displayName(card));
}
function confirmDeletePass(card, pass) {
  openModal(`
    <div class="reveal-badge" style="background:linear-gradient(135deg,var(--m3-error),#e0685f)">
      <svg viewBox="0 0 24 24" width="26" height="26"><path fill="currentColor" d="M6 7h12l-1 14H7L6 7Zm3-3h6l1 2h4v2H2V6h4l1-2Z"/></svg>
    </div>
    <h2>Remove this pass?</h2>
    <p>${esc(pass.number)} will be removed from \u201C${esc(displayName(card))}\u201D. The card itself is not touched.</p>
    <div class="modal-foot">
      <button type="button" class="btn btn-text" id="ppDelCancel">Cancel</button>
      <button type="button" class="btn btn-danger" id="ppDelDo">Remove pass</button>
    </div>`);
  $("#ppDelCancel").onclick = closeModal;
  $("#ppDelDo").onclick = async () => {
    const passes = (card.passes || []).filter((p) => p.id !== pass.id);
    await savePasses(card, passes);
    closeModal(); renderPasses(); toast("Pass removed");
  };
}

// ---- Modal / snackbar helpers --------------------------------------------
function openModal(html) { $("#modalBox").innerHTML = html; $("#modal").hidden = false; }
function closeModal() { $("#modal").hidden = true; $("#modalBox").innerHTML = ""; }
let toastT;
function toast(msg) {
  const s = $("#snackbar");
  s.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z"/></svg>${esc(msg)}`;
  s.hidden = false; requestAnimationFrame(() => s.classList.add("show"));
  clearTimeout(toastT);
  toastT = setTimeout(() => { s.classList.remove("show"); setTimeout(() => (s.hidden = true), 220); }, 2200);
}

// ---- Global wiring --------------------------------------------------------
function wireGlobalUI() {
  wireNumberFormat();
  wireTabs();
  // Re-fit the relationship graph whenever we enter/exit full screen (the stage
  // changes size), and flip the button icon between expand/collapse.
  document.addEventListener("fullscreenchange", () => {
    const isFull = document.fullscreenElement === $("#relStage");
    $("#relFull")?.classList.toggle("is-full", isFull);
    if (state.tab === "rel") requestAnimationFrame(renderRelationship);
  });
  $("#fAddon").addEventListener("change", reflectAddonToggle);
  $("#fNetwork").addEventListener("change", () => fillVariantOptions(""));
  window.addEventListener("resize", updateStickyOffsets);
  window.addEventListener("resize", queueFit);
  $("#cardForm").onsubmit = submitCard;
  // One header button, two meanings: on the Priority Pass tab it adds a pass.
  $("#addBtn").onclick = () => state.tab === "pp" ? openPassSheet(null) : openSheet(null);
  wireHomeTools();
  wireRelationSettings();
  wirePassSheet();
  wireSeg("#fKindSeg", "#fKind", "kind");
  // Bulk paste, offered from inside the Add-card sheet. Closing the sheet
  // first stops the two stacking, which on a phone reads as the app losing
  // track of where you are.
  $("#sheetImportBtn").onclick = () => { closeSheet(); openImport(); };
  $("#emptyAddBtn").onclick = () => openSheet(null);
  $("#sheetClose").onclick = closeSheet;
  $("#cancelBtn").onclick = closeSheet;
  $("#sheet").onclick = (e) => { if (e.target.id === "sheet") closeSheet(); };
  $("#vaultClose").onclick = () => { $("#vaultSheet").hidden = true; };
  $("#vaultSheet").onclick = (e) => {
    if (e.target.id === "vaultSheet") $("#vaultSheet").hidden = true;
  };
  $("#modal").onclick = (e) => { if (e.target.id === "modal") closeModal(); };
  $("#importBtn").onclick = openImport;
  $("#importClose").onclick = closeImport;
  $("#importCancel").onclick = closeImport;
  $("#importDo").onclick = submitImport;
  $("#importText").addEventListener("input", updateImportCount);
  $("#importSheet").onclick = (e) => { if (e.target.id === "importSheet") closeImport(); };
  $("#themeBtn").onclick = () => {
    const cur = document.documentElement.getAttribute("data-theme");
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("cv-theme", next);
  };
  // 2.0 (feedback): a way to put the keyboard away everywhere - tap any
  // empty part of the screen (not another field or a button) and the field
  // being typed in lets go, so the keyboard closes. The phone's own
  // hide-keyboard key still works too.
  document.addEventListener("pointerdown", (e) => {
    const a = document.activeElement;
    if (!a || !/^(INPUT|TEXTAREA)$/.test(a.tagName)) return;
    if (e.target.closest("input, textarea, select, button, label, a, [role=option], [role=button], .bank-sug")) return;
    a.blur();
  });
  // 2.0 (feedback): the Card Vault name/logo is the way home from anywhere -
  // My Cards tab, active cards, no search, no bank or network filter, the
  // home relation, back at the top. The same start an unlock gives.
  const brand = document.querySelector(".topbar .brand");
  if (brand) {
    brand.setAttribute("role", "button"); brand.tabIndex = 0;
    brand.setAttribute("aria-label", "Card Vault home");
    brand.onclick = goHome;
    brand.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goHome(); } };
  }
  $("#archiveBtn").onclick = () => {
    state.showArchived = !state.showArchived;
    const btn = $("#archiveBtn");
    btn.classList.toggle("is-active", state.showArchived);
    btn.setAttribute("aria-pressed", String(state.showArchived));
    btn.title = state.showArchived ? "Showing archived — click for active cards" : "Show archived cards";
    state.selectedBank = "All";
    state.revealed.clear();
    renderBankBar(); renderCards();
    toast(state.showArchived ? "Showing archived cards" : "Showing active cards");
  };
  $("#lockNowBtn").onclick = () => lockNow();
  // dismiss menu on any outside interaction
  document.addEventListener("click", (e) => {
    if (!$("#menu").hidden && !$("#menu").contains(e.target)) $("#menu").hidden = true;
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { if (searchOpen()) closeSearch(); $("#menu").hidden = true; if (!$("#sheet").hidden) closeSheet(); if (!$("#importSheet").hidden) closeImport(); if (!$("#modal").hidden) closeModal(); }
  });
  window.addEventListener("scroll", () => { $("#menu").hidden = true; }, true);
}


// ---- Change master password (1.3.5) ----------------------------------------
// Current + new + confirm, same rules as creating a vault (8+ characters, not
// a known-weak one, strength meter). Wrong current passwords count towards the
// same lockout as the unlock screen: an unlocked phone left on a table must
// not become a free password-guessing machine.
function resetPasswordForm() {
  const f = $("#pwForm");
  if (!f) return;
  f.hidden = true; $("#pwChangeOpen").hidden = false;
  ["#pwCur", "#pwNew", "#pwNew2"].forEach((x) => { $(x).value = ""; setPwVisible(x.slice(1), false); });
  $("#pwMsg").hidden = true; $("#pwNewStrength").hidden = true;
  $("#pwSubmit").disabled = false; $("#pwSubmit").textContent = "Change password";
}
function renderNewStrength(pw) {
  const wrap = $("#pwNewStrength");
  if (!pw) { wrap.hidden = true; return; }
  const { score, label, hint } = passwordScore(pw);
  wrap.hidden = false; wrap.dataset.score = String(score);
  $("#pwNewStrengthLabel").textContent = label;
  $("#pwNewStrengthHint").textContent = hint;
  wrap.querySelectorAll(".pw-seg").forEach((seg, i) => seg.classList.toggle("is-on", i < Math.max(score, 1) && score > 0));
}
// Eye toggle on each password field (1.3.6): show or hide what was typed.
function setPwVisible(id, on) {
  const input = document.getElementById(id);
  const eye = document.querySelector('[data-eye="' + id + '"]');
  if (!input || !eye) return;
  input.type = on ? "text" : "password";
  eye.setAttribute("aria-pressed", String(on));
  eye.setAttribute("aria-label", on ? "Hide password" : "Show password");
}
function wirePasswordChange() {
  if (!$("#pwForm")) return;
  document.querySelectorAll("[data-eye]").forEach((b) => {
    // pointerdown keeps the keyboard up: the field does not lose focus.
    b.addEventListener("pointerdown", (e) => e.preventDefault());
    b.onclick = () => setPwVisible(b.dataset.eye, b.getAttribute("aria-pressed") !== "true");
  });
  $("#pwChangeOpen").onclick = () => {
    $("#pwChangeOpen").hidden = true; $("#pwForm").hidden = false;
    setTimeout(() => $("#pwCur").focus(), 40);
  };
  $("#pwCancel").onclick = resetPasswordForm;
  $("#pwNew").oninput = (e) => renderNewStrength(e.target.value);
  $("#pwForm").onsubmit = async (e) => {
    e.preventDefault();
    const msg = $("#pwMsg"); msg.hidden = true;
    const cur = $("#pwCur").value, next = $("#pwNew").value, again = $("#pwNew2").value;
    const left = guardRemaining();
    if (left > 0) return showErr(msg, "Too many attempts. Wait " + left + "s.");
    if (!cur) return showErr(msg, "Enter your current password.");
    if (next.length < MIN_LEN) return showErr(msg, "Use at least " + MIN_LEN + " characters for the new password.");
    if (passwordScore(next).score === 0) return showErr(msg, passwordScore(next).hint || "Choose something harder to guess.");
    if (next !== again) return showErr(msg, "The new passwords don't match.");
    if (next === cur) return showErr(msg, "That is the password you already have.");
    const btn = $("#pwSubmit");
    btn.disabled = true; btn.textContent = "Re-encrypting…";
    const res = await api.send("/api/password", "POST", { current: cur, next });
    btn.disabled = false; btn.textContent = "Change password";
    if (!res.ok) {
      guardFail();
      $("#pwCur").value = "";
      return showErr(msg, "That is not your current password.");
    }
    guardClear();
    const bioKept = await window.YCJ.mobile.bioUpdate(next);
    resetPasswordForm();
    if (!bioKept) { await wireBiometricToggle(); toast("Password changed · turn fingerprint unlock on again"); }
    else toast("Master password changed");
  };
}

// ---- Card scanner (1.3.5) --------------------------------------------------
// Live camera over the Add card sheet. Each frame is read by cardscan.js; a
// value is "locked" once enough frames agree (the number also has to pass the
// Luhn check). Front first - number, expiry, name - then the tip asks for the
// back, where the CVV is. Once number, expiry and CVV are locked the scanner
// closes itself and fills the form. Nothing is saved until the user taps Save.
//
// 1.3.6: each row has a lock the USER taps once the value is right. A pinned
// value is never replaced by a later frame (the name in particular used to be
// read right and then overwritten), and once anything is pinned the scanner
// stops closing itself - the user finishes with "Use these details".
//
// 2.0: the name needs THREE agreeing frames (it was the one value users kept
// correcting), or two when it matches a cardholder already in the vault.
const SCAN_VOTES = { number: 2, expiry: 2, cvv: 2, name: 3 };
const scan = { gen: 0, stream: null, on: false, busy: false, flip: false, rot: 0, miss: 0, votes: {}, locked: {}, seen: {}, pinned: {}, startedAt: 0,
               cams: [], camIdx: 0, torch: false, texts: [] };

function scanReset() {
  scan.votes = {}; scan.locked = {}; scan.seen = {}; scan.pinned = {}; scan.flip = false; scan.rot = 0; scan.miss = 0; scan.texts = [];
  // 1.3.8: a read left hanging by an earlier session (vault locked mid-read)
  // must not keep this one waiting - see scanLoop's gen check.
  scan.busy = false;
  paintScan();
}
// mode "card" (Add card) or "pp" (2.0: the Priority Pass number + expiry).
function openCardScanner(mode) {
  scan.mode = mode === "pp" ? "pp" : "card";
  scanReset();
  const pp = scan.mode === "pp";
  $("#scanner").dataset.mode = scan.mode;
  $("#scanTitle").textContent = pp ? "Scan Priority Pass" : "Scan card";
  $("#spNumberLabel").textContent = pp ? "Pass number" : "Card number";
  $("#scanErr").hidden = true;
  $("#scanner").hidden = false;
  startScanCamera();
}
function closeCardScanner() {
  stopScanCamera();
  scan.texts = [];                          // what was read off the card goes too
  const el = $("#scanner"); if (el) el.hidden = true;
}
async function startScanCamera() {
  if (scan.on) return;
  const gen = ++scan.gen;
  $("#scanTip").textContent = "Starting the camera…";
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw Object.assign(new Error("no camera API"), { name: "NotSupportedError" });
    // 1.3.7: ask Android for the camera first. On a real phone an UPDATED app
    // never showed the camera prompt through getUserMedia alone, so the
    // scanner read nothing; a fresh install did. See CameraAccessPlugin
    // (tools/harden-android.js step 8). If it is refused, getUserMedia fails
    // below and the existing "Camera access is off" message shows.
    const camAccess = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.CameraAccess;
    if (camAccess) { try { await camAccess.ensure(); } catch (e) {} }
    scan.stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } },
    });
    // 2.0: "environment" alone often hands over the ULTRA-WIDE lens on
    // phones with two or three back cameras - it cannot focus at card
    // distance, so every frame was soft (closed-test feedback). With the
    // permission granted the lenses have names; reopen on the main one (or
    // the one the user picked with the lens button last time).
    await chooseScanLens(gen);
  } catch (e) {
    scan.stream = null;
    if (gen !== scan.gen) return;
    const denied = e && (e.name === "NotAllowedError" || e.name === "SecurityError");
    const err = $("#scanErr");
    err.textContent = denied
      ? "Camera access is off for Card Vault. Turn it on in your phone's Settings > Apps > Card Vault > Permissions, or type the card in."
      : "The camera could not be started" + (e && e.name === "NotFoundError" ? " - this phone reports no camera." : ".") + " You can type the card in instead.";
    err.hidden = false;
    $("#scanTip").textContent = "";
    return;
  }
  if (gen !== scan.gen) { scan.stream.getTracks().forEach((t) => t.stop()); scan.stream = null; return; }
  const v = $("#scanVideo");
  v.srcObject = scan.stream;
  try { await v.play(); } catch (e) {}
  if (gen !== scan.gen) return;
  scan.on = true; scan.startedAt = Date.now();
  $("#scanTip").textContent = scan.mode === "pp" ? "Hold the Priority Pass inside the frame" : "Hold the front of the card inside the frame";
  tuneScanTrack();
  await window.YCJ.cardscan.probeReader();
  if (gen !== scan.gen) return;
  if (!window.YCJ.cardscan.nativeReader()) window.YCJ.cardscan.preload().catch(() => {});
  scanLoop();
}

// ---- Lens choice (2.0) -------------------------------------------------------
const LENS_KEY = "cv-scan-lens";
/** Lower is better for reading a card held 10-15 cm away. iPhone: the
 *  virtual multi-lens cameras switch to macro by themselves on Pro models,
 *  then the plain wide lens; never ultra-wide or telephoto alone. Android:
 *  the main back camera is the lowest-numbered "facing back" one. */
function lensRank(label) {
  const l = String(label || "").toLowerCase();
  if (/front|user|facing front/.test(l)) return 99;
  if (/triple camera/.test(l)) return 0;
  if (/dual wide camera/.test(l)) return 1;
  if (/dual camera/.test(l)) return 2;
  if (/^back camera$|^rear camera$/.test(l)) return 3;
  if (/ultra|wide angle|telephoto|tele|macro|depth|infrared/.test(l)) return 60;
  const m = /camera2? (\d+)/.exec(l);
  if (m) return 10 + parseInt(m[1], 10);
  if (/back|rear|environment/.test(l)) return 30;
  return 50;
}
async function chooseScanLens(gen) {
  let cams = [];
  try {
    cams = (await navigator.mediaDevices.enumerateDevices())
      .filter((d) => d.kind === "videoinput" && lensRank(d.label) < 99)
      .sort((a, b) => lensRank(a.label) - lensRank(b.label));
  } catch (e) { cams = []; }
  scan.cams = cams;
  if (!cams.length || gen !== scan.gen) return;
  let saved = "";
  try { saved = localStorage.getItem(LENS_KEY) || ""; } catch (e) {}
  const idx = Math.max(0, cams.findIndex((d) => d.deviceId === saved));
  scan.camIdx = idx;
  await openScanLens(cams[idx].deviceId, gen);
}
/** Swap the running stream for the lens with this id (no-op if it is the one). */
async function openScanLens(deviceId, gen) {
  const cur = scan.stream && scan.stream.getVideoTracks()[0];
  const curId = cur && cur.getSettings ? cur.getSettings().deviceId : "";
  if (!deviceId || curId === deviceId) return;
  let next;
  try {
    next = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { deviceId: { exact: deviceId }, width: { ideal: 1920 }, height: { ideal: 1080 } },
    });
  } catch (e) { return; }                                  // keep the one that works
  if (gen !== scan.gen) { next.getTracks().forEach((t) => t.stop()); return; }
  if (scan.stream) scan.stream.getTracks().forEach((t) => t.stop());
  scan.stream = next;
}
/** Continuous autofocus where the phone offers it, and the torch button only
 *  where there is a torch to turn on. */
function tuneScanTrack() {
  const t = scan.stream && scan.stream.getVideoTracks()[0];
  const caps = t && t.getCapabilities ? t.getCapabilities() : {};
  if (t && caps.focusMode && caps.focusMode.indexOf("continuous") >= 0) {
    t.applyConstraints({ advanced: [{ focusMode: "continuous" }] }).catch(() => {});
  }
  scan.torch = false;
  const tb = $("#scanTorch");
  if (tb) { tb.hidden = !(caps && caps.torch); tb.setAttribute("aria-pressed", "false"); }
  const lb = $("#scanLens");
  if (lb) lb.hidden = scan.cams.length < 2;
}
async function toggleScanTorch() {
  const t = scan.stream && scan.stream.getVideoTracks()[0];
  if (!t) return;
  scan.torch = !scan.torch;
  try { await t.applyConstraints({ advanced: [{ torch: scan.torch }] }); }
  catch (e) { scan.torch = false; }
  $("#scanTorch").setAttribute("aria-pressed", String(scan.torch));
}
/** The lens button: next back camera, remembered on this phone. */
async function nextScanLens() {
  if (scan.cams.length < 2 || !scan.on) return;
  const gen = scan.gen;
  scan.camIdx = (scan.camIdx + 1) % scan.cams.length;
  const id = scan.cams[scan.camIdx].deviceId;
  try { localStorage.setItem(LENS_KEY, id); } catch (e) {}
  await openScanLens(id, gen);
  if (gen !== scan.gen) return;
  const v = $("#scanVideo");
  v.srcObject = scan.stream;
  try { await v.play(); } catch (e) {}
  tuneScanTrack();
}
function knownHolders() {
  return Array.from(new Set(state.cards.map((c) => c.holder).filter(Boolean)));
}

function stopScanCamera() {
  scan.on = false; scan.gen++;
  if (scan.stream) { scan.stream.getTracks().forEach((t) => t.stop()); scan.stream = null; }
  const v = $("#scanVideo"); if (v) v.srcObject = null;
}
async function scanLoop() {
  if (!scan.on) return;
  // 1.3.8: every await below re-checks that this is still the same scanner
  // session. A loop from a closed session used to carry on into the next one
  // (two loops, or one stuck behind a read that never returned).
  const gen = scan.gen;
  const live = () => scan.on && gen === scan.gen;
  const v = $("#scanVideo");
  if (!scan.busy && v.readyState >= 2 && window.YCJ.cardscan.nativeReader()) {
    // 2.0: the phone's own reader. One colour frame per pass; no inverting
    // or strip crops (those were for Tesseract). A card held sideways is
    // tried turned both ways after two frames that gave nothing.
    scan.busy = true;
    try {
      const cs = window.YCJ.cardscan;
      const frame = cs.grabColor(v, $("#scanView"), scan.rot);
      if (frame) {
        const res = await cs.readNative(frame);
        frame.width = frame.height = 0;            // drop the picture now
        if (!live()) return;
        keepScanText(res.text);
        const r = cs.extract(res.text, scan.locked.number || "", { boxes: res.lines, knownNames: knownHolders() });
        if (scan.mode === "pp") r = passFromScan(res.text);
        if (scanVote(r)) scan.miss = 0;
        else if (++scan.miss >= 2) { scan.miss = 0; scan.rot = scan.rot === 0 ? 90 : scan.rot === 90 ? 270 : 0; }
        paintScan();
        // 2.0 (feedback): never closes by itself. Reading goes on (the name
        // can still improve) until the user taps Use these details.
      }
    } catch (e) {
      // One bad frame must not end the scan.
    } finally { if (gen === scan.gen) scan.busy = false; }
  } else if (!scan.busy && v.readyState >= 2) {
    scan.busy = true;
    try {
      // 1.3.8, faster back side: with the front done, the CVV is on the
      // signature strip, so that small crop is read FIRST and the full frame
      // only if it has nothing.
      let early = null;
      if (scan.mode !== "pp" && scan.locked.number && scan.locked.expiry && !scan.locked.cvv && !scan.pinned.cvv) {
        const strip = window.YCJ.cardscan.grabStrip(v, $("#scanView"));
        if (strip) {
          const t0 = await window.YCJ.cardscan.readCanvas(strip);
          strip.width = strip.height = 0;
          if (!live()) return;
          const r0 = window.YCJ.cardscan.extract(t0, scan.locked.number);
          if (r0.cvv) early = { number: "", expiry: "", name: "", cvv: r0.cvv, cvvHow: r0.cvvHow };
        }
      }
      const frame = early ? null : window.YCJ.cardscan.grab(v, $("#scanView"), scan.flip);
      if (early) {
        scanVote(early);
        paintScan();
        // 2.0 (feedback): never closes by itself. Reading goes on (the name
        // can still improve) until the user taps Use these details.
      } else if (frame) {
        const text = await window.YCJ.cardscan.readCanvas(frame);
        frame.width = frame.height = 0;            // drop the picture now
        if (!live()) return;
        keepScanText(text);
        let r = window.YCJ.cardscan.extract(text, scan.locked.number || "", { knownNames: knownHolders() });
        // The back of a dark card: the face is read inverted, which turns the
        // dark-on-light signature strip (where the CVV is) into nothing. So a
        // frame with neither a number nor a CVV is read once more the other
        // way round before moving on.
        // Back of the card: read the signature strip on its own as well.
        if (!r.cvv && scan.locked.number && scan.on) {
          const strip = window.YCJ.cardscan.grabStrip(v, $("#scanView"));
          if (strip) {
            const t3 = await window.YCJ.cardscan.readCanvas(strip);
            strip.width = strip.height = 0;
            if (!live()) return;
            const r3 = window.YCJ.cardscan.extract(t3, scan.locked.number);
            if (r3.cvv) { r.cvv = r3.cvv; r.cvvHow = r3.cvvHow; }
          }
        }
        if (!r.number && !r.cvv && scan.on) {
          const alt = window.YCJ.cardscan.grab(v, $("#scanView"), !scan.flip);
          if (alt) {
            const t2 = await window.YCJ.cardscan.readCanvas(alt);
            alt.width = alt.height = 0;
            if (!live()) return;
            const r2 = window.YCJ.cardscan.extract(t2, scan.locked.number || "");
            if (r2.number || r2.cvv) r = r2;
          }
        }
        if (scan.mode === "pp") r = passFromScan(text);
        if (!scanVote(r)) scan.flip = !scan.flip;
        paintScan();
        // 2.0 (feedback): never closes by itself. Reading goes on (the name
        // can still improve) until the user taps Use these details.
      }
    } catch (e) {
      // One bad frame must not end the scan.
    } finally { if (gen === scan.gen) scan.busy = false; }
  }
  if (gen === scan.gen) setTimeout(scanLoop, 220);
}
/** 1.3.8 cross-check: the CVV length the card's network prints - Amex 4,
 *  everyone else 3. Unknown number: either. */
function cvvFits(cvv, number) {
  if (!cvv) return false;
  if (!number) return cvv.length === 3 || cvv.length === 4;
  return cvv.length === (/^3[47]/.test(number) ? 4 : 3);
}
function scanVote(r) {
  let any = false;
  ["number", "expiry", "cvv", "name"].forEach((k) => {
    const v = r[k];
    if (!v || scan.pinned[k]) return;
    // A CVV that cannot belong to the number already read is not counted.
    if (k === "cvv" && !cvvFits(v, scan.pinned.number || scan.locked.number || "")) return;
    // A CVV guessed from a lone 3-digit group needs one more agreeing frame;
    // a name that matches a cardholder already in the vault, one fewer.
    const need = SCAN_VOTES[k] + (k === "cvv" && r.cvvHow === "guess" ? 1 : 0) - (k === "name" && r.nameKnown ? 1 : 0);
    any = true; scan.seen[k] = v;
    const t = (scan.votes[k] = scan.votes[k] || {});
    t[v] = (t[v] || 0) + 1;
    const cur = scan.locked[k];
    if (t[v] >= need && cur !== v && (!cur || t[v] > (t[cur] || 0))) scan.locked[k] = v;
  });
  return any;
}
function paintScan() {
  const fmt = { number: (v) => v.replace(/(.{4})/g, "$1 ").trim(), expiry: (v) => v, cvv: (v) => v, name: (v) => v };
  const ids = { number: "#spNumber", expiry: "#spExpiry", cvv: "#spCvv", name: "#spName" };
  Object.keys(ids).forEach((k) => {
    const v = scan.pinned[k] || scan.locked[k] || scan.seen[k];
    const el = $(ids[k]);
    el.textContent = v ? fmt[k](v) : "—";
    el.parentElement.className = "sp-row" + (scan.pinned[k] ? " is-pinned" : scan.locked[k] ? " is-locked" : scan.seen[k] ? " is-reading" : "");
    const pin = el.parentElement.querySelector(".sp-pin");
    if (pin) { pin.disabled = !v; pin.setAttribute("aria-pressed", String(!!scan.pinned[k])); }
  });
  $("#scanUse").disabled = !(Object.keys(scan.pinned).length || scan.locked.number || scan.seen.number || scan.locked.expiry || scan.locked.cvv || scan.locked.name);
  if (!scan.on) return;
  const tip = $("#scanTip");
  const got = (k) => scan.pinned[k] || scan.locked[k];
  if (scan.mode === "pp")
    tip.textContent = got("number") ? "Got the pass number. Check it, then tap Use these details" : "Hold the Priority Pass inside the frame";
  else if (got("number") && got("expiry") && got("cvv"))
    tip.textContent = got("name") ? "All read. Check them, then tap Use these details" : "Show the name side, or tap Use these details";
  else if (scan.locked.number && scan.locked.expiry && !scan.locked.cvv) tip.textContent = "Got the front. Now turn the card over for the CVV";
  else if (scan.locked.number && !scan.locked.expiry) tip.textContent = "Got the number. Hold still for the expiry";
  else if (!scan.locked.number && (Date.now() - scan.startedAt) > 12000)
    tip.textContent = "Move closer, keep it flat";
}
/** Fill the Add card form with what was read. Only fields that were found
 *  are touched. A value the user locked always wins. (1.3.6: no highlight -
 *  the values are simply placed in the form.) */
/** The last few frames' text, in memory only, for the variant words. Dropped
 *  when the scanner closes. */
function keepScanText(t) {
  if (!t) return;
  scan.texts.push(String(t).toUpperCase());
  if (scan.texts.length > 12) scan.texts.shift();
}
/** Network from the number's leading digits (the IIN ranges). */
function networkFromNumber(n) {
  const d = String(n || "").replace(/\D/g, "");
  if (d.length < 12) return "";
  const p2 = +d.slice(0, 2), p3 = +d.slice(0, 3), p4 = +d.slice(0, 4);
  if (p2 === 34 || p2 === 37) return "Amex";
  if (p2 === 36 || p2 === 38 || (p3 >= 300 && p3 <= 305)) return "Diners Club";
  if (d[0] === "4") return "Visa";
  if ((p2 >= 51 && p2 <= 55) || (p4 >= 2221 && p4 <= 2720)) return "Mastercard";
  if (p2 === 60 || p2 === 65 || p2 === 81 || p2 === 82 || p3 === 508 || p3 === 353 || p3 === 356) return "RuPay";
  return "";
}
/** A variant of this network printed on the card. Longest name first, so
 *  "World Elite" beats "World" and "Infinite Privilege" beats "Infinite". */
function variantFromText(net, text) {
  const vars = (NETWORK_VARIANTS[net] || []).filter((v) => v !== "Other").sort((a, b) => b.length - a.length);
  for (const v of vars) {
    if (new RegExp("\\b" + v.toUpperCase().replace(/\s+/g, "\\s*") + "\\b").test(text)) return v;
  }
  return "";
}
/** 2.0, Priority Pass: the membership number is a country code and a long
 *  digit run ("IN 123 456 789 0123"), or the digits alone; plus the expiry. */
function passFromScan(text) {
  const t = String(text || "").toUpperCase();
  let number = "";
  for (const line of t.split(/\r?\n/)) {
    const m = line.match(/\b([A-Z]{2,3})\s*((?:\d[\s-]?){9,17}\d)\b/);
    if (m && !/^(VAL|EXP|THR)/.test(m[1])) { number = m[1] + " " + m[2].replace(/[\s-]/g, ""); break; }
    const d = line.match(/\b((?:\d[\s-]?){11,17}\d)\b/);
    if (d && !number) number = d[1].replace(/[\s-]/g, "");
  }
  const e = window.YCJ.cardscan.extract(t, "");
  return { number, expiry: e.expiry, cvv: "", name: "" };
}
function finishPassScan() {
  const pick = (k) => scan.pinned[k] || scan.locked[k] || scan.seen[k] || "";
  if (pick("number")) $("#ppNumber").value = pick("number");
  const ex = /^(\d{2})\/(\d{2})$/.exec(pick("expiry"));
  if (ex) $("#ppExpiry").value = "20" + ex[2] + "-" + ex[1];
  closeCardScanner();
}
function finishScan() {
  if (scan.mode === "pp") return finishPassScan();
  const pick = (k) => scan.pinned[k] || scan.locked[k] || scan.seen[k] || "";
  const put = (sel, v) => { if (!v) return; $(sel).value = v; };
  // 1.3.8 reconcile before filling: a CVV read before the number, that does
  // not fit the number's network, is left out (a value the user pinned is
  // their call and always goes in).
  if (!scan.pinned.cvv && pick("cvv") && !cvvFits(pick("cvv"), pick("number"))) {
    delete scan.locked.cvv; delete scan.seen.cvv;
  }
  put("#fNumber", pick("number").replace(/(.{4})/g, "$1 ").trim());
  put("#fExpiry", pick("expiry"));
  put("#fCvv", pick("cvv"));
  put("#fHolder", pick("name"));
  syncHolderClear();
  // 2.0: network from the number's first digits, variant from words printed
  // on the card ("SIGNATURE", "WORLD ELITE"...). Only empty choices are filled.
  const net = networkFromNumber(pick("number"));
  if (net && !$("#fNetwork").value) { $("#fNetwork").value = net; fillVariantOptions(""); }
  const curNet = $("#fNetwork").value;
  if (curNet && !$("#fVariant").value) {
    const v = variantFromText(curNet, scan.texts.join("\n"));
    if (v) fillVariantOptions(v);
  }
  const got = ["number", "expiry", "cvv", "name"].filter((k) => pick(k)).length;
  closeCardScanner();
  if (got) toast(got === 4 ? "Card details filled in" : got + " of 4 details filled in");
}
function wireCardScanner() {
  if (!$("#scanner")) return;
  $("#scanCardBtn").onclick = () => openCardScanner("card");
  $("#ppScanBtn").onclick = () => openCardScanner("pp");
  $("#scanClose").onclick = closeCardScanner;
  $("#scanManual").onclick = closeCardScanner;
  $("#scanUse").onclick = finishScan;
  $("#scanLens").onclick = nextScanLens;
  $("#scanTorch").onclick = toggleScanTorch;
  // The per-row lock: pin the value on screen, or tap again to let the
  // camera keep reading that row.
  document.querySelectorAll("#scanner .sp-pin").forEach((b) => {
    b.onclick = () => {
      const k = b.dataset.pin;
      if (scan.pinned[k]) delete scan.pinned[k];
      else { const v = scan.locked[k] || scan.seen[k]; if (v) scan.pinned[k] = v; }
      paintScan();
    };
  });
  // The camera never runs out of sight: leaving the app or closing the Add
  // card sheet stops it.
  document.addEventListener("visibilitychange", () => { if (document.hidden && scan.on) closeCardScanner(); });
  new MutationObserver(() => {
    if ($("#sheet").hidden && !$("#scanner").hidden) closeCardScanner();
    if ($("#sheet").hidden && (tap.on || tap.armed)) cancelTap();
  }).observe($("#sheet"), { attributes: true, attributeFilter: ["hidden"] });
  wireTapCard();
}

// ---- Tap card: read the chip over NFC (2.0) ---------------------------------
// The CardReader plugin opens the card and passes commands through (Android
// reader mode / iPhone Core NFC); emv.js does the talking. What comes back is
// the number and expiry - the CVV is never on the chip - plus the network, and
// the name only when the card carries a real one (most say "CARDHOLDER").
// On iPhone the system draws its own "Ready to Scan" sheet, so ours is not
// shown there.
// tap.armed: Android is still in reader mode after a read, holding the card
// so the system does not pop "No supported app for this NFC tag"; released
// when the Add card sheet closes, the vault locks or the app goes away.
const tap = { on: false, gen: 0, armed: false };
// The plugin as cardscan.js reaches it (Capacitor.Plugins, or a direct call
// by name when the page never got that entry) - only once it has answered.
const cardReader = () => (window.YCJ.cardscan.reader.ok ? window.YCJ.cardscan.readerPlugin() : null);
const onIos = () => !!(window.Capacitor && window.Capacitor.getPlatform && window.Capacitor.getPlatform() === "ios");

/** Settings foot: "Card Vault 2.0.0 (20004) · Scanner: phone reader · NFC: ready".
 *  Says plainly when the phone's reader or NFC was not reached, and why. */
async function paintAppInfo() {
  const el = $("#appInfo");
  if (!el) return;
  let ver = "";
  try {
    const App = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App;
    if (App && App.getInfo) { const i = await App.getInfo(); ver = " " + i.version + " (" + i.build + ")"; }
  } catch (e) {}
  const r = window.YCJ.cardscan.reader;
  const scanner = r.ok ? "phone reader" + (r.via === "direct" ? " (direct)" : "") : "basic" + (r.why ? " - " + r.why : "");
  const nfc = !r.ok ? "unavailable" : !(r.nfc && r.nfc.supported) ? "not on this phone" : r.nfc.enabled ? "ready" : "turned off";
  // iPhone has no NFC at all (Apple does not give apps bank cards), so the
  // line does not mention it there.
  const noNfc = r.nfc && r.nfc.platform === "ios";
  el.textContent = "Card Vault" + ver + " · Scanner: " + scanner + (noNfc ? "" : " · NFC: " + nfc);
}
async function wireTapCard() {
  const btn = $("#tapCardBtn");
  const r = await window.YCJ.cardscan.probeReader();
  paintAppInfo();
  const p = cardReader();
  if (!p || !btn) return;
  btn.hidden = !(r.nfc && r.nfc.supported);
  btn.onclick = readCardByTap;
  $("#nfcCancel").onclick = () => {
    if ($("#nfcCancel").dataset.act === "settings") { p.nfcSettings().catch(() => {}); return cancelTap(); }
    closeTapSheet();
  };
}
/** Close our sheet but keep holding the card (see tap.armed). */
function closeTapSheet() {
  tap.gen++;
  const p = cardReader();
  if (tap.on && p) { p.nfcStop({ keep: true }).catch(() => {}); tap.armed = true; }
  tap.on = false;
  $("#nfcWait").hidden = true;
  const cb = $("#nfcCancel"); cb.textContent = "Cancel"; delete cb.dataset.act;
}
function nfcSheet(stateName, title, sub, isErr) {
  const w = $("#nfcWait");
  w.hidden = false;
  w.querySelector(".nfc-card").dataset.state = stateName;
  if (title) $("#nfcTitle").textContent = title;
  if (sub) { $("#nfcSub").textContent = sub; $("#nfcSub").classList.toggle("is-err", !!isErr); }
}
function cancelTap() {
  tap.gen++;
  const was = tap.on || tap.armed;
  tap.on = false; tap.armed = false;
  $("#nfcWait").hidden = true;
  const cb = $("#nfcCancel"); cb.textContent = "Cancel"; delete cb.dataset.act;
  const p = cardReader();
  if (was && p) p.nfcStop({}).catch(() => {});
}
async function readCardByTap() {
  const p = cardReader();
  if (!p || tap.on) return;
  const ios = onIos();
  let st = {};
  try { st = await p.nfcStatus(); } catch (e) {}
  if (!st.enabled && !ios) {
    nfcSheet("off", "NFC is turned off", "Turn on NFC in your phone's settings, then tap Card Vault's “Tap card on phone” again.", true);
    const cb = $("#nfcCancel"); cb.textContent = "Open NFC settings"; cb.dataset.act = "settings";
    return;
  }
  const gen = ++tap.gen;
  tap.on = true;
  if (ios) window.YCJ.mobile.holdLock(90000);     // the system sheet is not the user leaving
  else nfcSheet("waiting", "Hold your card to the back of the phone",
    "Keep it still for a second, near the camera. Nothing is charged - only the number and expiry are read.");
  try {
    await p.nfcStart({ message: "Hold your card near the top of your iPhone." });
    if (gen !== tap.gen) return;
    if (!ios) nfcSheet("reading", "Reading the card…", "Keep holding it still.");
    const r = await window.YCJ.emv.read(async (h) => (await p.nfcSend({ apdu: h })).response);
    if (gen !== tap.gen) return;
    fillFromChip(r);
    await p.nfcStop({ message: "Card read", keep: true }).catch(() => {});
    tap.on = false; tap.armed = !ios;
    if (!ios) {
      nfcSheet("done", "Got it", "Number and expiry filled in. Add the CVV from the back of the card.");
      setTimeout(() => { if (gen === tap.gen) $("#nfcWait").hidden = true; }, 1100);
    }
  } catch (e) {
    if (gen !== tap.gen) return;
    tap.on = false;
    const cancelled = /cancel/i.test(String((e && (e.code || e.message)) || ""));
    await p.nfcStop({ error: cancelled ? "" : "Could not read this card. Try again.", keep: true }).catch(() => {});
    tap.armed = !ios;
    if (ios || cancelled) { $("#nfcWait").hidden = true; return; }
    nfcSheet("error", "That did not read", "Hold the card flat against the back, near the camera, and keep it there for two seconds. Cards without the contactless symbol cannot be read.", true);
    const cb = $("#nfcCancel"); cb.textContent = "Close";
  }
}
/** Put what the chip gave into the Add card form. The number and expiry are
 *  exact, so they replace what is there; the network only fills an empty
 *  choice; the name only an empty field. */
function fillFromChip(r) {
  if (r.number) {
    $("#fNumber").value = r.number.replace(/(.{4})/g, "$1 ").trim();
    $("#fNumber").dispatchEvent(new Event("input", { bubbles: true }));
  }
  if (r.expiry) $("#fExpiry").value = r.expiry;
  if (r.name && !$("#fHolder").value.trim()) $("#fHolder").value = r.name;
  syncHolderClear();
  if (r.network && !$("#fNetwork").value && NETWORKS.indexOf(r.network) >= 0) {
    $("#fNetwork").value = r.network;
    fillVariantOptions("");
  }
}


// ---- Expiring soon (1.3.5) -------------------------------------------------
// Ported from Gift Card Vault's "expiring this week" nudge, for what expiry
// means on a bank card: the replacement should be in the post. Shown for
// active cards expiring this month or next, and for cards already past their
// expiry that were never archived. Dismissing lasts until the next unlock.
let nudgeDismissed = false;
/** Months from this month to the card's expiry month: 0 = this month,
 *  negative = already expired, null = no usable expiry. */
function monthsLeft(c) {
  const m = /^(\d{1,2})\s*\/\s*(\d{2}|\d{4})$/.exec(String(c.expiry || "").trim());
  if (!m) return null;
  const mm = parseInt(m[1], 10), yy = parseInt(m[2].slice(-2), 10) + 2000;
  if (mm < 1 || mm > 12) return null;
  const now = new Date();
  return (yy * 12 + mm) - (now.getFullYear() * 12 + now.getMonth() + 1);
}
function expiringCards() {
  return state.cards.filter((c) => !c.archived && monthsLeft(c) !== null && monthsLeft(c) <= 1)
    .sort((a, b) => monthsLeft(a) - monthsLeft(b));
}
function renderNudge() {
  const el = $("#nudge");
  if (!el) return;
  const soon = expiringCards();
  if (!soon.length || nudgeDismissed || state.showArchived || state.tab !== "cards") { el.hidden = true; return; }
  const gone = soon.filter((c) => monthsLeft(c) < 0).length;
  const due = soon.length - gone;
  const parts = [];
  if (due) parts.push(due + (due === 1 ? " card expires" : " cards expire") + " by " + expiryLabel(1));
  if (gone) parts.push(gone + (gone === 1 ? " has" : " have") + " expired");
  $("#nudgeText").textContent = parts.join(" \u00B7 ");
  el.hidden = false;
}
function expiryLabel(ahead) {
  const d = new Date(); d.setMonth(d.getMonth() + ahead);
  return MONTHS[d.getMonth()] + " " + d.getFullYear();
}
function wireNudge() {
  if (!$("#nudge")) return;
  $("#nudgeX").onclick = () => { nudgeDismissed = true; $("#nudge").hidden = true; };
  $("#nudgeOpen").onclick = () => {
    const rows = expiringCards().map((c) => {
      const left = monthsLeft(c);
      const when = left < 0 ? "Expired " + c.expiry : left === 0 ? "Expires this month" : "Expires next month";
      return `<button type="button" class="exp-row ${left < 0 ? "is-gone" : ""}" data-id="${esc(c.id)}" style="${bankStyle(c.bank)}">
        <span class="glyph has-mark">${bankMarkSvg(c.bank, 18)}</span>
        <span class="exp-text"><b>${esc(displayName(c))}</b><small>${esc(c.bank)} \u00B7 ${esc(cardRelation(c))}</small></span>
        <span class="exp-when">${esc(when)}</span></button>`;
    }).join("");
    openModal(`<h2>Expiring cards</h2>
      <p>When the new card arrives, open it here and update the expiry (and the number and CVV if they changed), or archive the old one.</p>
      <div class="exp-list">${rows}</div>
      <div class="modal-foot"><button class="btn btn-filled" id="expDone">Done</button></div>`);
    $("#expDone").onclick = closeModal;
    document.querySelectorAll(".exp-row").forEach((b) => b.onclick = () => {
      const c = state.cards.find((x) => x.id === b.dataset.id);
      closeModal(); if (c) openSheet(c);
    });
  };
}

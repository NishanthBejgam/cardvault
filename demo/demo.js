/* Card Vault - live demo, after app.js: create, fill, open. */
(function () {
  "use strict";
  var PW = "demo1234", ROWS = [{"bank": "HDFC", "card_name": "Infinia", "relation": "Self", "holder": "NISHANTH B", "number": "4365601234987655", "expiry": "08/29", "network": "Visa", "variant": "Infinite", "kind": "credit", "cvv": "123", "nickname": "Everyday card"}, {"bank": "HDFC", "card_name": "Infinia", "relation": "Spouse", "holder": "PRIYA B", "number": "4365601234987721", "expiry": "08/29", "network": "Visa", "variant": "Infinite", "kind": "credit", "cvv": "123", "addon": true}, {"bank": "HDFC", "card_name": "Infinia", "relation": "Father", "holder": "RAMESH B", "number": "4365601234987804", "expiry": "08/29", "network": "Visa", "variant": "Infinite", "kind": "credit", "cvv": "123", "addon": true}, {"bank": "HDFC", "card_name": "Infinia", "relation": "Mother", "holder": "LATHA B", "number": "4365601234987986", "expiry": "08/29", "network": "Visa", "variant": "Infinite", "kind": "credit", "cvv": "123", "addon": true}, {"bank": "HDFC", "card_name": "Infinia", "relation": "Son", "holder": "ARJUN B", "number": "4365601234988067", "expiry": "08/29", "network": "Visa", "variant": "Infinite", "kind": "credit", "cvv": "123", "addon": true}, {"bank": "HDFC", "card_name": "Millennia Debit", "relation": "Self", "holder": "NISHANTH B", "number": "5241930044172639", "expiry": "03/28", "network": "Mastercard", "variant": "World", "kind": "debit", "cvv": "123"}, {"bank": "Axis", "card_name": "Magnus", "relation": "Self", "holder": "NISHANTH B", "number": "5598610022334414", "expiry": "11/30", "network": "Mastercard", "variant": "World Elite", "kind": "credit", "cvv": "123"}, {"bank": "Axis", "card_name": "Atlas", "relation": "Spouse", "holder": "PRIYA B", "number": "4182360077445120", "expiry": "01/29", "network": "Visa", "variant": "Infinite", "kind": "credit", "cvv": "123", "nickname": "Travel card"}, {"bank": "ICICI", "card_name": "Amazon Pay", "relation": "Self", "holder": "NISHANTH B", "number": "4627860011987346", "expiry": "06/28", "network": "Visa", "variant": "Signature", "kind": "credit", "cvv": "123"}, {"bank": "ICICI", "card_name": "Sapphiro Debit", "relation": "Spouse", "holder": "PRIYA B", "number": "5234780099112264", "expiry": "10/28", "network": "Mastercard", "variant": "World", "kind": "debit", "cvv": "123"}, {"bank": "Amex", "card_name": "Platinum Travel", "relation": "Self", "holder": "NISHANTH B", "number": "374281007766557", "expiry": "04/31", "network": "Amex", "variant": "", "kind": "credit", "cvv": "4321"}, {"bank": "IDFC", "card_name": "First Wealth", "relation": "Spouse", "holder": "PRIYA B", "number": "4216530088221195", "expiry": "12/29", "network": "Visa", "variant": "Signature", "kind": "credit", "cvv": "123"}, {"bank": "AU", "card_name": "Zenith+", "relation": "Self", "holder": "NISHANTH B", "number": "4617950066553382", "expiry": "07/30", "network": "Visa", "variant": "Infinite", "kind": "credit", "cvv": "123"}, {"bank": "IndusInd", "card_name": "Pinnacle", "relation": "Father", "holder": "RAMESH B", "number": "5522600044330178", "expiry": "05/29", "network": "Mastercard", "variant": "World Elite", "kind": "credit", "cvv": "123"}, {"bank": "Yes", "card_name": "Marquee", "relation": "Self", "holder": "NISHANTH B", "number": "5305620077112940", "expiry": "09/30", "network": "Mastercard", "variant": "World Elite", "kind": "credit", "cvv": "123"}, {"bank": "HSBC", "card_name": "Live+", "relation": "Spouse", "holder": "PRIYA B", "number": "4321100055667812", "expiry": "02/30", "network": "Visa", "variant": "Signature", "kind": "credit", "cvv": "123"}, {"bank": "StanChart", "card_name": "Ultimate", "relation": "Self", "holder": "NISHANTH B", "number": "5544170022993847", "expiry": "06/29", "network": "Mastercard", "variant": "World", "kind": "credit", "cvv": "123"}, {"bank": "RBL", "card_name": "World Safari", "relation": "Son", "holder": "ARJUN B", "number": "5248110033774652", "expiry": "03/29", "network": "Mastercard", "variant": "World", "kind": "credit", "cvv": "123"}, {"bank": "Federal", "card_name": "Scapia", "relation": "Self", "holder": "NISHANTH B", "number": "4147520099331723", "expiry": "12/30", "network": "Visa", "variant": "Signature", "kind": "credit", "cvv": "123", "virtual": true, "dual": true}, {"bank": "BoB", "card_name": "Eterna", "relation": "Mother", "holder": "LATHA B", "number": "6521700044559039", "expiry": "08/28", "network": "RuPay", "variant": "Select", "kind": "credit", "cvv": "123"}, {"bank": "ICICI", "card_name": "Emeralde Private", "relation": "Self", "holder": "NISHANTH B", "number": "4147670066118205", "expiry": "08/29", "network": "Visa", "variant": "Infinite", "kind": "credit", "cvv": "123"}, {"bank": "SBI", "card_name": "Cashback", "relation": "Self", "holder": "NISHANTH B", "number": "4718609108204366", "expiry": "10/30", "network": "Visa", "variant": "Signature", "kind": "credit", "cvv": "472"}, {"bank": "Kotak", "card_name": "League", "relation": "Self", "holder": "NISHANTH B", "number": "5239810044226672", "expiry": "02/25", "network": "Mastercard", "variant": "Platinum", "kind": "debit", "cvv": "123", "archived": true, "notes": "Old salary account"}], PASSES = {"Platinum Travel": [{"id": "pp-1", "number": "IN 4471 8820 1946", "issued": "2025-04", "expiry": "2028-03", "status": "active", "notes": "8 free visits a year"}], "Atlas": [{"id": "pp-2", "number": "IN 5520 7741 0833", "expiry": "2027-11", "status": "active", "notes": "Spouse"}], "Infinia": [{"id": "pp-3", "number": "IN 9012 4471 8826", "expiry": "2029-08", "status": "active", "notes": "Unlimited"}]};
  var SEED = async ([rows, passes]) => {
  await window.YCJ.api.send('/api/cards/bulk', 'POST', { cards: rows.map(({ addon, archived, virtual, dual, ...r }) => r) });
  await openApp();
  for (const r of rows) {
    const c = state.cards.find(c => c.number.replace(/\s/g, '') === r.number);
    if (!c) continue;
    const put = {};
    ['addon', 'archived', 'virtual', 'dual'].forEach(k => { if (r[k]) put[k] = true; });
    if (passes[r.card_name] && !r.addon) put.passes = passes[r.card_name];
    if (Object.keys(put).length) await window.YCJ.api.send('/api/cards/' + c.id, 'PUT', put);
  }
  await openApp();
  window.setRel = (name) => { state.selectedRelation = name; state.selectedBank = 'All'; refreshActiveView(); };
  return state.cards.length;
};
  var $ = function (s) { return document.querySelector(s); };
  var veil = $("#demo-veil");
  var done = function () { if (veil) veil.remove(); };

  // Delete is off in the demo: refuse the route even if a button shows up.
  var A = window.YCJ.api, real = A.send.bind(A);
  A.send = function (path, method, body) {
    if (method === "DELETE" && /^\/api\/cards\//.test(path)) return Promise.resolve({ ok: false, status: 403, data: {} });
    return real(path, method, body);
  };

  function waitFor(test, ms) {
    return new Promise(function (ok, no) {
      var t0 = Date.now();
      (function tick() { if (test()) ok(); else if (Date.now() - t0 > ms) no(new Error("timed out")); else setTimeout(tick, 60); })();
    });
  }
  var shown = function (s) { var e = $(s); return e && !e.hidden && e.offsetParent !== null; };

  waitFor(function () { return shown("#lockPw2"); }, 15000)
    .then(function () {
      $("#lockPw").value = PW; $("#lockPw2").value = PW;
      $("#lockBtn").click();
      return waitFor(function () { return $("#app") && !$("#app").hidden; }, 60000);
    })
    .then(function () { return SEED([ROWS, PASSES]); })
    .then(function () {
      done();
      // Locked again later: the password is filled in - one tap opens it.
      var lock = $("#lockPw").closest("form") || $("#lockPw").parentNode;
      var note = document.createElement("p");
      note.className = "demo-note";
      note.textContent = "Demo vault - the password is filled in. Tap Unlock.";
      lock.appendChild(note);
      new MutationObserver(function () {
        if ($("#app").hidden && !$("#lockPw").value) $("#lockPw").value = PW;
      }).observe($("#app"), { attributes: true, attributeFilter: ["hidden"] });
    })
    .catch(function (e) {
      if (veil) veil.querySelector("small").textContent = "Could not open the demo here: " + (e && e.message || e);
    });
})();

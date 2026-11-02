/* Card Vault - live demo, before app.js: a clean start every time. */
(function () {
  try { localStorage.clear(); sessionStorage.clear(); } catch (e) {}
  try { localStorage.setItem("cv-relations", JSON.stringify(["Self", "Spouse", "Father", "Mother", "Son"])); } catch (e) {}
  var veil = document.createElement("div");
  veil.id = "demo-veil";
  veil.innerHTML = '<div class="dv-box"><span class="dv-spin"></span><b>Opening the demo vault</b><small>A sample family, made-up card numbers</small></div>';
  (document.body || document.documentElement).appendChild(veil);
})();

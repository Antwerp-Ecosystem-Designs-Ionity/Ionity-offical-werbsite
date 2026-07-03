/* ============================================================================
   IONITY — ENHANCE ENGINE  v1.0
   Premium loader + cinematic page transitions, B2B footer network bar
   (with ionity.co.za / ionity.world cross-links), encoding repair, a11y.
   Self-contained, dependency-free. Author: Antwerp Designs · Ionity (Pty) Ltd
   ========================================================================== */
(function () {
  "use strict";

  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Resolve the assets base from this script's own URL so it works whether a
     page links assets relatively or absolutely. */
  var ASSETS = (function () {
    var s = document.currentScript;
    if (s && s.src) return s.src.replace(/assets\/js\/enhance\.js.*$/i, "assets/");
    return "assets/";
  })();
  var MARK = ASSETS + "images/ionity-logo-edited.png";

  /* ------------------------------------------------------------------ *
   * 1. PREMIUM LOADER  (replaces the old "SYSTEM INITIALIZING" loader)
   * ------------------------------------------------------------------ */
  function buildLoader() {
    // Neutralise (don't remove) any legacy loader so a page's own inline
    // script can still reference #loader without throwing.
    var old = document.getElementById("loader");
    if (old) { old.style.display = "none"; old.setAttribute("aria-hidden", "true"); }
    if (document.getElementById("ion-loader")) return;

    var el = document.createElement("div");
    el.id = "ion-loader";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.setAttribute("aria-label", "Loading Ionity");
    el.innerHTML =
      '<div class="ion-grid" aria-hidden="true"></div>' +
      '<div class="ion-stage">' +
        '<div class="ion-orbit">' +
          '<span class="ion-node" aria-hidden="true"></span>' +
          '<img class="ion-mark" src="' + MARK + '" alt="" aria-hidden="true" ' +
               'onerror="this.style.display=\'none\'">' +
        '</div>' +
        '<div class="ion-word">IONITY</div>' +
        '<div class="ion-tag">Native-AI &middot; Edge &middot; Cloud</div>' +
        '<div class="ion-progress' + (REDUCED ? " ion-indeterminate" : "") + '"><i></i></div>' +
        '<div class="ion-pct">' + (REDUCED ? "LOADING" : "0%") + '</div>' +
      '</div>';
    // Insert as first body child so it covers everything immediately.
    if (document.body.firstChild) document.body.insertBefore(el, document.body.firstChild);
    else document.body.appendChild(el);
    return el;
  }

  function runProgress(el) {
    if (!el || REDUCED) return;
    var bar = el.querySelector(".ion-progress > i");
    var pct = el.querySelector(".ion-pct");
    var v = 0, done = false;
    (function tick() {
      if (done) return;
      // Ease toward 90% while the page is still loading.
      v += Math.max(0.5, (90 - v) * 0.08);
      if (v > 90) v = 90;
      if (bar) bar.style.width = v.toFixed(1) + "%";
      if (pct) pct.textContent = Math.round(v) + "%";
      setTimeout(tick, 90);
    })();
    el.__finish = function () {
      done = true;
      if (bar) bar.style.width = "100%";
      if (pct) pct.textContent = "100%";
    };
  }

  function hideLoader(el) {
    if (!el) return;
    if (el.__finish) el.__finish();
    var go = function () {
      el.classList.add("ion-hide");
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 800);
    };
    // Minimum on-screen time for elegance; then fade.
    setTimeout(go, REDUCED ? 0 : 480);
  }

  /* ------------------------------------------------------------------ *
   * 2. CINEMATIC PAGE TRANSITIONS (MPA-friendly)
   * ------------------------------------------------------------------ */
  function showTransition(href) {
    var el = document.getElementById("ion-loader") || buildLoader();
    el.classList.remove("ion-hide");
    var prog = el.querySelector(".ion-progress");
    if (prog) prog.classList.add("ion-indeterminate");
    var pct = el.querySelector(".ion-pct");
    if (pct) pct.textContent = "";
    var delay = REDUCED ? 0 : 320;
    setTimeout(function () { window.location.href = href; }, delay);
  }

  function isInternal(a) {
    if (!a || !a.getAttribute) return false;
    var href = a.getAttribute("href");
    if (!href) return false;
    if (a.target && a.target !== "_self") return false;
    if (a.hasAttribute("download")) return false;
    if (/^(#|mailto:|tel:|javascript:)/i.test(href)) return false;
    // Same-origin only.
    var url;
    try { url = new URL(a.href, window.location.href); } catch (e) { return false; }
    if (url.origin !== window.location.origin) return false;
    // Ignore links that resolve to the current document (with or without a hash).
    if (url.pathname === window.location.pathname && url.search === window.location.search) return false;
    return true;
  }

  function wireTransitions() {
    // Capture phase so we run BEFORE the legacy per-link handlers in script.js
    // (the "warp" loader + sound). For internal links we take full control.
    document.addEventListener("click", function (e) {
      if (e.button !== 0) return;
      var a = e.target.closest && e.target.closest("a");
      if (!isInternal(a)) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        // User wants a new tab/window: block the legacy hijack, let the
        // browser perform its native action (fixes ctrl/cmd-click).
        e.stopImmediatePropagation();
        return;
      }
      e.preventDefault();
      e.stopImmediatePropagation();
      showTransition(a.href);
    }, true);
    // If the user returns via the back/forward cache, ensure no stuck overlay.
    window.addEventListener("pageshow", function (ev) {
      if (ev.persisted) {
        var el = document.getElementById("ion-loader");
        if (el) el.classList.add("ion-hide");
      }
    });
  }

  /* ------------------------------------------------------------------ *
   * 3. B2B FOOTER NETWORK BAR  (+ ionity.co.za cross-traffic)
   * ------------------------------------------------------------------ */
  var SITES = [
    { host: "ionity.today", url: "https://www.ionity.today",
      sub: "Global · Native-AI Ecosystems & Edge Intelligence", primary: false },
    { host: "ionity.co.za", url: "https://www.ionity.co.za",
      sub: "Ionity South Africa · Local Solutions & Support", primary: true },
    { host: "ionity.world", url: "https://www.ionity.world",
      sub: "Global Portal · Group & Partner Network", primary: false }
  ];

  function markCurrentSite(scope) {
    var here = (window.location.hostname || "").replace(/^www\./, "");
    if (!here) return;
    var cards = scope.querySelectorAll(".ion-net__card");
    for (var i = 0; i < cards.length; i++) {
      var h = cards[i].getAttribute("href") || "";
      if (h.indexOf(here) !== -1) {
        cards[i].setAttribute("aria-current", "page");
        cards[i].removeAttribute("target");
        cards[i].removeAttribute("rel");
        var go = cards[i].querySelector(".go");
        if (go) go.textContent = "You are here";
      }
    }
  }

  function buildNetworkBar() {
    var foot = document.querySelector("footer");
    if (!foot) return;
    // If a static (crawlable) network bar already exists in the HTML, just
    // enhance it with the "you are here" state instead of building a duplicate.
    var existing = foot.querySelector(".ion-net");
    if (existing) { markCurrentSite(existing); return; }

    var here = (window.location.hostname || "").replace(/^www\./, "");
    var net = document.createElement("div");
    net.className = "ion-net";

    var cards = SITES.map(function (s) {
      var isHere = here && s.host.indexOf(here) !== -1;
      var cls = "ion-net__card" + (s.primary ? " is-primary" : "");
      var go = isHere ? "You are here" : "Visit";
      var attrs = isHere ? 'aria-current="page"' : 'target="_blank" rel="noopener"';
      return '<a class="' + cls + '" href="' + s.url + '" ' + attrs + '>' +
               '<span class="d">' + s.host + '</span>' +
               '<span class="s">' + s.sub + '</span>' +
               '<span class="go">' + go + '</span>' +
             '</a>';
    }).join("");

    net.innerHTML =
      '<div class="ion-net__label">The Ionity Network</div>' +
      '<div class="ion-net__grid">' + cards + '</div>' +
      '<div class="ion-trust" aria-label="Compliance and standards">' +
        '<span>POPIA &amp; GDPR Aligned</span>' +
        '<span>WCAG-Minded Accessibility</span>' +
        '<span>CC BY-NC-SA 4.0</span>' +
        '<span>Made with AEDI®</span>' +
        '<span>Policy AED 986</span>' +
      '</div>';

    // Place the network bar at the top of the footer.
    foot.insertBefore(net, foot.firstChild);
  }

  /* ------------------------------------------------------------------ *
   * 4. ENCODING REPAIR  (broken ® / mojibake) + a11y skip link
   * ------------------------------------------------------------------ */
  function repairEncoding() {
    // Conservative: only repair the known registered-mark cases, never blanket
    // replace the replacement char (it stands for different glyphs elsewhere).
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var n, fixed = 0;
    while ((n = walker.nextNode())) {
      if (n.nodeValue.indexOf("�") === -1) continue;
      var next = n.nodeValue.replace(/Ionity�/g, "Ionity®").replace(/AEDI�/g, "AEDI®");
      if (next !== n.nodeValue) { n.nodeValue = next; fixed++; }
    }
    return fixed;
  }

  function addSkipLink() {
    if (document.querySelector(".ion-skip-link")) return;
    // Prefer an existing landmark; otherwise promote the main content wrapper.
    var main = document.querySelector("main, [role=main]") ||
               document.querySelector(".deck-wrapper, #deckWrapper, main, section");
    if (main) {
      if (!main.id) main.id = "ion-main";
      if (main.tagName !== "MAIN" && !main.getAttribute("role")) main.setAttribute("role", "main");
    }
    var target = main ? "#" + main.id : "#";
    var a = document.createElement("a");
    a.className = "ion-skip-link";
    a.href = target;
    a.textContent = "Skip to content";
    document.body.insertBefore(a, document.body.firstChild);
  }

  /* ------------------------------------------------------------------ *
   * BOOT
   * ------------------------------------------------------------------ */
  var loaderEl = null;
  function onEarly() {
    if (!document.body) { requestAnimationFrame(onEarly); return; }
    loaderEl = buildLoader();
    runProgress(loaderEl);
  }
  onEarly();

  function onReady() {
    addSkipLink();
    buildNetworkBar();
    repairEncoding();
    wireTransitions();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }

  // Fade the loader once everything (incl. THREE.js textures/images) has loaded,
  // with a safety cap so it can never get stuck.
  var capped = false;
  function finish() { if (capped) return; capped = true; hideLoader(loaderEl || document.getElementById("ion-loader")); }
  window.addEventListener("load", function () { setTimeout(finish, 200); });
  setTimeout(finish, 4500); // hard failsafe
})();

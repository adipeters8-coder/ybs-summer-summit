/* ============================================================
   YBS – Consent-Logik (DSGVO)
   Banner erscheint, wenn noch keine Entscheidung vorliegt.
   "Akzeptieren"  -> Google Fonts (__loadFonts), Google Analytics
                     (__loadAnalytics) und Meta-Pixel (__loadPixel) laden
   "Ablehnen"     -> System-Schriftarten, kein Tracking; GA wird
                     deaktiviert, GA-/Meta-Cookies werden entfernt
   window.__openConsent() öffnet den Banner erneut (Widerruf /
   Änderung, z. B. über den Footer-Link "Cookie-Einstellungen").
   Die Entscheidung wird in localStorage gespeichert.
   ============================================================ */
(function () {
  var KEY = 'ybs-consent';
  var GA = window.__GA_ID || '';

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function store(val) { try { localStorage.setItem(KEY, val); } catch (e) {} }

  function deleteTrackingCookies() {
    try {
      var host = location.hostname;
      var domains = [host, '.' + host];
      var parts = host.split('.');
      if (parts.length > 2) domains.push('.' + parts.slice(-2).join('.'));
      document.cookie.split(';').forEach(function (c) {
        var name = c.split('=')[0].trim();
        var track = name === '_ga' || name.indexOf('_ga_') === 0 || name === '_gid' ||
                    name === '_gat' || name === '_fbp' || name === '_fbc';
        if (track) {
          document.cookie = name + '=; Max-Age=0; path=/';
          domains.forEach(function (d) {
            document.cookie = name + '=; Max-Age=0; path=/; domain=' + d;
          });
        }
      });
    } catch (e) {}
  }

  function apply(val) {
    if (val === 'accepted') {
      if (GA) window['ga-disable-' + GA] = false;
      if (typeof window.__loadFonts === 'function') window.__loadFonts();
      if (typeof window.__loadAnalytics === 'function') window.__loadAnalytics();
      if (typeof window.__loadPixel === 'function') window.__loadPixel();
    } else if (val === 'declined') {
      if (GA) window['ga-disable-' + GA] = true; // stoppt GA, falls in dieser Sitzung geladen
      deleteTrackingCookies();
    }
  }

  var bar = null;
  function build() {
    if (bar) { bar.classList.add('is-visible'); return; }
    bar = document.createElement('div');
    bar.className = 'consent';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Datenschutz-Einstellungen');
    bar.innerHTML =
      '<div class="consent__inner">' +
        '<div class="consent__text">' +
          '<div class="consent__title">Datenschutz-Einstellungen</div>' +
          '<p>Wir laden Schriftarten von Google Fonts, nutzen Google Analytics für anonyme ' +
          'Statistiken und den Meta-Pixel (Facebook/Instagram) für unsere Werbeanzeigen. Dabei werden Daten ' +
          '(u.&nbsp;a. deine IP-Adresse) an Google und Meta übertragen und Cookies gesetzt. Das passiert nur mit deiner ' +
          'Zustimmung. Ohne Zustimmung nutzen wir System-Schriftarten, kein Analytics und kein Marketing – die ' +
          'Seite funktioniert uneingeschränkt. ' +
          'Mehr dazu in der <a href="https://youngbusiness-schmallenberg.de/datenschutz/" target="_blank" rel="noopener noreferrer">Datenschutzerklärung</a>.</p>' +
        '</div>' +
        '<div class="consent__actions">' +
          '<button type="button" class="consent__btn consent__btn--decline" data-consent="declined">Ablehnen</button>' +
          '<button type="button" class="consent__btn consent__btn--accept" data-consent="accepted">Akzeptieren</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(bar);
    requestAnimationFrame(function () { bar.classList.add('is-visible'); });

    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-consent]');
      if (!btn) return;
      var val = btn.getAttribute('data-consent');
      store(val);
      apply(val);
      bar.classList.remove('is-visible');
      setTimeout(function () { if (bar) { bar.remove(); bar = null; } }, 400);
    });
  }

  // Öffentlich: Banner erneut öffnen (Widerruf / Einstellungen ändern)
  window.__openConsent = function () {
    if (document.body) build();
    else document.addEventListener('DOMContentLoaded', build);
  };

  var decision = get();
  if (decision !== 'accepted' && decision !== 'declined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
    else build();
  }
})();

/* ============================================================
   YBS – Consent-Logik (DSGVO)
   Zeigt den Banner nur, wenn noch keine Entscheidung vorliegt.
   "Akzeptieren"  -> Google Fonts (window.__loadFonts) und Google
                     Analytics (window.__loadAnalytics) laden
   "Ablehnen"     -> System-Schriftarten, kein Analytics
   Die Entscheidung wird in localStorage gespeichert (kein Cookie,
   kein Tracking – nur der Consent-Status selbst).
   ============================================================ */
(function () {
  var KEY = 'ybs-consent';
  var decision = null;
  try { decision = localStorage.getItem(KEY); } catch (e) {}

  // Fonts wurden bei "accepted" bereits vom Inline-Head-Script geladen.
  if (decision === 'accepted' || decision === 'declined') return;

  function store(val) { try { localStorage.setItem(KEY, val); } catch (e) {} }

  function build() {
    var bar = document.createElement('div');
    bar.className = 'consent';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Datenschutz-Einstellungen');
    bar.innerHTML =
      '<div class="consent__inner">' +
        '<div class="consent__text">' +
          '<div class="consent__title">Datenschutz-Einstellungen</div>' +
          '<p>Wir laden Schriftarten von Google Fonts und nutzen Google Analytics, um anonyme ' +
          'Statistiken über die Nutzung dieser Seite zu erhalten. Dabei werden Daten ' +
          '(u.&nbsp;a. deine IP-Adresse) an Google übertragen und Cookies gesetzt. Das passiert nur mit deiner ' +
          'Zustimmung. Ohne Zustimmung nutzen wir System-Schriftarten und kein Analytics – die ' +
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
      if (val === 'accepted') {
        if (typeof window.__loadFonts === 'function') window.__loadFonts();
        if (typeof window.__loadAnalytics === 'function') window.__loadAnalytics();
      }
      bar.classList.remove('is-visible');
      setTimeout(function () { bar.remove(); }, 400);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();

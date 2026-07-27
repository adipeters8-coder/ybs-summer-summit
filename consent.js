/* ============================================================
   YBS – Consent-Logik (DSGVO)
   Zeigt den Banner nur, wenn noch keine Entscheidung vorliegt.
   "Akzeptieren"  -> externe Schriftarten laden (window.__loadFonts)
   "Ablehnen"     -> System-Schriftarten, keine externe Anfrage
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
    bar.setAttribute('aria-label', 'Hinweis zu externen Schriftarten');
    bar.innerHTML =
      '<div class="consent__inner">' +
        '<div class="consent__text">' +
          '<div class="consent__title">Externe Schriftarten</div>' +
          '<p>Für die vorgesehene Darstellung laden wir Schriftarten von Google Fonts. ' +
          'Dabei wird deine IP-Adresse an Google übertragen. Ohne Zustimmung nutzen wir ' +
          'System-Schriftarten – die Seite funktioniert dann uneingeschränkt. ' +
          'Mehr dazu in der <a href="#datenschutz">Datenschutzerklärung</a>.</p>' +
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
      if (val === 'accepted' && typeof window.__loadFonts === 'function') {
        window.__loadFonts();
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

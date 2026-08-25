  (function () {
    var STORAGE_KEY = 'refDocPrefs';
    var defaults = { font: 'serif', size: 'medium', spacing: 'normal', presider: 'lay', simplify: true, cull: true, newScripture: true, newMissal: true, addCross: true };
    var root = document.documentElement;
    var drawer = document.getElementById('settingsDrawer');
    var overlay = document.getElementById('drawerOverlay');
    var toggle = document.getElementById('settingsToggle');
    var closeBtn = document.getElementById('drawerClose');
    var main = document.querySelector('main.content');
    var controls = document.querySelector('.page-controls');
    var popup = document.getElementById('firstVisitPopup');
    var scrollY = 0;

    // `saved` only ever holds keys the user has explicitly chosen (via the
    // drawer or the first-visit popup) — it's intentionally sparse, not
    // pre-filled with defaults. That's what lets the popup logic below
    // tell "presider was never chosen" apart from "presider was chosen and
    // happens to match the default", which matters so changing an
    // unrelated setting (font, size) can never silently count as having
    // answered the presider prompt.
    function loadSaved() {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch (e) { return {}; }
    }
    function resolve(saved) {
      var out = {};
      for (var k in defaults) out[k] = (k in saved) ? saved[k] : defaults[k];
      return out;
    }

    var saved = loadSaved();
    var prefs = resolve(saved);

    function applyPrefs() {
      root.setAttribute('data-font', prefs.font);
      root.setAttribute('data-size', prefs.size);
      root.setAttribute('data-spacing', prefs.spacing);
      root.setAttribute('data-presider', prefs.presider);
      root.setAttribute('data-simplify', prefs.simplify ? 'true' : 'false');
      root.setAttribute('data-cull', prefs.cull ? 'true' : 'false');
      root.setAttribute('data-newScripture', prefs.newScripture ? 'true' : 'false');
      root.setAttribute('data-newMissal', prefs.newMissal ? 'true' : 'false');
      root.setAttribute('data-addCross', prefs.addCross ? 'true' : 'false');
      document.querySelectorAll('.option-btn').forEach(function (btn) {
        var isActive = btn.getAttribute('data-value') === prefs[btn.getAttribute('data-pref')];
        btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
      });
      document.querySelectorAll('.switch[role="switch"]').forEach(function (btn) {
        btn.setAttribute('aria-checked', prefs[btn.getAttribute('data-pref')] ? 'true' : 'false');
      });
    }
    function setPref(key, value) {
      saved[key] = value;
      prefs[key] = value;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); } catch (e) {
        // localStorage unavailable (private browsing, quota, etc.) — fail silently,
        // the page still works, it just won't remember the choice next visit.
      }
      applyPrefs();
    }

    applyPrefs();

    document.querySelectorAll('.option-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setPref(btn.getAttribute('data-pref'), btn.getAttribute('data-value'));
      });
    });

    // Switches toggle their current value, unlike option-btns above (each
    // of which jumps straight to one fixed value), so they get their own
    // small handler — but still go through the same setPref/applyPrefs.
    document.querySelectorAll('.switch[role="switch"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var pref = btn.getAttribute('data-pref');
        setPref(pref, !prefs[pref]);
      });
    });

    // Arrow-key navigation within each radio group (mirrors native radio behavior)
    document.querySelectorAll('[role="radiogroup"]').forEach(function (group) {
      var radios = Array.prototype.slice.call(group.querySelectorAll('[role="radio"]'));
      group.addEventListener('keydown', function (e) {
        var idx = radios.indexOf(document.activeElement);
        if (idx === -1) return;
        var next;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % radios.length;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (idx - 1 + radios.length) % radios.length;
        else return;
        e.preventDefault();
        radios[next].focus();
        radios[next].click();
      });
    });

    // Shared by the drawer and the first-visit popup: lock the page so the
    // background can't scroll behind whichever one is open, and restore
    // the scroll position afterward. (`position: fixed` rather than
    // `overflow: hidden` because iOS Safari doesn't reliably respect the
    // latter.)
    function lockScroll() {
      scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = -scrollY + 'px';
      document.body.style.left = '0';
      document.body.style.right = '0';
    }
    function unlockScroll() {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      window.scrollTo(0, scrollY);
    }

    // Drawer open/close. The drawer itself starts `inert` (see the <aside>
    // tag) so it can't be tabbed into while off-screen; opening it clears
    // that and instead makes the background `inert`. Either way, exactly
    // one side is interactive at a time, with no manual focus trap needed.
    function openDrawer() {
      lockScroll();
      root.setAttribute('data-drawer-open', 'true');
      drawer.removeAttribute('inert');
      toggle.setAttribute('aria-expanded', 'true');
      main.setAttribute('inert', '');
      controls.setAttribute('inert', '');
      closeBtn.focus();
      document.addEventListener('keydown', onDrawerKeydown);
    }
    function closeDrawer() {
      root.removeAttribute('data-drawer-open');
      drawer.setAttribute('inert', '');
      toggle.setAttribute('aria-expanded', 'false');
      main.removeAttribute('inert');
      controls.removeAttribute('inert');
      unlockScroll();
      toggle.focus();
      document.removeEventListener('keydown', onDrawerKeydown);
    }
    function onDrawerKeydown(e) {
      if (e.key === 'Escape') closeDrawer();
    }

    toggle.addEventListener('click', function () {
      if (root.getAttribute('data-drawer-open') === 'true') closeDrawer();
      else openDrawer();
    });
    closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    // First-visit presider prompt. Shows once — the first time this browser
    // has no explicitly saved presider choice — and never again afterward,
    // since choosing (here or later in the drawer) is what saves it. There's
    // no backdrop-tap-to-dismiss on purpose: Escape is the one way out
    // without choosing, and because nothing gets saved when you do that,
    // the prompt just shows again next visit rather than being lost.
    function openPopup() {
      lockScroll();
      root.setAttribute('data-popup-open', 'true');
      popup.removeAttribute('inert');
      main.setAttribute('inert', '');
      controls.setAttribute('inert', '');
      var first = popup.querySelector('.popup-option-btn');
      if (first) first.focus();
      document.addEventListener('keydown', onPopupKeydown);
    }
    function closePopup() {
      root.removeAttribute('data-popup-open');
      popup.setAttribute('inert', '');
      main.removeAttribute('inert');
      controls.removeAttribute('inert');
      unlockScroll();
      toggle.focus();
      document.removeEventListener('keydown', onPopupKeydown);
    }
    function onPopupKeydown(e) {
      if (e.key === 'Escape') closePopup();
    }

    if (popup) {
      popup.querySelectorAll('.popup-option-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          setPref('presider', btn.getAttribute('data-value'));
          closePopup();
        });
      });

      if (!saved.presider) {
        // Double rAF: let the browser paint the popup in its closed
        // position at least once before opening it, so the slide-up is a
        // visible transition instead of an instant jump on first load.
        requestAnimationFrame(function () {
          requestAnimationFrame(openPopup);
        });
      }
    }
  })();



document.querySelectorAll('.content .out:not(span), .content .in:not(span)').forEach(el => {
  const wrapper = document.createElement('div');
  wrapper.className = 'optWrapper';
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
});
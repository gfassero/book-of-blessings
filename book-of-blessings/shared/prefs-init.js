  // Apply saved display preferences before the page paints, so
  // there's no flash of default styling on load.
  (function () {
    var STORAGE_KEY = 'refDocPrefs';
    var defaults = { font: 'serif', size: 'medium', spacing: 'normal', presider: 'lay', simplify: true, cull: true, newScripture: true, newMissal: true, addCross: true };
    var saved = {};
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      saved = {};
    }
    var root = document.documentElement;
    root.setAttribute('data-font', saved.font || defaults.font);
    root.setAttribute('data-size', saved.size || defaults.size);
    root.setAttribute('data-spacing', saved.spacing || defaults.spacing);
    root.setAttribute('data-presider', saved.presider || defaults.presider);
    // Boolean prefs can't use the `saved.x || defaults.x` shorthand above —
    // an explicit `false` is falsy, so that pattern would silently override
    // "explicitly off" back to the default. Check key presence instead.
    root.setAttribute('data-simplify', ('simplify' in saved ? saved.simplify : defaults.simplify) ? 'true' : 'false');
    root.setAttribute('data-cull', ('cull' in saved ? saved.cull : defaults.cull) ? 'true' : 'false');
    root.setAttribute('data-newScripture', ('newScripture' in saved ? saved.newScripture : defaults.newScripture) ? 'true' : 'false');
    root.setAttribute('data-newMissal', ('newMissal' in saved ? saved.newMissal : defaults.newMissal) ? 'true' : 'false');
    root.setAttribute('data-addCross', ('addCross' in saved ? saved.addCross : defaults.addCross) ? 'true' : 'false');
  })();
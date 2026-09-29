// Dark/light toggle: the only JavaScript on the site.
// Loaded as a classic blocking script in <head>, so a saved choice applies before first paint
// (no flash of the wrong theme). Without JS the site simply follows the OS setting.
// The choice lives in localStorage only after a click; it is never sent anywhere.
(function () {
  var KEY = 'theme';
  var root = document.documentElement;
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  function load() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null; // private mode or blocked storage: just follow the OS
    }
  }

  function save(value) {
    try {
      localStorage.setItem(KEY, value);
    } catch (e) {
      /* not persisted; the toggle still works for this page view */
    }
  }

  function current() {
    return root.dataset.theme || (systemDark.matches ? 'dark' : 'light');
  }

  var saved = load();
  if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;

  document.addEventListener('DOMContentLoaded', function () {
    var buttons = document.querySelectorAll('[data-theme-toggle]');

    function sync() {
      var dark = String(current() === 'dark');
      for (var i = 0; i < buttons.length; i++) buttons[i].setAttribute('aria-pressed', dark);
    }

    for (var i = 0; i < buttons.length; i++) {
      buttons[i].hidden = false;
      buttons[i].addEventListener('click', function () {
        var next = current() === 'dark' ? 'light' : 'dark';
        root.dataset.theme = next;
        save(next);
        sync();
      });
    }

    systemDark.addEventListener('change', sync);
    sync();
  });
})();

/* Theme switcher disabled for the production spec mock.
 * ?debugTheme=herb-air|olive-amber still works for internal comparison. */
(function () {
  try {
    const q = new URLSearchParams(location.search).get("debugTheme");
    if (q) document.documentElement.setAttribute("data-theme", q);
    else document.documentElement.removeAttribute("data-theme");
  } catch (_) {}
})();

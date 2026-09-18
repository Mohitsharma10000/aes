/**
 * Inline header search — expands width on the right inside the nav row.
 * No full-width modal. Results drop under the field only.
 * Fuzzy filter: only products matching the query.
 */
(function () {
  const MIN_QUERY = 1;
  const MAX_RESULTS = 6;

  function basePath() {
    return location.pathname.includes("/legal/") ? "../" : "";
  }

  function wrap() {
    return document.querySelector("[data-search-wrap]");
  }

  function inputEl() {
    return document.querySelector("[data-search-input]");
  }

  function resultsEl() {
    return document.querySelector("[data-search-results]");
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function includesMatch(text, query) {
    return String(text || "")
      .toLowerCase()
      .includes(String(query).toLowerCase());
  }

  function fuzzyNameScore(name, query) {
    const text = String(name || "").toLowerCase();
    const q = String(query || "").toLowerCase().trim();
    if (!text || !q) return 0;
    if (text.startsWith(q)) return 300;
    if (text.includes(q)) return 200 - text.indexOf(q);
    const words = text.split(/[\s\-/]+/);
    for (const w of words) {
      if (w.startsWith(q)) return 180;
    }
    if (q.length < 3) return 0;
    let ti = 0;
    const positions = [];
    for (let qi = 0; qi < q.length; qi++) {
      const found = text.indexOf(q[qi], ti);
      if (found === -1) return 0;
      positions.push(found);
      ti = found + 1;
    }
    const span = positions[positions.length - 1] - positions[0] + 1;
    if (span > q.length * 3) return 0;
    return 40 + (q.length * 3 - span);
  }

  function productMatches(p, query) {
    const q = query.trim();
    if (!q) return null;
    const name = String(p.name || "");
    const nameL = name.toLowerCase();
    const qL = q.toLowerCase();

    if (q.length <= 2) {
      if (nameL.startsWith(qL)) return { p, score: 300 };
      if (nameL.split(/[\s\-/]+/).some((w) => w.startsWith(qL))) return { p, score: 200 };
      if (String(p.slug || "").toLowerCase().startsWith(qL)) return { p, score: 180 };
      return null;
    }

    if (nameL.includes(qL)) return { p, score: 250 - nameL.indexOf(qL) };
    if (includesMatch(p.slug, q)) return { p, score: 220 };
    if (includesMatch(p.descriptor, q)) return { p, score: 160 };
    if (includesMatch(p.category, q)) return { p, score: 150 };
    if ((p.rooms || []).some((r) => includesMatch(r, q))) return { p, score: 140 };

    const fz = fuzzyNameScore(name, q);
    if (fz > 0) return { p, score: fz };
    return null;
  }

  function highlightMatch(text, query) {
    if (!text || !query) return escapeHtml(text || "");
    const raw = String(text);
    const q = query.trim();
    const i = raw.toLowerCase().indexOf(q.toLowerCase());
    if (i === -1) return escapeHtml(raw);
    return (
      escapeHtml(raw.slice(0, i)) +
      `<mark class="search-mark">${escapeHtml(raw.slice(i, i + q.length))}</mark>` +
      escapeHtml(raw.slice(i + q.length))
    );
  }

  function renderResults(q) {
    const list = resultsEl();
    if (!list || !window.AEVA) return;

    const query = (q || "").trim();
    const w = wrap();

    if (query.length < MIN_QUERY) {
      list.innerHTML = "";
      list.hidden = true;
      w?.classList.remove("has-results");
      return;
    }

    const ranked = (window.AEVA.listShopable ? window.AEVA.listShopable() : window.AEVA.products)
      .map((p) => productMatches(p, query))
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_RESULTS);

    if (!ranked.length) {
      list.innerHTML = `
        <div class="header-search-results__empty" role="status">
          Nothing matched. <a href="${basePath()}shop.html">Browse the essentials</a>
        </div>`;
      list.hidden = false;
      w?.classList.add("has-results");
      return;
    }

    list.innerHTML = ranked
      .map(({ p }) => {
        const href = basePath() + (window.AEVA.productHref ? window.AEVA.productHref(p) : "product.html?id=" + p.slug);
        return `
      <a class="search-result" href="${href}" role="option">
        <span class="scent-chip" style="background:${(window.AEVA.scentOf(p.formulaKey) || {}).hex || "#ddd"}"></span>
        <span class="search-result__text">
          <strong>${highlightMatch(p.name, query)}</strong>
          <em>${escapeHtml(p.descriptor || "")}</em>
        </span>
        <span class="search-result__price">₹—</span>
      </a>`;
      })
      .join("");
    list.hidden = false;
    w?.classList.add("has-results");
  }

  function openSearch() {
    const w = wrap();
    const input = inputEl();
    if (!w || !input) return;
    w.classList.add("is-open");
    input.setAttribute("aria-expanded", "true");
    input.placeholder = "Search essentials…";
    // Keep focus in the same field (no modal swap)
    if (document.activeElement !== input) input.focus();
  }

  function closeSearch() {
    const w = wrap();
    const input = inputEl();
    const list = resultsEl();
    if (!w) return;
    w.classList.remove("is-open", "has-results");
    if (input) {
      input.value = "";
      input.placeholder = "Search";
      input.setAttribute("aria-expanded", "false");
      input.blur();
    }
    if (list) {
      list.innerHTML = "";
      list.hidden = true;
    }
  }

  function isOpen() {
    return !!wrap()?.classList.contains("is-open");
  }

  // Focus / click into the field expands it
  document.addEventListener(
    "focusin",
    (e) => {
      if (e.target.matches?.("[data-search-input]")) openSearch();
    },
    true
  );

  document.addEventListener("click", (e) => {
    // Mobile nav: focus header search after closing sheet
    if (e.target.closest("[data-open-search], [data-focus-header-search]")) {
      e.preventDefault();
      setTimeout(() => {
        openSearch();
        inputEl()?.focus();
      }, 50);
      return;
    }

    if (e.target.closest("[data-close-search]")) {
      e.preventDefault();
      closeSearch();
      return;
    }

    // Click outside wrap collapses
    if (isOpen()) {
      const w = wrap();
      if (w && !w.contains(e.target)) closeSearch();
    }
  });

  document.addEventListener("input", (e) => {
    if (e.target.matches("[data-search-input]")) {
      if (!isOpen()) openSearch();
      renderResults(e.target.value);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) {
      e.preventDefault();
      closeSearch();
      return;
    }
    // "/" opens header search
    if (
      e.key === "/" &&
      !e.metaKey &&
      !e.ctrlKey &&
      !e.altKey &&
      document.activeElement &&
      !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)
    ) {
      e.preventDefault();
      openSearch();
      inputEl()?.focus();
    }
  });

  window.AevaSearch = { open: openSearch, close: closeSearch };
})();

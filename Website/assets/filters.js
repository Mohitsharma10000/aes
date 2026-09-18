/**
 * Shop filters — ?room= kitchen|bathroom|surfaces
 *              ?format= essentials|restock|kit|accessory
 *              ?sort= featured|price|az
 */
(function () {
  const A = () => window.AEVA;

  function params() {
    return new URLSearchParams(location.search);
  }

  function mapLegacyFormat(f, path) {
    if (f === "pouch" || f === "bottle") return f === "pouch" ? "restock" : "essentials";
    if (f) return f;
    if (path === "accessory") return "accessory";
    if (path === "restock") return "restock";
    if (path === "starter" || path === "room-set") return "kit";
    if (path === "formula") return "essentials";
    return "";
  }

  function readState() {
    const p = params();
    const path = p.get("path") || "";
    return {
      room: p.get("room") || "",
      format: mapLegacyFormat(p.get("format") || "", path),
      sort: p.get("sort") || "",
      formula: p.get("formula") || "",
    };
  }

  function writeState(state) {
    const p = new URLSearchParams();
    ["room", "format", "sort", "formula"].forEach((k) => {
      if (state[k]) p.set(k, state[k]);
    });
    const q = p.toString();
    history.pushState(null, "", location.pathname + (q ? "?" + q : "") + location.hash);
  }

  function merchFormat(p, format) {
    if (p.merchPath === "formula") return format === "pouch" ? "restock" : "essentials";
    if (p.merchPath === "restock") return "restock";
    if (p.merchPath === "starter" || p.merchPath === "room-set") return "kit";
    if (p.merchPath === "accessory") return "accessory";
    return "";
  }

  function entryMatches(entry, state) {
    const Aeva = A();
    const p = Aeva.getProduct(entry.id);
    if (!p) return false;
    if (state.formula && p.formulaKey !== state.formula && p.id !== state.formula) return false;
    if (state.room && !(p.rooms || []).includes(state.room)) return false;
    if (state.format) {
      const fmt = merchFormat(p, entry.format);
      if (fmt !== state.format) return false;
    }
    return true;
  }

  function sortEntries(rows, sort) {
    const copy = rows.slice();
    const Aeva = A();
    if (sort === "az") {
      copy.sort((a, b) => (a.p.name || "").localeCompare(b.p.name || "", "en", { sensitivity: "base" }));
    } else if (sort === "price") {
      copy.sort((a, b) => {
        const pa = Aeva.fromPrice(a.p);
        const pb = Aeva.fromPrice(b.p);
        if (pa == null && pb == null) return 0;
        if (pa == null) return 1;
        if (pb == null) return -1;
        return pa - pb;
      });
    }
    return copy;
  }

  function resolveEntries(el) {
    const Aeva = A();
    const key = el.getAttribute("data-collection");
    if (key && Aeva.listCollection) return Aeva.listCollection(key).slice();
    const ids = el.getAttribute("data-ids");
    if (!ids) return [];
    const formats = (el.getAttribute("data-formats") || "").split(",");
    return ids.split(",").map((id, i) => {
      const format = (formats[i] || "").trim() || undefined;
      return { id: id.trim(), format: format };
    });
  }

  function renderCollections() {
    const grids = document.querySelectorAll("[data-collection], [data-ids]");
    if (!grids.length || !A() || !window.AevaCards) return false;
    const Aeva = A();
    const state = readState();
    const pageHasFilters = !!document.querySelector("select[data-filter]");

    grids.forEach((el) => {
      let entries = resolveEntries(el);
      if (pageHasFilters) entries = entries.filter((e) => entryMatches(e, state));
      const rows = entries
        .map((e) => {
          const p = Aeva.getProduct(e.id);
          if (!p) return null;
          const format = e.format || (p.merchPath === "formula" ? "bottle" : "default");
          return { p: p, format: format };
        })
        .filter(Boolean);
      const sorted = pageHasFilters ? sortEntries(rows, state.sort) : rows;
      const group = el.closest("[data-restock-group]");
      const section = el.closest(".shop-chapter");
      if (group) group.hidden = !sorted.length;
      else if (section) section.hidden = !sorted.length;
      el.innerHTML = sorted.map((row) => window.AevaCards.cardHTML(row.p, { format: row.format })).join("");
    });

    document.querySelectorAll(".shop-chapter").forEach((sec) => {
      const nested = sec.querySelectorAll("[data-restock-group]");
      if (nested.length) {
        sec.hidden = Array.from(nested).every((g) => g.hidden);
        return;
      }
      const grid = sec.querySelector("[data-collection], [data-ids]");
      if (grid && !grid.children.length && !sec.classList.contains("shop-faq") && sec.id !== "shop-notes") {
        sec.hidden = true;
      }
    });

    const faq = document.getElementById("shop-faq-list");
    if (faq) faq.innerHTML = Aeva.faqHTML();
    const notes = document.getElementById("shop-notes-list");
    if (notes) notes.innerHTML = Aeva.notesHTML();

    const visible = document.querySelectorAll(".shop-page .product-card").length;
    const countEl = document.querySelector("[data-shop-count]");
    if (countEl) countEl.textContent = "Results: " + visible + " product" + (visible === 1 ? "" : "s");

    const filtered = !!(state.room || state.format || state.formula || (state.sort && state.sort !== "featured"));
    document.querySelectorAll("select[data-filter]").forEach((sel) => {
      const dim = sel.getAttribute("data-filter");
      sel.value = state[dim] || "";
    });
    const clear = document.querySelector(".shop-clear");
    if (clear) clear.hidden = !filtered;
    if (window.AevaAlsoLike) window.AevaAlsoLike.bindAll();
    return true;
  }

  function jumpToQuery() {
    const state = readState();
    const map = {
      essentials: "shop-essentials",
      restock: "shop-restock",
      kit: "shop-kits",
      accessory: "shop-accessories",
    };
    const id = map[state.format];
    if (id) document.getElementById(id)?.scrollIntoView({ block: "start" });
    if (state.room) {
      const roomId = "shop-" + state.room;
      document.getElementById(roomId)?.scrollIntoView({ block: "start" });
    }
  }

  function boot() {
    const hasCollections = !!document.querySelector("[data-collection], [data-ids]");
    if (!hasCollections) return;
    document.querySelectorAll("select[data-filter]").forEach((sel) => {
      sel.addEventListener("change", () => {
        const state = readState();
        state[sel.getAttribute("data-filter")] = sel.value;
        writeState(state);
        renderCollections();
      });
    });
    document.querySelectorAll("[data-filter].filter-chip, .shop-clear").forEach((chip) => {
      chip.addEventListener("click", () => {
        const dim = chip.getAttribute("data-filter");
        const val = chip.getAttribute("data-value") || "";
        let state = readState();
        if (dim === "all") state = { room: "", format: "", sort: "", formula: "" };
        else state[dim] = state[dim] === val ? "" : val;
        writeState(state);
        renderCollections();
      });
    });
    window.addEventListener("popstate", renderCollections);
    renderCollections();
    if (document.body.getAttribute("data-aeva-chrome") === "shop") jumpToQuery();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

/**
 * You May Also Like — snap carousel (4 / 2 / 1 cards).
 */
(function () {
  function visibleCount(section) {
    if (window.matchMedia("(max-width: 640px)").matches) return 1;
    if (window.matchMedia("(max-width: 1099px)").matches) return 2;
    const forced = Number(section && section.getAttribute("data-also-count"));
    if (forced > 0) return forced;
    return 4;
  }

  function gapPx(track) {
    const raw = window.getComputedStyle(track).gap || window.getComputedStyle(track).columnGap || "20";
    const n = parseFloat(raw);
    return Number.isFinite(n) ? n : 20;
  }

  function bind(section) {
    const viewport = section.querySelector(".also-like__viewport");
    const track = section.querySelector(".also-like__track");
    if (!viewport || !track) return;
    const cards = Array.from(track.children);
    if (!cards.length) {
      section.hidden = true;
      return;
    }
    section.hidden = false;

    let nav = section.querySelector(".also-like__nav");
    if (!nav) {
      nav = document.createElement("div");
      nav.className = "also-like__nav";
      nav.innerHTML =
        '<button type="button" class="also-like__btn" data-also-prev aria-label="Previous">‹</button>' +
        '<button type="button" class="also-like__btn" data-also-next aria-label="Next">›</button>';
      const h2 = section.querySelector("h2");
      if (h2 && !h2.closest(".also-like__head")) {
        const head = document.createElement("div");
        head.className = "also-like__head";
        h2.parentNode.insertBefore(head, h2);
        head.appendChild(h2);
        head.appendChild(nav);
      } else if (h2 && h2.closest(".also-like__head")) {
        h2.closest(".also-like__head").appendChild(nav);
      } else {
        viewport.before(nav);
      }
    }

    let dots = section.querySelector("[data-also-dots]");
    if (!dots) {
      dots = document.createElement("div");
      dots.className = "also-like__dots";
      dots.setAttribute("data-also-dots", "");
      viewport.after(dots);
    }

    function pages() {
      return Math.max(1, Math.ceil(cards.length / visibleCount(section)));
    }

    function page() {
      const w = viewport.clientWidth;
      if (!w) return 0;
      return Math.max(0, Math.min(pages() - 1, Math.round(viewport.scrollLeft / w)));
    }

    function sizeCards() {
      const v = visibleCount(section);
      const g = gapPx(track);
      const w = (viewport.clientWidth - g * (v - 1)) / v;
      cards.forEach((card) => {
        card.style.flex = "0 0 " + w + "px";
        card.style.maxWidth = w + "px";
      });
    }

    function go(i) {
      const p = Math.max(0, Math.min(pages() - 1, i));
      viewport.scrollTo({ left: p * viewport.clientWidth, behavior: "smooth" });
    }

    function sync() {
      sizeCards();
      const p = page();
      const n = pages();
      const show = n > 1;
      nav.hidden = !show;
      dots.hidden = !show;
      if (show && dots.children.length !== n) {
        dots.innerHTML = Array.from(
          { length: n },
          (_, i) =>
            `<button type="button" class="also-like__dot${i === p ? " is-active" : ""}" data-also-dot="${i}" aria-label="Slide ${i + 1}"></button>`
        ).join("");
      } else if (show) {
        Array.from(dots.children).forEach((d, i) => d.classList.toggle("is-active", i === p));
      }
      const prev = nav.querySelector("[data-also-prev]");
      const next = nav.querySelector("[data-also-next]");
      if (prev) prev.disabled = p <= 0;
      if (next) next.disabled = p >= n - 1;
    }

    if (!section._alsoBound) {
      section._alsoBound = true;
      nav.addEventListener("click", (e) => {
        if (e.target.closest("[data-also-prev]")) go(page() - 1);
        if (e.target.closest("[data-also-next]")) go(page() + 1);
      });
      dots.addEventListener("click", (e) => {
        const d = e.target.closest("[data-also-dot]");
        if (d) go(Number(d.getAttribute("data-also-dot")));
      });
      viewport.addEventListener("scroll", sync, { passive: true });
    }
    sync();
    section._alsoSync = sync;
  }

  function bindAll() {
    document.querySelectorAll("[data-also-carousel]").forEach(bind);
  }

  window.addEventListener("resize", () => {
    document.querySelectorAll("[data-also-carousel]").forEach((section) => {
      if (typeof section._alsoSync === "function") section._alsoSync();
    });
  });

  window.AevaAlsoLike = { bind: bind, bindAll: bindAll };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bindAll);
  else bindAll();
})();

/**
 * Room + home showcase: path tiles and featured buy panels.
 */
(function () {
  const A = window.AEVA;
  if (!A) return;

  function fillPaths() {
    document.querySelectorAll("[data-path-id]").forEach((el) => {
      const p = A.getProduct(el.getAttribute("data-path-id"));
      if (!p) return;
      const img = A.productImage(p, p.merchPath === "formula" ? "bottle" : undefined);
      const kicker = el.getAttribute("data-path-kicker") || "";
      const name = el.getAttribute("data-path-name") || p.name;
      el.innerHTML =
        `<span class="room-path__media">${img ? `<img src="${img}" alt="">` : ""}</span>` +
        (kicker ? `<span class="room-path__kicker">${kicker}</span>` : "") +
        `<span class="room-path__name">${name}</span>`;
    });
  }

  function fillBuyPanels() {
    document.querySelectorAll("[data-home-feature]").forEach((el) => {
      const p = A.getProduct(el.getAttribute("data-home-feature"));
      if (!p) return;
      const href = A.productHref(p);
      const img = A.productImage(p);
      const kicker = el.getAttribute("data-home-feature-kicker") || "";
      const tbd = A.isTbd(p);
      const included = (p.contents || []).map((c) => A.contentLabel(c)).filter(Boolean);
      el.innerHTML = `
        ${kicker ? `<p class="bb-kicker">${kicker}</p>` : ""}
        <h3>${p.name}</h3>
        <p>${p.short || p.descriptor || ""}</p>
        <a class="home-feature__pack" href="${href}">${img ? `<img src="${img}" alt="${p.name}">` : ""}</a>
        ${included.length ? `<ul class="home-feature__includes">${included.map((n) => `<li>${n}</li>`).join("")}</ul>` : ""}
        ${tbd ? `<a class="btn btn--secondary" href="${href}">Explore the kit <span aria-hidden="true">→</span></a>` : `<button type="button" class="btn btn--primary" data-add-cart data-product-id="${p.id}" data-size-id="default" data-format="default">Add to cart</button>`}
      `;
    });
  }

  function atcButton(p, format) {
    const tbd = A.isTbd(p);
    const fmt = format || (p.merchPath === "formula" ? "bottle" : "default");
    const sizeId = fmt === "pouch" || fmt === "bottle" ? fmt : "default";
    const label = tbd ? "Price to come" : fmt === "pouch" ? "Add Restock" : fmt === "bottle" ? "Add Essentials" : "Add to cart";
    const cls = fmt === "pouch" ? "btn btn--secondary" : "btn btn--primary";
    if (tbd) return `<a class="${cls}" href="${A.productHref(p, fmt)}">View formula <span aria-hidden="true">→</span></a>`;
    return `<button type="button" class="${cls}" data-add-cart data-product-id="${p.id}" data-size-id="${sizeId}" data-format="${fmt}">${label}</button>`;
  }

  function fillTale() {
    document.querySelectorAll("[data-room-tale]").forEach((el) => {
      const ids = (el.getAttribute("data-room-tale") || "").split(",").map((s) => s.trim()).filter(Boolean);
      el.innerHTML = ids
        .map((id) => {
          const p = A.getProduct(id);
          if (!p) return "";
          const href = A.productHref(p, "bottle");
          const img = A.productImage(p, "bottle");
          return `<article class="room-tale__col">
            <h3>${p.name}</h3>
            <p>${p.short || p.descriptor || ""}</p>
            <a class="room-tale__pack" href="${href}">${img ? `<img src="${img}" alt="${p.name}">` : ""}</a>
            <p class="room-tale__name">${p.name}</p>
            <p class="room-tale__price">₹—</p>
            ${atcButton(p, "bottle")}
          </article>`;
        })
        .join("");
    });
  }

  function fillPouches() {
    document.querySelectorAll("[data-room-pouches]").forEach((el) => {
      const ids = (el.getAttribute("data-room-pouches") || "").split(",").map((s) => s.trim()).filter(Boolean);
      el.innerHTML = ids
        .map((id) => {
          const p = A.getProduct(id);
          if (!p) return "";
          const href = A.productHref(p, "pouch");
          const img = A.productImage(p, "pouch");
          return `<article class="pouch-card">
            <a class="pouch-card__media" href="${href}">${img ? `<img src="${img}" alt="${p.name} Restock">` : ""}</a>
            <h3><a href="${href}">${p.name}</a></h3>
            <p>Restock 1000 ml. Keep the bottle.</p>
            <p class="pouch-card__price">₹—</p>
            ${atcButton(p, "pouch")}
          </article>`;
        })
        .join("");
    });
  }

  function fillPair() {
    document.querySelectorAll("[data-room-pair]").forEach((el) => {
      const ids = (el.getAttribute("data-room-pair") || "").split(",").map((s) => s.trim()).filter(Boolean);
      el.innerHTML = ids
        .map((id) => {
          const p = A.getProduct(id);
          if (!p) return "";
          const href = A.productHref(p);
          const img = A.productImage(p);
          return `<article class="pair-card">
            <a class="pair-card__media" href="${href}">${img ? `<img src="${img}" alt="${p.name}">` : ""}</a>
            <h3><a href="${href}">${p.name}</a></h3>
            <p>${p.short || p.descriptor || ""}</p>
            <p class="pair-card__price">₹—</p>
            ${atcButton(p)}
          </article>`;
        })
        .join("");
    });
  }

  function fillFormulas() {
    document.querySelectorAll("[data-room-formulas]").forEach((el) => {
      const ids = (el.getAttribute("data-room-formulas") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      el.innerHTML = ids
        .map((id) => {
          const p = A.getProduct(id);
          if (!p) return "";
          const bottle = A.getSize(p, "bottle");
          const pouch = A.getSize(p, "pouch");
          const img = A.productImage(p, "bottle");
          const href = A.productHref(p, "bottle");
          const pouchHref = A.productHref(p, "pouch");
          const jobs = (p.usedFor || []).slice(0, 4);
          const tbd = A.isTbd(p);
          return `<article class="room-formula">
            <a class="room-formula__media" href="${href}">${img ? `<img src="${img}" alt="${p.name}">` : ""}</a>
            <h3><a href="${href}">${p.name}</a></h3>
            <p class="room-formula__short">${p.short || p.descriptor || ""}</p>
            ${jobs.length ? `<ul class="room-formula__jobs">${jobs.map((j) => `<li>${j}</li>`).join("")}</ul>` : ""}
            <p class="room-formula__variants">
              <a href="${href}">${bottle && bottle.helper ? bottle.label : "Essentials"}</a>
              <span aria-hidden="true">·</span>
              <a href="${pouchHref}">${pouch ? pouch.label : "Restock"}</a>
            </p>
            ${tbd ? `<a class="btn btn--secondary" href="${href}">View formula <span aria-hidden="true">→</span></a>` : `<button type="button" class="btn btn--primary" data-add-cart data-product-id="${p.id}" data-size-id="bottle" data-format="bottle">Add Essentials</button>`}
          </article>`;
        })
        .join("");
    });
  }

  function bindBrowse() {
    const track = document.querySelector("[data-browse-track]");
    if (!track) return;
    const prev = document.querySelector("[data-browse-prev]");
    const next = document.querySelector("[data-browse-next]");
    function step() {
      const tile = track.querySelector(".home-browse__tile");
      return tile ? tile.getBoundingClientRect().width + 16 : 280;
    }
    function sync() {
      const max = track.scrollWidth - track.clientWidth - 4;
      if (prev) prev.disabled = track.scrollLeft <= 4;
      if (next) next.disabled = track.scrollLeft >= max;
    }
    prev?.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
    next?.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
    track.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    sync();
  }

  function boot() {
    fillPaths();
    fillBuyPanels();
    fillTale();
    fillPouches();
    fillPair();
    fillFormulas();
    bindBrowse();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

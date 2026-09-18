(function () {
  const A = window.AEVA;
  if (!A) return;

  const LIMIT = (A.homeMerch && A.homeMerch.limit) || 4;
  const SHOP_HREF = {
    bestsellers: "shop.html",
    starters: "kits.html",
    rooms: "kits.html",
  };

  function renderPanel(id, key, cardOpts) {
    const el = document.getElementById(id);
    if (!el || !window.AevaCards) return;
    el.innerHTML = A.listHomeMerch(key)
      .slice(0, LIMIT)
      .map((p) => window.AevaCards.cardHTML(p, cardOpts))
      .join("");
  }

  renderPanel("home-bestsellers", "bestsellers", { format: "bottle" });
  renderPanel("home-starters", "starters");
  renderPanel("home-rooms", "rooms");

  const HOTSPOTS = [
    { id: "dishwash", x: 18, y: 40, usedFor: ["Dishes", "Cookware", "Oil and masala", "The sink"] },
    { id: "kitchen-degreaser", x: 32, y: 36, usedFor: ["Hob", "Splashback", "Greasy film", "Cool stove"] },
    { id: "floor-cleaner", x: 45, y: 42, usedFor: ["Sealed tile", "Stone floors", "Daily mopping", "Spots"] },
    { id: "surface-cleaner", x: 56, y: 36, usedFor: ["Counters", "Tables", "Switches", "High-touch"] },
    { id: "bathroom-cleaner", x: 68, y: 40, usedFor: ["Tiles", "Taps", "Wet rooms", "Soap film"] },
    { id: "toilet-cleaner", x: 82, y: 44, usedFor: ["Bowl", "Rim"] },
    { id: "eco-dishwash-scrub", x: 42, y: 60, usedFor: ["The sink", "Dishes"] },
    { id: "cotton-cloth", x: 70, y: 74, usedFor: ["Sprays", "Counters", "Tiles"] },
  ];

  function bindSystem() {
    const media = document.querySelector("[data-system-media]");
    const card = document.querySelector("[data-system-card]");
    if (!media || !card) return;

    HOTSPOTS.forEach((spot, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "system-pin";
      btn.style.left = spot.x + "%";
      btn.style.top = spot.y + "%";
      btn.textContent = String(i + 1).padStart(2, "0");
      btn.setAttribute("aria-label", "Show product " + (i + 1));
      btn.setAttribute("data-system-pin", String(i));
      media.appendChild(btn);
    });

    function show(index) {
      const i = (index + HOTSPOTS.length) % HOTSPOTS.length;
      const spot = HOTSPOTS[i];
      const p = A.getProduct(spot.id);
      if (!p) return;
      media.querySelectorAll(".system-pin").forEach((pin, n) => {
        pin.classList.toggle("is-active", n === i);
      });
      const jobs = (p.usedFor && p.usedFor.length ? p.usedFor : spot.usedFor) || [];
      const img = A.productImage(p, p.merchPath === "formula" ? "bottle" : "default");
      const href = A.productHref(p);
      card.innerHTML = `
        <div class="system-card__nav">
          <span>${String(i + 1).padStart(2, "0")}</span>
          <span class="system-card__pager">
            <button type="button" data-system-prev>Prev</button>
            <button type="button" data-system-next>Next</button>
          </span>
        </div>
        <div class="system-card__body">
          <div>
            <h3>${p.name}</h3>
            <p class="muted">${p.short || p.descriptor || ""}</p>
            ${
              jobs.length
                ? `<p class="bb-used-label">Used for</p><ul class="bb-used">${jobs
                    .map((j) => `<li>${j}</li>`)
                    .join("")}</ul>`
                : ""
            }
            <p><a href="${href}">See product</a></p>
          </div>
          ${img ? `<a class="system-card__thumb" href="${href}"><img src="${img}" alt="${p.name}" /></a>` : ""}
        </div>`;
      card.setAttribute("data-system-index", String(i));
    }

    media.addEventListener("click", (e) => {
      const pin = e.target.closest("[data-system-pin]");
      if (!pin) return;
      show(Number(pin.getAttribute("data-system-pin")));
    });
    card.addEventListener("click", (e) => {
      const i = Number(card.getAttribute("data-system-index") || 0);
      if (e.target.closest("[data-system-prev]")) show(i - 1);
      if (e.target.closest("[data-system-next]")) show(i + 1);
    });
    show(0);
  }

  bindSystem();

  const legend = document.querySelector("[data-scent-legend]");
  if (legend) {
    legend.innerHTML = A.listFormulas()
      .map((p) => `<li style="--scent:${p.scentHex || "#ddd"}" title="${p.name}"></li>`)
      .join("");
  }

  const six = document.getElementById("home-six");
  if (six) {
    six.innerHTML = A.listFormulas()
      .map((p) => {
        const img = A.productImage(p, "bottle");
        const hex = p.scentHex || "#ddd6cb";
        return `<a class="six-strip__item" href="${A.productHref(p)}" style="--scent:${hex}">
          <span class="six-strip__media">${img ? `<img src="${img}" alt="${p.name}" />` : ""}</span>
          <span class="six-strip__meta">
            <span class="scent-chip" style="background:${hex}"></span>
            <strong>${p.name}</strong>
          </span>
        </a>`;
      })
      .join("");
  }

  const tabs = document.querySelectorAll("[data-bb-tab]");
  const shopAll = document.querySelector("[data-home-shop-all]");
  if (tabs.length) {
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const key = tab.getAttribute("data-bb-tab");
        tabs.forEach((t) => t.setAttribute("aria-selected", t === tab ? "true" : "false"));
        document.querySelectorAll("[data-bb-panel]").forEach((panel) => {
          const on = panel.getAttribute("data-bb-panel") === key;
          panel.hidden = !on;
        });
        if (shopAll) {
          shopAll.setAttribute("href", tab.getAttribute("data-shop-href") || SHOP_HREF[key] || "shop.html");
        }
      });
    });
  }

  (function bindReviews() {
    const section = document.getElementById("home-reviews-section");
    const track = document.querySelector("[data-reviews-track]");
    const dotsEl = document.querySelector("[data-reviews-dots]");
    if (!section || !track) return;
    const items = A.getPublishedReviews();
    if (!items.length) return;
    section.hidden = false;

    const starSvg = `<span class="reviews-stars" aria-hidden="true">${"<span></span>".repeat(5)}</span>`;
    function cardHTML(r, state) {
      return `<article class="reviews-card ${state}">
          ${starSvg}
          <p class="reviews-card__quote">${r.quote}</p>
          <p class="reviews-card__by">${r.by}${r.city ? `, ${r.city}` : ""}</p>
        </article>`;
    }
    if (dotsEl) {
      dotsEl.innerHTML = items
        .map((_, i) => `<button type="button" class="reviews-dot" data-reviews-dot="${i}" aria-label="Review ${i + 1}"></button>`)
        .join("");
    }

    let index = 0;
    function go(next) {
      const n = items.length;
      index = (next + n) % n;
      const prev = items[(index - 1 + n) % n];
      const cur = items[index];
      const nxt = items[(index + 1) % n];
      track.innerHTML = cardHTML(prev, "is-prev") + cardHTML(cur, "is-active") + cardHTML(nxt, "is-next");
      dotsEl?.querySelectorAll("[data-reviews-dot]").forEach((dot, i) => {
        dot.classList.toggle("is-active", i === index);
      });
    }

    section.querySelector("[data-reviews-prev]")?.addEventListener("click", () => go(index - 1));
    section.querySelector("[data-reviews-next]")?.addEventListener("click", () => go(index + 1));
    dotsEl?.addEventListener("click", (e) => {
      const dot = e.target.closest("[data-reviews-dot]");
      if (dot) go(Number(dot.getAttribute("data-reviews-dot")));
    });
    window.addEventListener("resize", () => go(index));
    go(0);
  })();

  (function bindHero() {
    const root = document.querySelector("[data-home-hero]");
    if (!root) return;
    const slides = [...root.querySelectorAll("[data-hero-slide]")];
    const dots = [...root.querySelectorAll("[data-hero-dot]")];
    let i = 0;
    function go(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, idx) => {
        s.classList.toggle("is-active", idx === i);
        const v = s.querySelector("video");
        if (!v) return;
        if (idx === i) v.play().catch(() => {});
        else v.pause();
      });
      dots.forEach((d, idx) => d.classList.toggle("is-on", idx === i));
    }
    root.querySelector("[data-hero-prev]")?.addEventListener("click", () => go(i - 1));
    root.querySelector("[data-hero-next]")?.addEventListener("click", () => go(i + 1));
    dots.forEach((d) => d.addEventListener("click", () => go(Number(d.getAttribute("data-hero-dot")))));
  })();
})();

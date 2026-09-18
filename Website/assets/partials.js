/* Spec chrome: announcement, header, mega, footer, cart shell */
(function () {
  const BASE = location.pathname.includes("/legal/") ? "../" : "";

  if (!document.getElementById("aeva-paper-chrome")) {
    const lock = document.createElement("link");
    lock.id = "aeva-paper-chrome";
    lock.rel = "stylesheet";
    lock.href = BASE + "styles/paper-chrome.css?v=paper-20";
    document.head.appendChild(lock);
  }
  if (!document.getElementById("aeva-radius-lock")) {
    const radius = document.createElement("link");
    radius.id = "aeva-radius-lock";
    radius.rel = "stylesheet";
    radius.href = BASE + "styles/radius.css?v=squircle-2";
    document.head.appendChild(radius);
  }
  if (!document.getElementById("aeva-presence")) {
    const lift = document.createElement("link");
    lift.id = "aeva-presence";
    lift.rel = "stylesheet";
    lift.href = BASE + "styles/presence.css?v=lift-2";
    document.head.appendChild(lift);
  }
  if (!document.getElementById("aeva-aesop-nav")) {
    const nav = document.createElement("link");
    nav.id = "aeva-aesop-nav";
    nav.rel = "stylesheet";
    nav.href = BASE + "styles/aesop-nav.css?v=4";
    document.head.appendChild(nav);
  }
  if (!document.getElementById("aeva-atelier")) {
    const atelier = document.createElement("link");
    atelier.id = "aeva-atelier";
    atelier.rel = "stylesheet";
    atelier.href = BASE + "styles/atelier.css?v=atelier-2";
    document.head.appendChild(atelier);
  }

  function href(path) {
    return BASE + path;
  }

  function freeShipInr() {
    return (window.AEVA && window.AEVA.siteContent && window.AEVA.siteContent.freeShipInr) || 499;
  }

  function megaLink(p, label) {
    if (!p) return "";
    return `<a href="${href(window.AEVA.productHref(p))}">${label || p.name}</a>`;
  }

  function megaCard(p, caption) {
    if (!p || !window.AEVA) return "";
    const img = window.AEVA.productImage(p, p.merchPath === "formula" ? "bottle" : undefined);
    return `<a class="nav-mega__card" href="${href(window.AEVA.productHref(p))}">
      ${img ? `<img src="${img}" alt="${caption || p.name}">` : `<span class="nav-mega__card-ph"></span>`}
      <span>${caption || p.name}</span>
    </a>`;
  }

  function megaCol(label, html) {
    return `<div class="nav-mega__col"><p class="nav-mega__label">${label}</p>${html}</div>`;
  }

  function megaPanel(key, inner) {
    return `<div class="nav-mega" data-mega="${key}" hidden>${inner}</div>`;
  }

  function megaHTML() {
    const A = window.AEVA;
    if (!A) return `<div class="nav-megas" data-megas></div>`;
    const formulas = A.listFormulas();
    const roomKits = A.listRoomKits ? A.listRoomKits() : A.listSets();
    const starters = A.listStarters();
    const accessories = A.listAccessories();
    const kitchenF = ["dishwash", "kitchen-degreaser"].map((id) => A.getProduct(id));
    const bathF = ["bathroom-cleaner", "toilet-cleaner"].map((id) => A.getProduct(id));
    const surfF = ["surface-cleaner", "floor-cleaner"].map((id) => A.getProduct(id));
    const pouchLink = (p) => (p ? `<a href="${href("product.html?id=" + p.slug + "&format=pouch")}">${p.name} — Restock</a>` : "");

    return `<div class="nav-megas" data-megas>
      ${megaPanel(
        "shop",
        `<div class="nav-mega__grid">
          ${megaCol("Starter Kits", `${megaLink(A.getProduct("floor-starter"))}${megaLink(A.getProduct("kitchen-set"))}${megaLink(A.getProduct("home-essentials-kit"))}<a href="${href("kits.html")}">All starter kits</a>`)}
          ${megaCol("Essentials", formulas.map((p) => megaLink(p)).join(""))}
          ${megaCol("Restock", `${formulas.map((p) => pouchLink(p)).join("")}<a href="${href("refills.html")}">Shop restock</a>`)}
          ${megaCol("Accessories", `${accessories.map((p) => megaLink(p)).join("")}<a href="${href("shop.html#shop-accessories")}">Shop accessories</a>`)}
          ${megaCard(A.getProduct("kitchen-set"), "Kitchen Kit")}
          ${megaCard(A.getProduct("home-essentials-kit"), "Home Essentials Kit")}
        </div>`
      )}
      ${megaPanel(
        "kits",
        `<div class="nav-mega__grid">
          ${megaCol("Start", starters.map((p) => megaLink(p)).join(""))}
          ${megaCol("Rooms", roomKits.map((p) => megaLink(p)).join(""))}
          ${megaCol("House", `${megaLink(A.getProduct("home-essentials-kit"))}${megaLink(A.getProduct("home-keep-going-kit"))}`)}
          ${megaCol("Accessories", `${accessories.map((p) => megaLink(p)).join("")}<a href="${href("kits.html#kits-accessories")}">You may also like</a>`)}
          ${megaCard(A.getProduct("kitchen-set"), "Kitchen Kit")}
          ${megaCard(A.getProduct("home-essentials-kit"), "Home Essentials Kit")}
        </div>`
      )}
      ${megaPanel(
        "restock",
        `<div class="nav-mega__grid">
          ${megaCol("House", `${megaLink(A.getProduct("home-restock"))}`)}
          ${megaCol("Kitchen", `${megaLink(A.getProduct("kitchen-restock"))}` + [A.getProduct("dishwash"), A.getProduct("kitchen-degreaser")].map((p) => pouchLink(p)).join(""))}
          ${megaCol("Bathroom", `${megaLink(A.getProduct("bathroom-restock"))}` + [A.getProduct("bathroom-cleaner"), A.getProduct("toilet-cleaner")].map((p) => pouchLink(p)).join(""))}
          ${megaCol("Surfaces", `${megaLink(A.getProduct("surfaces-restock"))}` + [A.getProduct("surface-cleaner"), A.getProduct("floor-cleaner")].map((p) => pouchLink(p)).join(""))}
          ${megaCard(A.getProduct("home-restock"), "Home Restock Pack")}
          ${megaCard(A.getProduct("dishwash"), "Dishwash Liquid")}
        </div>`
      )}
      ${megaPanel(
        "kitchen",
        `<div class="nav-mega__grid">
          ${megaCol("The kit", `${megaLink(A.getProduct("kitchen-set"))}`)}
          ${megaCol("Essentials", kitchenF.map((p) => megaLink(p)).join(""))}
          ${megaCol("Starters", `${megaLink(A.getProduct("dishwash-starter"))}${megaLink(A.getProduct("degreaser-starter"))}`)}
          ${megaCol("Accessories", `${megaLink(A.getProduct("eco-dishwash-scrub"))}${megaLink(A.getProduct("cotton-cloth"))}<a href="${href("kitchen.html")}">Shop kitchen</a>`)}
          ${megaCard(A.getProduct("kitchen-set"), "Kitchen Kit")}
          ${megaCard(A.getProduct("dishwash"), "Dishwash Liquid")}
        </div>`
      )}
      ${megaPanel(
        "bathroom",
        `<div class="nav-mega__grid">
          ${megaCol("The kit", `${megaLink(A.getProduct("bathroom-set"))}`)}
          ${megaCol("Essentials", bathF.map((p) => megaLink(p)).join(""))}
          ${megaCol("Starters", `${megaLink(A.getProduct("bathroom-starter"))}${megaLink(A.getProduct("toilet-starter"))}`)}
          ${megaCol("Accessories", `${megaLink(A.getProduct("cotton-cloth"))}<a href="${href("bathroom.html")}">Shop bathroom</a>`)}
          ${megaCard(A.getProduct("bathroom-set"), "Bathroom Kit")}
          ${megaCard(A.getProduct("bathroom-cleaner"), "Bathroom Spray")}
        </div>`
      )}
      ${megaPanel(
        "surfaces",
        `<div class="nav-mega__grid">
          ${megaCol("The kit", `${megaLink(A.getProduct("surfaces-set"))}`)}
          ${megaCol("Essentials", surfF.map((p) => megaLink(p)).join(""))}
          ${megaCol("Starters", `${megaLink(A.getProduct("surface-starter"))}${megaLink(A.getProduct("floor-starter"))}`)}
          ${megaCol("Accessories", `${megaLink(A.getProduct("cotton-cloth"))}<a href="${href("surfaces.html")}">Shop surfaces</a>`)}
          ${megaCard(A.getProduct("surfaces-set"), "Surfaces Kit")}
          ${megaCard(A.getProduct("surface-cleaner"), "Surface Spray")}
        </div>`
      )}
    </div>`;
  }

  function headerHTML(active) {
    const n = freeShipInr();
    return `
    <a class="skip-link" href="#main">Skip to content</a>
    <div class="site-chrome">
    <div class="announcement-bar" data-announcement>
      <p class="announcement-bar__msg">Free shipping on orders over ₹${Number(n).toLocaleString("en-IN")} · India, 3–5 days</p>
      <button type="button" class="announcement-bar__close" data-close-announcement aria-label="Dismiss">✕</button>
    </div>
    <header class="site-header${active === "home" ? " is-overlay" : ""}">
      <div class="site-header__top">
        <div class="site-header__inner site-header__inner--top">
          <nav class="nav-util" aria-label="About">
            <a href="${href("about.html")}" class="${active === "about" ? "is-active" : ""}">About</a>
            <a href="${href("ingredients.html")}" class="${active === "ingredients" ? "is-active" : ""}">Ingredients</a>
          </nav>
          <a class="logo" href="${href("home.html")}" aria-label="Aeva Essentials home">aeva essentials</a>
          <div class="header-actions">
            <button type="button" class="header-cart" data-open-cart aria-label="Open cart">Cart <span class="cart-count">(0)</span></button>
            <button type="button" class="nav-toggle" data-open-nav aria-label="Open menu" aria-expanded="false">Menu</button>
          </div>
        </div>
      </div>
      <div class="site-header__sub">
        <nav class="nav-cats" aria-label="Shop">
          <a href="${href("shop.html")}" class="${active === "shop" ? "is-active" : ""}" data-mega-trigger="shop" aria-haspopup="true" aria-expanded="false">Shop all</a>
          <a href="${href("kits.html")}" class="${active === "kits" || active === "sets" || active === "starters" ? "is-active" : ""}" data-mega-trigger="kits" aria-haspopup="true" aria-expanded="false">Starter Kits</a>
          <a href="${href("refills.html")}" class="${active === "restock" || active === "refills" ? "is-active" : ""}" data-mega-trigger="restock" aria-haspopup="true" aria-expanded="false">Restock</a>
          <a href="${href("kitchen.html")}" class="${active === "kitchen" ? "is-active" : ""}" data-mega-trigger="kitchen" aria-haspopup="true" aria-expanded="false">Kitchen</a>
          <a href="${href("bathroom.html")}" class="${active === "bathroom" ? "is-active" : ""}" data-mega-trigger="bathroom" aria-haspopup="true" aria-expanded="false">Bathroom</a>
          <a href="${href("surfaces.html")}" class="${active === "surfaces" ? "is-active" : ""}" data-mega-trigger="surfaces" aria-haspopup="true" aria-expanded="false">Surfaces</a>
        </nav>
        <div class="header-search-wrap" data-search-wrap>
          <label class="header-search-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.4"/>
              <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
            </svg>
            <input
              type="search"
              class="header-search-bar__input"
              data-search-input
              placeholder="Search"
              autocomplete="off"
              spellcheck="false"
              aria-label="Search products"
              aria-autocomplete="list"
              aria-controls="search-results-list"
              aria-expanded="false"
            />
          </label>
          <div class="header-search-results" id="search-results-list" data-search-results role="listbox" hidden></div>
        </div>
      </div>
      ${megaHTML()}
    </header>
    </div>
    <div class="site-chrome-spacer" aria-hidden="true"></div>
    <div class="nav-sheet" data-nav-sheet hidden>
      <div class="nav-sheet__panel" role="dialog" aria-label="Menu">
        <div class="nav-sheet__top">
          <span class="logo">aeva <span class="logo__rest">essentials</span></span>
          <button type="button" data-close-nav aria-label="Close menu">✕</button>
        </div>
        <nav class="nav-sheet__links">
          <a href="${href("shop.html")}">Shop all</a>
          <a href="${href("kits.html")}">Starter Kits</a>
          <a href="${href("refills.html")}">Restock</a>
          <a href="${href("kitchen.html")}">Kitchen</a>
          <a href="${href("bathroom.html")}">Bathroom</a>
          <a href="${href("surfaces.html")}">Surfaces</a>
          <a href="${href("about.html")}">About</a>
          <a href="${href("ingredients.html")}">Ingredients</a>
          <a href="${href("faq.html")}">FAQ</a>
        </nav>
      </div>
      <div class="nav-sheet__backdrop" data-close-nav></div>
    </div>`;
  }

  function footerHTML() {
    const legal = (page) => href("legal/" + page);
    return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col">
            <a class="logo" href="${href("home.html")}">aeva <span class="logo__rest">essentials</span></a>
            <h4>Shop</h4>
            <a href="${href("shop.html")}">Shop all</a>
            <a href="${href("kits.html")}">Starter Kits</a>
            <a href="${href("refills.html")}">Restock</a>
            <a href="${href("kitchen.html")}">Kitchen</a>
            <a href="${href("bathroom.html")}">Bathroom</a>
            <a href="${href("surfaces.html")}">Surfaces</a>
            <a href="${href("shop.html")}#shop-accessories">Accessories</a>
          </div>
          <div class="footer-col">
            <h4>Learn</h4>
            <a href="${href("about.html")}">Our story</a>
            <a href="${href("ingredients.html")}">Ingredients</a>
            <a href="${href("home.html")}#refill-title">How restock works</a>
            <a href="${href("faq.html")}">FAQ</a>
          </div>
          <div class="footer-col">
            <h4>Help</h4>
            <a href="${legal("shipping.html")}">Shipping</a>
            <a href="${legal("returns.html")}">Returns</a>
            <a href="${href("about.html")}#contact">Contact</a>
          </div>
          <div class="footer-notes">
            <h4>Notes on a well-kept home</h4>
            <p class="muted">Footer only — no first-visit popup.</p>
            <form onsubmit="event.preventDefault();">
              <input type="email" placeholder="Email" aria-label="Email" />
              <button type="submit" class="btn btn--secondary">Join</button>
            </form>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} Aeva Essentials</span>
          <span><a href="${legal("privacy.html")}">Privacy</a> · <a href="${legal("terms.html")}">Terms</a></span>
        </div>
      </div>
    </footer>`;
  }

  function cartHTML() {
    return `
    <div class="cart-backdrop" data-close-cart></div>
    <aside class="cart-drawer" aria-label="Cart" aria-modal="true" role="dialog" style="background:#f5f2ea!important;background-color:#f5f2ea!important">
      <div class="cart-drawer__header" style="background:#f5f2ea!important;background-color:#f5f2ea!important">
        <h2>Cart</h2>
        <button type="button" data-close-cart aria-label="Close cart">✕</button>
      </div>
      <div class="cart-drawer__body" data-cart-lines style="background:#f5f2ea!important;background-color:#f5f2ea!important"></div>
      <div class="cart-drawer__footer" data-cart-footer style="background:#f5f2ea!important;background-color:#f5f2ea!important"></div>
    </aside>`;
  }

  if (window.AEVA) window.AEVA.basePath = BASE;

  const mount = document.querySelector("[data-aeva-chrome]");
  if (!mount) return;
  const active = mount.getAttribute("data-aeva-chrome") || "";
  const headerMount = document.getElementById("site-header-mount");
  const footerMount = document.getElementById("site-footer-mount");
  const cartMount = document.getElementById("cart-mount");
  if (headerMount) headerMount.innerHTML = headerHTML(active);
  if (footerMount) footerMount.innerHTML = footerHTML();
  if (cartMount) cartMount.innerHTML = cartHTML();

  bindMegas();
  bindHeaderScroll();

  document.querySelectorAll("[data-proto-chrome], .prototype-chip, [data-pack-switcher]").forEach((el) => el.remove());

  function bindMegas() {
    const header = document.querySelector(".site-header");
    const root = header && header.querySelector("[data-megas]");
    if (!header || !root) return;
    const triggers = header.querySelectorAll("[data-mega-trigger]");
    const panels = root.querySelectorAll("[data-mega]");
    let closeTimer = 0;
    let current = "";

    const stillInside = () => header.matches(":hover") || root.matches(":hover");

    const open = (key) => {
      if (!key) return;
      window.clearTimeout(closeTimer);
      current = key;
      header.classList.add("is-mega-open");
      triggers.forEach((t) => {
        const on = t.getAttribute("data-mega-trigger") === key;
        t.classList.toggle("is-mega-on", on);
        t.setAttribute("aria-expanded", on ? "true" : "false");
      });
      panels.forEach((p) => {
        const on = p.getAttribute("data-mega") === key;
        p.hidden = !on;
        p.classList.toggle("is-open", on);
      });
    };
    const close = () => {
      current = "";
      header.classList.remove("is-mega-open");
      triggers.forEach((t) => {
        t.classList.remove("is-mega-on");
        t.setAttribute("aria-expanded", "false");
      });
      panels.forEach((p) => {
        p.hidden = true;
        p.classList.remove("is-open");
      });
    };
    const scheduleClose = () => {
      window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(() => {
        if (stillInside()) return;
        close();
      }, 160);
    };

    triggers.forEach((t) => {
      t.addEventListener("mouseenter", () => open(t.getAttribute("data-mega-trigger")));
      t.addEventListener("focus", () => open(t.getAttribute("data-mega-trigger")));
    });
    header.addEventListener("mouseenter", () => window.clearTimeout(closeTimer));
    header.addEventListener("mouseleave", scheduleClose);
    root.addEventListener("mouseenter", () => {
      window.clearTimeout(closeTimer);
      if (current) open(current);
    });
    root.addEventListener("mouseleave", scheduleClose);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
    document.addEventListener("click", (event) => {
      if (!header.contains(event.target) && !root.contains(event.target)) close();
    });

    const boot = new URLSearchParams(location.search).get("mega");
    if (boot) open(boot);
  }

  function bindHeaderScroll() {
    const chrome = document.querySelector(".site-chrome");
    const header = document.querySelector(".site-header");
    if (!chrome || !header) return;
    const isHome = document.body.getAttribute("data-aeva-chrome") === "home";
    let lastY = window.scrollY;
    let ticking = false;

    function isBusy() {
      return (
        header.classList.contains("is-mega-open") ||
        !!header.querySelector(".header-search-wrap:focus-within") ||
        !!document.querySelector(".cart-drawer.is-open") ||
        !!(document.querySelector("[data-nav-sheet]") && !document.querySelector("[data-nav-sheet]").hidden)
      );
    }

    function setHomeOverlay(compact) {
      if (!isHome) return;
      const y = window.scrollY;
      const overlay = !compact && y < 40;
      if (overlay) {
        if (!header.classList.contains("is-overlay")) {
          header.classList.add("is-overlay");
          header.classList.remove("is-solid");
        }
      } else if (!header.classList.contains("is-solid")) {
        header.classList.add("is-solid");
        header.classList.remove("is-overlay");
      }
    }

    function apply() {
      const y = Math.max(0, window.scrollY);
      const dy = y - lastY;
      const atTop = y < 24;
      const busy = isBusy();
      if (busy) {
        chrome.classList.remove("is-hidden");
        chrome.classList.toggle("is-compact", !atTop);
      } else if (atTop) {
        chrome.classList.remove("is-hidden", "is-compact");
      } else if (dy > 10 && y > 80) {
        chrome.classList.add("is-hidden");
        chrome.classList.remove("is-compact");
      } else if (dy < -10) {
        chrome.classList.remove("is-hidden");
        chrome.classList.add("is-compact");
      }
      lastY = y;
      setHomeOverlay(chrome.classList.contains("is-compact") || chrome.classList.contains("is-hidden"));
    }

    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          apply();
          ticking = false;
        });
      },
      { passive: true }
    );
    window.addEventListener("resize", apply);
    apply();
  }

  document.querySelector("[data-close-announcement]")?.addEventListener("click", () => {
    const bar = document.querySelector("[data-announcement]");
    if (bar) bar.hidden = true;
  });

  function openNav() {
    const sheet = document.querySelector("[data-nav-sheet]");
    if (!sheet) return;
    sheet.hidden = false;
    sheet.classList.add("is-open");
    document.body.style.overflow = "hidden";
    document.querySelector("[data-open-nav]")?.setAttribute("aria-expanded", "true");
  }
  function closeNav() {
    const sheet = document.querySelector("[data-nav-sheet]");
    if (!sheet) return;
    sheet.hidden = true;
    sheet.classList.remove("is-open");
    document.body.style.overflow = "";
    document.querySelector("[data-open-nav]")?.setAttribute("aria-expanded", "false");
  }

  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-open-nav]")) {
      e.preventDefault();
      openNav();
    }
    if (e.target.closest("[data-close-nav]")) {
      e.preventDefault();
      closeNav();
    }
    if (e.target.closest("[data-open-cart]")) {
      e.preventDefault();
      if (window.Cart) window.Cart.open();
    }
    if (e.target.closest("[data-close-cart]")) {
      e.preventDefault();
      if (window.Cart) window.Cart.close();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeNav();
      if (window.Cart) window.Cart.close();
    }
  });

  document.dispatchEvent(new CustomEvent("aeva:chrome-ready"));
  if (window.Cart && typeof window.Cart.render === "function") window.Cart.render();
})();

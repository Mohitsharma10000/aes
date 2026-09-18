/**
 * Spec cart — aeva.spec.cart.v1
 * TBD prices cannot be added. Free-ship bar is rupees vs rupees.
 */
(function () {
  const STORAGE_KEY = "aeva.spec.cart.v1";
  const VERSION = 1;

  function A() {
    return window.AEVA;
  }

  function lineKey(productId, sizeId, format) {
    return [productId, sizeId, format].join(":");
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { version: VERSION, lines: [] };
      const data = JSON.parse(raw);
      if (!data || !Array.isArray(data.lines)) return { version: VERSION, lines: [] };
      return { version: VERSION, lines: data.lines };
    } catch (e) {
      return { version: VERSION, lines: [] };
    }
  }

  function save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  const Cart = {
    _state: null,
    _lastAdded: null,

    _getState() {
      if (!this._state) this._state = load();
      return this._state;
    },

    _persist() {
      save(this._getState());
      this.render();
      document.dispatchEvent(
        new CustomEvent("aeva:cart-change", {
          detail: { lines: this.getLines(), subtotal: this.subtotal(), count: this.count() },
        })
      );
    },

    getLines() {
      return this._getState().lines.slice();
    },

    count() {
      return this._getState().lines.reduce((n, l) => n + l.qty, 0);
    },

    subtotal() {
      return this._getState().lines.reduce((n, l) => n + (l.tbd ? 0 : l.price * l.qty), 0);
    },

    hasTbd() {
      return this._getState().lines.some((l) => l.tbd);
    },

    add(opts) {
      const catalog = A();
      if (!catalog) return null;
      const product = catalog.getProduct(opts.productId);
      if (!product) return null;
      const format = catalog.normalizeFormat(opts.format) || opts.format || "default";
      const sizeId = catalog.normalizeSizeId(opts.sizeId) || opts.sizeId || (product.merchPath === "formula" ? "bottle" : "default");
      const size = catalog.getSize(product, sizeId) || catalog.getSize(product, format);
      if (!size) return null;
      if (catalog.isTbd(size) || catalog.isTbd(product)) {
        if (window.AevaUI) window.AevaUI.showToast("Price to come");
        return null;
      }
      const qty = Math.max(1, parseInt(opts.qty, 10) || 1);
      const key = lineKey(product.id, size.id, format);
      const state = this._getState();
      const existing = state.lines.find((l) => l.key === key);
      if (existing) existing.qty += qty;
      else {
        state.lines.push({
          key: key,
          productId: product.id,
          merchPath: product.merchPath,
          formulaKey: product.formulaKey || null,
          slug: product.slug,
          name: product.name,
          sizeId: size.id,
          format: format,
          label: size.label,
          price: size.price,
          tbd: false,
          qty: qty,
        });
      }
      this._lastAdded = { productId: product.id, format: format, merchPath: product.merchPath };
      this._persist();
      return true;
    },

    addFromElement(el) {
      return this.add({
        productId: el.getAttribute("data-product-id"),
        sizeId: el.getAttribute("data-size-id"),
        format: el.getAttribute("data-format"),
        qty: el.getAttribute("data-qty") || "1",
      });
    },

    addKit(kitId) {
      return this.add({ productId: kitId, sizeId: "default", format: "default" });
    },

    setQty(key, qty) {
      const n = parseInt(qty, 10);
      const state = this._getState();
      const line = state.lines.find((l) => l.key === key);
      if (!line) return;
      if (!n || n < 1) this.remove(key);
      else {
        line.qty = n;
        this._persist();
      }
    },

    remove(key) {
      const state = this._getState();
      state.lines = state.lines.filter((l) => l.key !== key);
      this._persist();
    },

    clear() {
      this._state = { version: VERSION, lines: [] };
      this._persist();
    },

    open() {
      document.querySelector(".cart-drawer")?.classList.add("is-open");
      document.querySelector(".cart-backdrop")?.classList.add("is-open");
      document.body.style.overflow = "hidden";
    },

    close() {
      document.querySelector(".cart-drawer")?.classList.remove("is-open");
      document.querySelector(".cart-backdrop")?.classList.remove("is-open");
      document.body.style.overflow = "";
    },

    _shipHTML(catalog) {
      const threshold = (catalog.siteContent && catalog.siteContent.freeShipInr) || 499;
      const sub = this.subtotal();
      const remaining = Math.max(0, threshold - sub);
      const pct = threshold ? Math.min(100, Math.round((sub / threshold) * 100)) : 0;
      if (sub >= threshold && sub > 0) {
        return `<div class="cart-ship"><p>Free shipping on this order.</p><div class="cart-ship__bar"><div class="cart-ship__fill" style="width:100%"></div></div></div>`;
      }
      const remainStr = catalog.formatPrice(remaining);
      return `<div class="cart-ship"><p>${
        sub === 0
          ? "You're " + catalog.formatPrice(threshold) + " from free shipping."
          : "You're " + remainStr + " from free shipping."
      }</p><div class="cart-ship__bar"><div class="cart-ship__fill" style="width:${pct}%"></div></div></div>`;
    },

    _upsellHTML(catalog) {
      const last = this._lastAdded;
      const lines = this.getLines();
      if (!last && !lines.length) return "";

      const lastLine = last
        ? lines.filter((l) => l.productId === last.productId).slice(-1)[0]
        : lines[lines.length - 1];
      if (!lastLine) return "";

      if (lastLine.merchPath === "formula" && lastLine.format === "bottle") {
        const p = catalog.getProduct(lastLine.productId);
        if (p && !lines.some((l) => l.productId === p.id && l.format === "pouch")) {
          return `<div class="cart-upsell">
            <p>1 L pouch for ${p.name}?</p>
            <button type="button" class="btn btn--secondary" data-add-cart data-product-id="${p.id}" data-size-id="pouch" data-format="pouch" disabled>Price to come</button>
          </div>`;
        }
      }

      const sets = catalog.listSets().filter((s) => (s.includes || []).length === 2);
      for (let i = 0; i < sets.length; i++) {
        const set = sets[i];
        const bottles = lines.filter((l) => l.format === "bottle" && set.includes.indexOf(l.productId) !== -1);
        const present = new Set(bottles.map((l) => l.productId));
        if (present.size === 1) {
          const missingId = set.includes.find((id) => !present.has(id));
          const missing = catalog.getProduct(missingId);
          if (missing) {
            return `<div class="cart-upsell">
              <p>Add ${missing.name} to complete ${set.name}.</p>
              <button type="button" class="btn btn--secondary" data-add-cart data-product-id="${missing.id}" data-size-id="bottle" data-format="bottle" disabled>Price to come</button>
            </div>`;
          }
        }
      }
      return "";
    },

    render() {
      const catalog = A();
      document.querySelectorAll(".cart-count").forEach((el) => {
        const n = this.count();
        el.textContent = "(" + n + ")";
        el.hidden = false;
      });
      const body = document.querySelector("[data-cart-lines]");
      const footer = document.querySelector("[data-cart-footer]");
      if (!body || !catalog) return;
      const lines = this.getLines();

      if (!lines.length) {
        const picks = [catalog.getProduct("kitchen-set"), catalog.listFormulas()[0], catalog.listFormulas()[1]].filter(Boolean);
        const tiles =
          window.AevaCards && picks.length
            ? `<div class="cart-empty-grid">${picks.map((p) => window.AevaCards.cardHTML(p)).join("")}</div>`
            : `<a class="btn btn--secondary" href="shop.html" data-close-cart>Shop the essentials</a>`;
        body.innerHTML = `
          <div class="cart-empty">
            <p class="cart-empty__title">Your cart is empty.</p>
            <p class="cart-empty__hint">Start with a kit or a daily bottle.</p>
            ${tiles}
          </div>`;
        if (footer) {
          footer.innerHTML =
            this._shipHTML(catalog) +
            `<p class="cart-footnote">UPI and COD available at checkout.</p>
             <button type="button" class="btn btn--primary btn--full" disabled>Checkout</button>
             <button type="button" class="btn btn--ghost btn--full" data-close-cart>Continue shopping</button>`;
        }
        return;
      }

      body.innerHTML = lines
        .map((l) => {
          const p = catalog.getProduct(l.productId);
          const img = p ? catalog.productImage(p, l.format, l.sizeId) : "";
          const media = img ? `<img src="${img}" alt="" />` : "";
          return `<div class="cart-line" data-key="${l.key}">
            <div class="cart-line__media">${media}</div>
            <div>
              <p>${l.name}</p>
              <p class="muted">${l.label}</p>
              <p>${l.tbd ? "₹—" : catalog.formatPrice(l.price * l.qty)}</p>
              <div class="cart-qty">
                <button type="button" data-qty-delta="-1" data-key="${l.key}">−</button>
                <span>${l.qty}</span>
                <button type="button" data-qty-delta="1" data-key="${l.key}">+</button>
                <button type="button" data-remove-line data-key="${l.key}">Remove</button>
              </div>
            </div>
          </div>`;
        })
        .join("");

      if (footer) {
        const sub = this.subtotal();
        footer.innerHTML =
          this._shipHTML(catalog) +
          this._upsellHTML(catalog) +
          `<p>Subtotal ${sub ? catalog.formatPrice(sub) : "₹—"}</p>
           <p class="cart-footnote">Inclusive of taxes. UPI and COD available at checkout.</p>
           <a class="btn btn--primary btn--full" href="checkout.html">Checkout</a>
           <button type="button" class="btn btn--ghost btn--full" data-close-cart>Continue shopping</button>`;
      }
    },
  };

  document.addEventListener("click", (e) => {
    const atc = e.target.closest("[data-add-to-cart], [data-add-cart]");
    if (atc && atc.getAttribute("data-product-id")) {
      e.preventDefault();
      if (atc.disabled) return;
      const ok = Cart.addFromElement(atc);
      if (ok) {
        if (window.AevaUI) window.AevaUI.showToast("Added.");
        Cart.open();
      }
    }
    const delta = e.target.closest("[data-qty-delta]");
    if (delta) {
      const key = delta.getAttribute("data-key");
      const line = Cart.getLines().find((l) => l.key === key);
      if (line) Cart.setQty(key, line.qty + parseInt(delta.getAttribute("data-qty-delta"), 10));
    }
    const rm = e.target.closest("[data-remove-line]");
    if (rm) Cart.remove(rm.getAttribute("data-key"));
  });

  window.Cart = Cart;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => Cart.render());
  } else {
    Cart.render();
  }
})();

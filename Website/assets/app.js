/* Shared mockup interactions (PR-03: cart handled by cart.js) */
(function () {
  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }
  function qsa(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  function showToast(msg) {
    let t = qs(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("is-visible");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("is-visible"), 1600);
  }

  window.AevaUI = {
    showToast,
    openCart() {
      if (window.Cart) window.Cart.open();
    },
    closeCart() {
      if (window.Cart) window.Cart.close();
    },
  };

  // Size selector on static markup (PDP also rebinds after inject)
  qsa(".size-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      const group = btn.parentElement;
      qsa(".size-option", group).forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const price = btn.dataset.price;
      const helper = btn.dataset.helper;
      const format = btn.dataset.format;
      const sizeId = btn.dataset.sizeId || btn.getAttribute("data-size-id");
      const priceEl = qs("[data-pdp-price]");
      const helperEl = qs("[data-size-helper]");
      const img = qs("[data-pdp-image]");
      const atc = qs("[data-add-cart][data-product-id], [data-add-to-cart]");

      if (priceEl && price && window.AEVA) {
        priceEl.textContent = window.AEVA.formatPrice(parseInt(price, 10));
      }
      if (helperEl && helper) helperEl.textContent = helper;
      if (img && window.AEVA && img.dataset.productId) {
        const p = window.AEVA.getProduct(img.dataset.productId);
        if (p) {
          img.dataset.assetTry = "0";
          const next = window.AEVA.productImage(p, format, sizeId);
          const name = window.AEVA.filenameFromUrl(next);
          if (name) img.dataset.asset = name;
          img.src = next;
        }
      }
      // Keep ATC payload in sync with size selection
      if (atc) {
        if (sizeId) atc.setAttribute("data-size-id", sizeId);
        if (format) atc.setAttribute("data-format", format);
        if (btn.dataset.sku) atc.setAttribute("data-sku", btn.dataset.sku);
      }
    });
  });

  // Cosmetic filter chips (PR-05 will make real)
  qsa(".filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      chip.classList.toggle("is-active");
    });
  });

})();


  // PR-13 — lightweight analytics stubs
  function track(event, detail) {
    const payload = { event, detail: detail || {}, t: Date.now() };
    console.debug("[aeva:analytics]", payload);
    document.dispatchEvent(new CustomEvent("aeva:analytics", { detail: payload }));
  }
  document.addEventListener("aeva:cart-change", (e) => track("cart_change", e.detail));
  document.addEventListener("aeva:filter", (e) => track("filter", e.detail));
  document.addEventListener("aeva:view_item", (e) => track("view_item", e.detail));
  document.addEventListener("aeva:purchase", (e) => track("purchase", e.detail));
  window.AevaTrack = track;

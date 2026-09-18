/**
 * PR-09 — Checkout mock flow
 * Ship: standard 79 / express 149 / free ≥1499
 * Orders: localStorage aeva.kitchen.orders.v1
 */
(function () {
  const FREE_OVER = 1499;
  const ORDERS_KEY = "aeva.kitchen.orders.v1";

  function money(n) {
    return window.AEVA.formatPrice(n);
  }

  function shipCost(subtotal, method) {
    if (method === "free" || (method === "standard" && subtotal >= FREE_OVER)) {
      if (subtotal >= FREE_OVER) return 0;
    }
    if (method === "express") return 149;
    if (method === "free") return subtotal >= FREE_OVER ? 0 : 79;
    return 79;
  }

  function selectedShipMethod() {
    const el = document.querySelector('input[name="shipping"]:checked');
    return el ? el.value : "standard";
  }

  function renderSummary() {
    if (!window.Cart || !window.AEVA) return;
    const lines = Cart.getLines();
    const sub = Cart.subtotal();
    const method = selectedShipMethod();
    let ship = shipCost(sub, method);

    // Enable free radio only when eligible
    const freeRadio = document.querySelector('input[name="shipping"][value="free"]');
    const freeOpt = document.getElementById("ship-free-option");
    if (freeRadio && freeOpt) {
      const eligible = sub >= FREE_OVER;
      freeRadio.disabled = !eligible;
      freeOpt.style.opacity = eligible ? "1" : "0.45";
      if (!eligible && method === "free") {
        const std = document.querySelector('input[name="shipping"][value="standard"]');
        if (std) std.checked = true;
        ship = shipCost(sub, "standard");
      }
      if (eligible && method === "standard") {
        // still show free as available; cost 0 if they switch
      }
    }

    // If subtotal >= free and standard selected, shipping is free
    if (selectedShipMethod() === "standard" && sub >= FREE_OVER) ship = 0;
    if (selectedShipMethod() === "free" && sub >= FREE_OVER) ship = 0;

    const linesEl = document.querySelector("[data-checkout-lines]");
    if (linesEl) {
      if (!lines.length) {
        linesEl.innerHTML = `<p class="muted">Your cart is empty. <a href="shop.html">Shop essentials</a></p>`;
      } else {
        const A = window.AEVA;
        linesEl.innerHTML = lines
          .map((l) => {
            const sell = l.price * l.qty;
            const list = l.listPrice != null ? l.listPrice * l.qty : null;
            let priceHtml;
            if (A && A.priceHTML) {
              priceHtml = A.priceHTML(sell, list);
            } else if (list != null && list > sell) {
              priceHtml = `<span class="price-compare">${money(list)}</span> ${money(sell)}`;
            } else {
              priceHtml = money(sell);
            }
            return `
          <div class="checkout-summary-line">
            <span>${l.name} × ${l.qty}<br><span class="muted" style="font-size:12px">${l.label}</span></span>
            <span class="checkout-line-price">${priceHtml}</span>
          </div>`;
          })
          .join("");
      }
    }

    const set = (sel, val) => {
      const el = document.querySelector(sel);
      if (el) el.textContent = val;
    };
    set("[data-checkout-subtotal]", money(sub));
    set(
      "[data-checkout-shipping]",
      ship === 0 && sub > 0 ? "Free" : money(ship)
    );
    set("[data-checkout-total]", money(sub + ship));

    const save = Cart.savings ? Cart.savings() : 0;
    const saveRow = document.querySelector("[data-checkout-savings-row]");
    const saveEl = document.querySelector("[data-checkout-savings]");
    if (saveRow && saveEl) {
      if (save > 0) {
        saveRow.hidden = false;
        saveEl.textContent = money(save);
      } else {
        saveRow.hidden = true;
        saveEl.textContent = "—";
      }
    }
  }

  function placeOrder(form) {
    const lines = Cart.getLines();
    if (!lines.length) {
      if (window.AevaUI) AevaUI.showToast("Your cart is empty.");
      return;
    }
    const sub = Cart.subtotal();
    const method = selectedShipMethod();
    let ship = shipCost(sub, method);
    if (method === "standard" && sub >= FREE_OVER) ship = 0;
    if (method === "free" && sub >= FREE_OVER) ship = 0;

    const orderId = "AEVA-" + Date.now().toString(36).toUpperCase();
    const order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      mock: true,
      email: form.email.value,
      shippingMethod: method,
      payment: form.payment.value,
      lines: lines.map((l) => ({ ...l })),
      subtotal: sub,
      shipping: ship,
      total: sub + ship,
      address: {
        name: form.name.value,
        line1: form.line1.value,
        city: form.city.value,
        pincode: form.pincode.value,
        state: form.state.value,
        phone: form.phone.value,
      },
    };

    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(order);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(list.slice(0, 20)));
    } catch (e) {
      console.warn(e);
    }

    document.dispatchEvent(new CustomEvent("aeva:purchase", { detail: { orderId, total: order.total } }));
    Cart.clear();
    location.href = "checkout-success.html?order=" + encodeURIComponent(orderId);
  }

  function boot() {
    if (!document.getElementById("checkout-form")) return;

    if (!Cart.getLines().length) {
      renderSummary();
    } else {
      renderSummary();
    }

    document.querySelectorAll('input[name="shipping"]').forEach((r) => {
      r.addEventListener("change", renderSummary);
    });

    document.getElementById("checkout-form").addEventListener("submit", (e) => {
      e.preventDefault();
      placeOrder(e.target);
    });

    document.addEventListener("aeva:cart-change", renderSummary);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else setTimeout(boot, 0);
})();

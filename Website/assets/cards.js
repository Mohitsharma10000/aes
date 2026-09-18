(function () {
  function A() {
    return window.AEVA;
  }

  function scentLine(p) {
    const scent = A().scentOf(p.formulaKey);
    const label = p.scentName ? p.scentName : "Scent to come";
    if (!p.formulaKey) return "";
    return `<div class="product-card__scent"><span class="scent-chip" style="background:${scent.hex}"></span> ${label}</div>`;
  }

  function eyebrow(p, opts) {
    opts = opts || {};
    const fmt = window.AEVA && window.AEVA.normalizeFormat(opts.format);
    if (fmt === "pouch" || (p.merchPath === "formula" && opts.format === "pouch")) return "Restock";
    if (p.merchPath === "starter") return "Start";
    if (p.merchPath === "room-set" && p.kitFamily === "house") return "House";
    if (p.merchPath === "room-set") return "Starter Kit";
    if (p.merchPath === "restock") return "Restock";
    if (p.merchPath === "accessory") return "Accessory";
    if (p.merchPath === "formula") return "Essentials";
    return "Formula";
  }

  function cardHref(p, opts) {
    const Aeva = A();
    if (Aeva.productHref.length > 1) return Aeva.productHref(p, opts.format);
    return Aeva.productHref(p);
  }

  function cardHTML(p, opts) {
    opts = opts || {};
    const Aeva = A();
    const defaultFormat = opts.format || (p.merchPath === "formula" ? "bottle" : "default");
    const href = cardHref(p, { format: defaultFormat });
    const tbd = Aeva.isTbd(p) || (p.sizes && p.sizes.every((s) => Aeva.isTbd(s)));
    const img = Aeva.productImage(p, defaultFormat);
    const media = img
      ? `<img src="${img}" alt="${p.name}, ${p.scentCharacter || "product"}" />`
      : Aeva.paperWellHTML(p);
    const sizeId = defaultFormat === "pouch" || defaultFormat === "bottle" ? defaultFormat : "default";
    const atc = tbd
      ? `<a class="product-card__atc product-card__atc--coming" href="${href}">View formula <span aria-hidden="true">→</span></a>`
      : `<button type="button" class="product-card__atc" data-add-cart data-product-id="${p.id}" data-size-id="${sizeId}" data-format="${defaultFormat}">Add to cart</button>`;
    const scentStyle = p.scentHex ? ` style="--scent:${p.scentHex}"` : "";
    const short =
      p.merchPath === "formula" && defaultFormat === "pouch"
        ? "Restock 1000 ml. Keep the bottle."
        : p.short;

    return `<article class="product-card" data-product-id="${p.id}" data-merch="${p.merchPath}" data-format="${defaultFormat}"${scentStyle}>
      <a class="product-card__media" href="${href}">${media}</a>
      <div class="product-card__body">
        <p class="product-card__eyebrow">${eyebrow(p, { format: defaultFormat })}</p>
        <a class="product-card__name" href="${href}">${p.name}</a>
        ${short ? `<p class="product-card__short">${short}</p>` : scentLine(p)}
        <div class="product-card__price">₹—</div>
        ${atc}
      </div>
    </article>`;
  }

  document.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-card-format]");
    if (!chip) return;
    const card = chip.closest(".product-card");
    if (!card) return;
    e.preventDefault();
    e.stopPropagation();
    const format = chip.getAttribute("data-card-format");
    card.querySelectorAll("[data-card-format]").forEach((c) => c.classList.toggle("is-active", c === chip));
    const atc = card.querySelector("[data-add-cart]");
    if (atc) {
      atc.setAttribute("data-format", format);
      atc.setAttribute("data-size-id", format);
    }
    const imgEl = card.querySelector(".product-card__media img");
    const Aeva = window.AEVA;
    const p = Aeva && Aeva.getProduct(card.getAttribute("data-product-id"));
    if (imgEl && p) imgEl.src = Aeva.productImage(p, format);
  });

  window.AevaCards = { cardHTML: cardHTML, scentLine: scentLine, eyebrow: eyebrow };
})();

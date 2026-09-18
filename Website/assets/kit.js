(function () {
  const A = window.AEVA;
  const root = document.getElementById("kit-root");
  if (!A || !root) return;
  const id = new URLSearchParams(location.search).get("id") || "kitchen-set";
  const p = A.getProduct(id);
  if (!p || (p.merchPath !== "room-set" && p.merchPath !== "starter")) {
    root.innerHTML = `<div class="shop-page"><p>Not found.</p></div>`;
    return;
  }
  document.title = p.name + " — Aeva Essentials";
  const isSet = p.merchPath === "room-set";
  const threshold = (A.siteContent && A.siteContent.freeShipInr) || 499;
  const contents = (p.contents || []).map((c) => {
    const item = A.getProduct(c.productId);
    const fmt = c.format === "pouch" ? "pouch" : c.format === "default" ? "default" : "bottle";
    return { item: item, format: fmt, label: item ? item.name + (fmt && fmt !== "default" ? " · " + fmt : "") : c.productId };
  });

  const include = contents
    .map((c) => {
      if (!c.item) return `<li>${c.label}</li>`;
      const img = A.productImage(c.item, c.format === "default" ? undefined : c.format);
      return `<li class="bb-include">
        <a href="${A.productHref(c.item)}">
          ${img ? `<img src="${img}" alt="" />` : ""}
          <span>
            <strong>${c.label}</strong>
            <em>See product</em>
          </span>
        </a>
      </li>`;
    })
    .join("");

  const also = isSet
    ? A.listSets().filter((s) => s.id !== p.id).slice(0, 3)
    : A.listStarters().filter((s) => s.id !== p.id).slice(0, 3);
  const alsoHTML =
    window.AevaCards && also.length
      ? `<section class="bb-pdp__also"><h2>Also in the range</h2><div class="bb-panel">${also.map((item) => window.AevaCards.cardHTML(item)).join("")}</div></section>`
      : "";

  root.innerHTML = `
    <nav class="bb-crumb" aria-label="Breadcrumb">
      <a href="shop.html">Shop</a><span aria-hidden="true">/</span>
      <a href="${isSet ? "shop.html#shop-sets" : "shop.html#shop-starters"}">${isSet ? "Sets" : "Starters"}</a><span aria-hidden="true">/</span>
      <span>${p.name}</span>
    </nav>
    <article class="bb-pdp">
      <div class="bb-pdp__gallery">
        <div class="bb-pdp__stage">
          <img src="${A.productImage(p)}" alt="${p.name}" />
        </div>
      </div>
      <div class="bb-pdp__buy">
        <p class="product-card__eyebrow">${isSet ? "By room" : "Starter"}</p>
        <h1>${p.name}</h1>
        <p class="bb-pdp__lede">${p.short || ""}</p>
        <a class="btn btn--secondary btn--full" href="shop.html#shop-kits">Explore the collection <span aria-hidden="true">→</span></a>
        <p class="bb-pdp__trust">Free shipping over ₹${Number(threshold).toLocaleString("en-IN")} · 30-day note</p>
        <p class="bb-pdp__yield">Refill each formula with its own 1 L pouch.</p>
        <details class="bb-pdp__acc" open>
          <summary>What's included</summary>
          <div class="bb-pdp__acc-body"><ul class="bb-include-list">${include}</ul></div>
        </details>
        <details class="bb-pdp__acc">
          <summary>How it works</summary>
          <div class="bb-pdp__acc-body">
            <p>${isSet ? "Bottles plus the tools for those jobs. Refill each formula when you run out." : p.helper || "Bottle, pouch, and the matching tool."}</p>
          </div>
        </details>
        ${
          p.formulaId
            ? `<p><a href="product.html?id=${p.formulaId}">See ${A.getProduct(p.formulaId).name}</a></p>`
            : ""
        }
        <div class="bb-pdp__faq"><h2>Questions</h2>${A.faqHTML()}</div>
      </div>
    </article>
    ${alsoHTML}`;
})();

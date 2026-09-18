(function () {
  const A = window.AEVA;
  if (!A) return;
  const root = document.getElementById("pdp-root") || document.getElementById("kit-root");
  if (!root) return;

  const params = new URLSearchParams(location.search);
  const id = params.get("id") || "dishwash";
  const p = A.getProduct(id);
  if (!p) {
    root.innerHTML = `<div class="shop-page"><p>Product not found.</p><p><a href="shop.html">Shop the range</a></p></div>`;
    return;
  }

  document.title = p.name + " — Aeva Essentials";
  const threshold = (A.siteContent && A.siteContent.freeShipInr) || 499;
  const tbd = A.isTbd(p);
  const atcLabel = tbd ? "Explore the collection" : "Add to cart";
  const path = p.merchPath;

  function crumb(trail) {
    return `<nav class="bb-crumb" aria-label="Breadcrumb">${trail
      .map((c, i) =>
        i < trail.length - 1
          ? `<a href="${c.href}">${c.label}</a><span aria-hidden="true">/</span>`
          : `<span>${c.label}</span>`
      )
      .join("")}</nav>`;
  }

  function trust() {
    return `<div class="pdp-trust">
      <p><span>Free shipping</span>On orders over ₹${Number(threshold).toLocaleString("en-IN")}</p>
      <p><span>30-day note</span>If it is not right for your home, tell us.</p>
    </div>`;
  }

  function acc(rows) {
    return `<div class="bb-pdp__accs">${rows
      .filter((row) => row && (row.html || row.body))
      .map(
        (row, i) =>
          `<details class="bb-pdp__acc"${i === 0 ? " open" : ""}><summary>${row.title}</summary><div class="bb-pdp__acc-body">${
            row.html || `<p>${row.body}</p>`
          }</div></details>`
      )
      .join("")}</div>`;
  }

  function alsoBlock(title, items, heading) {
    const list = (items || []).filter(Boolean).slice(0, 8);
    if (!list.length || !window.AevaCards) return "";
    const label = heading || title;
    const cards = list.map((item) => window.AevaCards.cardHTML(item.p || item, item.format ? { format: item.format } : {})).join("");
    const carousel = /you may also like/i.test(label);
    if (carousel) {
      return `<section class="also-like bb-pdp__also" data-also-carousel>
        <h2>You May Also Like</h2>
        <div class="also-like__viewport">
          <div class="also-like__track">${cards}</div>
        </div>
      </section>`;
    }
    return `<section class="bb-pdp__also">
      <p class="bb-kicker">${title}</p>
      <h2>${label}</h2>
      <div class="bb-panel">${cards}</div>
    </section>`;
  }

  function usedLine(product) {
    const jobs = (product && product.usedFor) || [];
    if (!jobs.length) return "";
    return `<p class="pdp-used">${jobs.join(" · ")}</p>`;
  }

  function contentsLine(product) {
    const names = (product.contents || []).map((c) => A.contentLabel(c)).filter(Boolean);
    if (!names.length) return "";
    return `<p class="pdp-used">${names.join(" · ")}</p>`;
  }

  function quoteBlock(productId) {
    const reviews = A.getPublishedReviews ? A.getPublishedReviews(productId) : [];
    const r = reviews[0];
    if (!r) return "";
    return `<blockquote class="pdp-quote"><p>“${r.quote}”</p><cite>${r.by}${r.city ? ", " + r.city : ""}</cite></blockquote>`;
  }

  function bindSticky(name, productId, sizeId, format) {
    const sticky = document.getElementById("pdp-sticky");
    if (!sticky) return;
    const nameEl = sticky.querySelector("[data-sticky-name]");
    const priceEl = sticky.querySelector("[data-sticky-price]");
    const btn = sticky.querySelector("[data-sticky-atc]");
    if (nameEl) nameEl.textContent = name;
    if (priceEl) priceEl.textContent = "₹—";
    if (btn) {
      btn.setAttribute("data-add-cart", "");
      btn.setAttribute("data-product-id", productId);
      btn.setAttribute("data-size-id", sizeId);
      btn.setAttribute("data-format", format);
      btn.disabled = tbd;
      btn.textContent = atcLabel;
    }
    const atc = root.querySelector(".bb-pdp__buy [data-add-cart]");
    if (!atc) {
      sticky.hidden = true;
      sticky.classList.remove("is-visible");
      return;
    }
    function updateSticky() {
      const rect = atc.getBoundingClientRect();
      const past = rect.bottom < 72;
      sticky.hidden = !past;
      sticky.classList.toggle("is-visible", past);
      document.body.classList.toggle("has-pdp-sticky", past);
    }
    updateSticky();
    if (root._stickyOnScroll) {
      window.removeEventListener("scroll", root._stickyOnScroll);
      window.removeEventListener("resize", root._stickyOnScroll);
    }
    root._stickyOnScroll = updateSticky;
    window.addEventListener("scroll", updateSticky, { passive: true });
    window.addEventListener("resize", updateSticky);
  }

  function contentItems(product) {
    return (product.contents || [])
      .map((c) => {
        const item = A.getProduct(c.productId);
        if (!item) return null;
        const fmt = c.format === "pouch" ? "pouch" : c.format === "default" ? "default" : "bottle";
        return { item: item, format: fmt, size: fmt === "default" ? A.getSize(item, "default") : A.getSize(item, fmt) };
      })
      .filter(Boolean);
  }

  function includeList(product) {
    return (product.contents || [])
      .map((raw) => {
        const item = A.getProduct(raw.productId);
        if (!item) return "";
        const fmt = raw.format === "pouch" ? "pouch" : raw.format === "default" ? "default" : "bottle";
        const img = A.productImage(item, fmt === "default" ? undefined : fmt);
        const label = A.contentLabel(raw);
        return `<li class="bb-include">
          <a href="${A.productHref(item, fmt)}">
            ${img ? `<img src="${img}" alt="" />` : ""}
            <span><strong>${label}</strong><em>See product</em></span>
          </a>
        </li>`;
      })
      .join("");
  }

  function includeGrid(product, kicker, heading) {
    const rows = product.contents || [];
    if (!rows.length) return "";
    return `<section class="pdp-kit">
      <p class="bb-kicker">${kicker}</p>
      <h2>${heading}</h2>
      <div class="pdp-kit__grid">${rows
        .map((raw) => {
          const item = A.getProduct(raw.productId);
          if (!item) return "";
          const fmt = raw.format === "pouch" ? "pouch" : raw.format === "default" ? "default" : "bottle";
          const img = A.productImage(item, fmt === "default" ? undefined : fmt);
          const label = A.contentLabel(raw);
          const sub =
            fmt === "pouch" ? "Restock" : fmt === "bottle" ? "Essentials" : raw.qty && raw.qty > 1 ? "Pack of " + raw.qty : "Tool";
          return `<a class="pdp-kit__tile" href="${A.productHref(item, fmt)}">
            <span class="pdp-kit__media">${img ? `<img src="${img}" alt="${label}" />` : ""}</span>
            <strong>${label}</strong>
            <span>${sub}</span>
          </a>`;
        })
        .join("")}</div>
    </section>`;
  }

  function howSteps(product) {
    const steps = product.how || [];
    if (!steps.length) return "";
    return `<ol class="bb-pdp__steps">${steps
      .map((s, i) => `<li><span>0${i + 1}</span><p>${s}</p></li>`)
      .join("")}</ol>`;
  }

  function howBand(product) {
    let title = "Keep the bottle. Pour the pouch.";
    let steps = [
      { n: "01", h: "Keep the bottle", b: "Clear PET, built to stay out on the counter." },
      { n: "02", h: "Pour the pouch", b: A.yieldLineFor(product) || "A 1 L spout pouch restocks the bottle." },
      { n: "03", h: "Go", b: "Same formula. Less packing." },
    ];
    if (product.merchPath === "starter") {
      title = "Start with the bottle. Refill from the pouch.";
      steps = [
        { n: "01", h: "Unbox", b: product.short || "Bottle, pouch, and the matching tool." },
        { n: "02", h: "Use", b: "Put the bottle where the job lives." },
        { n: "03", h: "Refill", b: "When it runs out, pour the 1 L pouch. Keep the bottle." },
      ];
    } else if (product.merchPath === "room-set") {
      title = "The room, covered.";
      steps = [
        { n: "01", h: "Unbox", b: "Bottles and tools for this room, ready to place." },
        { n: "02", h: "Place", b: "Put each formula where you use it." },
        { n: "03", h: "Refill", b: "Buy a pouch when a bottle runs out — not a house crate." },
      ];
    } else if (product.merchPath === "restock") {
      title = "Keep the bottle. Pour the pouch.";
      steps = [
        { n: "01", h: "Match", b: "Open the pouch that matches the bottle on the counter." },
        { n: "02", h: "Pour", b: "A 500 ml bottle takes two fills; a 1 L bottle takes one." },
        { n: "03", h: "Keep", b: "The bottles stay. Buy this restock again when they run low." },
      ];
    } else if (product.merchPath === "accessory") {
      title = "The tool, with the formula.";
      steps = [
        { n: "01", h: "Pair", b: product.short || "Use with the matching formula." },
        { n: "02", h: "Use", b: "Rinse after the job." },
        { n: "03", h: "Keep", b: "Built to stay with the bottle." },
      ];
    }
    return `<div class="bb-band bb-band--ink">
      <section class="bb-section pdp-how">
        <p class="bb-kicker">How it works</p>
        <h2>${title}</h2>
        <div class="bb-steps">${steps
          .map((s) => `<article><span>${s.n}</span><h3>${s.h}</h3><p class="muted">${s.b}</p></article>`)
          .join("")}</div>
      </section>
    </div>`;
  }

  function faqBlock() {
    const faqs = (A.siteContent && A.siteContent.faqs) || [];
    if (!faqs.length) return "";
    return `<section class="pdp-faq">
      <p class="bb-kicker">Questions</p>
      <h2>Before you order</h2>
      <div class="pdp-faq__list">${faqs
        .map(
          (f, i) =>
            `<details class="pdp-faq__item"${i === 0 ? " open" : ""}><summary>${f.q}</summary><div class="pdp-faq__body"><p>${f.a}</p></div></details>`
        )
        .join("")}</div>
    </section>`;
  }

  function gallery(mainSrc, alt, thumbs, wide) {
    const thumbHTML = (thumbs || [])
      .map(
        (t) => `<button type="button" class="pdp-thumb${t.active ? " is-active" : ""}" data-pdp-thumb="${t.key}" aria-label="${t.label}">
          <img src="${t.src}" alt="" />
        </button>`
      )
      .join("");
    return `<div class="bb-pdp__gallery">
      <div class="bb-pdp__stage${wide ? " bb-pdp__stage--wide" : ""}">
        <img src="${mainSrc}" alt="${alt}" data-pdp-stage />
      </div>
      ${thumbs && thumbs.length > 1 ? `<div class="bb-pdp__thumbs" role="tablist">${thumbHTML}</div>` : ""}
    </div>`;
  }

  function buyHead(eyebrow, lede, extra) {
    return `<p class="product-card__eyebrow">${eyebrow}</p>
      <h1>${p.name}</h1>
      <p class="bb-pdp__lede">${lede || p.short || p.descriptor || ""}</p>
      ${extra || ""}`;
  }

  function shippingAcc() {
    return {
      title: "Shipping",
      html: `<p>UPI Intent, cards, COD. 3–5 days across India. Free over ₹${Number(threshold).toLocaleString(
        "en-IN"
      )}. Below that, shipping is calculated at checkout.</p>`,
    };
  }

  if (path === "formula") {
    let format = params.get("format") === "pouch" ? "pouch" : "bottle";
    const bottle = A.getSize(p, "bottle");
    const pouch = A.getSize(p, "pouch");
    const scent = A.scentOf(p.formulaKey);
    const scentLabel = p.scentName || "Scent to come";
    const roomHref = (p.rooms || []).includes("kitchen")
      ? "kitchen.html"
      : (p.rooms || []).includes("bathroom")
        ? "bathroom.html"
        : "surfaces.html";
    const roomLabel = (p.rooms || [])[0] ? (p.rooms[0].charAt(0).toUpperCase() + p.rooms[0].slice(1)) : "Shop all";

    function render() {
      const size = format === "pouch" ? pouch : bottle;
      const eyebrow = format === "pouch" ? "Restock" : "Essentials";
      const pairFormula = p.pairWithId && A.getProduct(p.pairWithId);
      const accessory = p.accessoryId && A.getProduct(p.accessoryId);
      const starter = p.starterId && A.getProduct(p.starterId);
      const roomKit = (p.setIds || []).map((id) => A.getProduct(id)).filter(Boolean)[0];
      const addOn = accessory
        ? tbd
          ? `<a class="btn btn--secondary btn--full pdp-addon" href="${A.productHref(accessory)}">See the ${accessory.name} <span aria-hidden="true">→</span></a>`
          : `<button type="button" class="btn btn--secondary btn--full pdp-addon" data-add-cart data-product-id="${accessory.id}" data-size-id="default" data-format="default">${A.addOnLabel(accessory)}</button>`
        : "";
      root.innerHTML = `
        ${crumb([
          { href: "shop.html", label: "Shop all" },
          { href: roomHref, label: roomLabel },
          { href: "product.html?id=" + p.id, label: p.name },
        ])}
        <article class="bb-pdp" style="--scent:${scent.hex}">
          ${gallery(A.productImage(p, format), `${p.name}, ${size.label}`, [
            { key: "bottle", src: A.productImage(p, "bottle"), label: bottle.label, active: format === "bottle" },
            { key: "pouch", src: A.productImage(p, "pouch"), label: pouch.label, active: format === "pouch" },
          ])}
          <div class="bb-pdp__buy">
            ${buyHead(
              eyebrow,
              p.short,
              `<p class="pdp-scent"><span class="scent-chip" style="background:${scent.hex}"></span> ${scentLabel}</p>${usedLine(p)}`
            )}
            <p class="bb-pdp__opt-label">Variant</p>
            <div class="bb-pdp__formats" role="group" aria-label="Variant">
              <button type="button" class="format-chip ${format === "bottle" ? "is-active" : ""}" data-pdp-format="bottle">${bottle.label}</button>
              <button type="button" class="format-chip ${format === "pouch" ? "is-active" : ""}" data-pdp-format="pouch">${pouch.label}</button>
            </div>
            <p class="bb-pdp__yield">${size.helper || A.yieldLineFor(p)}</p>
            ${tbd ? `<a class="btn btn--secondary btn--full" href="shop.html">Explore the collection <span aria-hidden="true">→</span></a>` : `<button type="button" class="btn btn--primary btn--full" data-add-cart data-product-id="${p.id}" data-size-id="${format}" data-format="${format}">Add to cart</button>`}
            ${addOn}
            ${starter ? `<p class="pdp-aside"><a href="starter.html?id=${starter.id}">Make it a starter — ${starter.name}</a></p>` : ""}
            ${roomKit ? `<p class="pdp-aside"><a href="kit.html?id=${roomKit.id}">Make it a kit — ${roomKit.name}</a></p>` : ""}
            ${trust()}
            ${quoteBlock(p.id)}
            ${acc([
              { title: "How to use", html: howSteps(p) },
              {
                title: "Ingredients",
                html: `<ul class="bb-pdp__ing">${(p.ingredients || []).map((s) => `<li>${s}</li>`).join("")}</ul><p class="muted">Illustrative until final INCI.</p>`,
              },
              { title: "Surfaces", body: p.surfaces || "" },
              shippingAcc(),
            ])}
          </div>
        </article>
        ${howBand(p)}
        ${alsoBlock("Pair with", [pairFormula, accessory].filter(Boolean), "Pair with")}
        ${alsoBlock("Make it a kit", [starter, roomKit].filter(Boolean), "Make it a kit")}
        ${alsoBlock("You may also like", A.listFormulas().filter((f) => f.id !== p.id), "You may also like")}
        ${faqBlock()}`;
      bindSticky(p.name, p.id, format, format);
      if (window.AevaAlsoLike) window.AevaAlsoLike.bindAll();
    }

    render();
    root.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-pdp-format], [data-pdp-thumb]");
      if (!btn) return;
      format = btn.getAttribute("data-pdp-format") || btn.getAttribute("data-pdp-thumb") || format;
      const url = new URL(location.href);
      url.searchParams.set("id", p.id);
      url.searchParams.set("format", format);
      history.replaceState(null, "", url);
      render();
    });
    return;
  }

  const isSet = path === "room-set";
  const isStarter = path === "starter";
  const isRestock = path === "restock";
  const isTool = path === "accessory";

  if (isRestock) document.body.setAttribute("data-aeva-chrome", "restock");
  else if (isSet || isStarter) document.body.setAttribute("data-aeva-chrome", "kits");

  const eyebrow = isSet ? (p.kitFamily === "house" ? "House" : "Starter Kit") : isStarter ? "Start" : isRestock ? "Restock" : "Accessory";
  const parentHref = isSet || isStarter ? "kits.html" : isRestock ? "refills.html" : "shop.html#shop-accessories";
  const parentLabel = isSet || isStarter ? "Starter Kits" : isRestock ? "Restock" : "Accessories";

  const also = isSet
    ? A.listSets().concat(A.listHouse ? A.listHouse().filter((h) => h.merchPath === "room-set") : []).filter((s) => s.id !== p.id)
    : isStarter
      ? A.listStarters().filter((s) => s.id !== p.id)
      : isRestock
        ? A.listFormulas()
        : A.listAccessories().filter((s) => s.id !== p.id);

  const pair = isTool
    ? (p.pairsWith || []).map((pid) => A.getProduct(pid)).filter(Boolean)
    : isStarter && p.formulaId
      ? [A.getProduct(p.formulaId)].filter(Boolean)
      : isRestock
        ? [A.getProduct("home-essentials-kit")].filter(Boolean)
        : [];

  const makeKit = isTool ? (p.kitIds || []).map((id) => A.getProduct(id)).filter(Boolean) : [];

  const includeHTML = isSet || isStarter || isRestock ? includeList(p) : "";
  const thumbs = [{ key: "main", src: A.productImage(p), label: p.name, active: true }];
  const formulaLink =
    p.formulaId && A.getProduct(p.formulaId)
      ? `<p class="pdp-aside"><a href="product.html?id=${p.formulaId}">See ${A.getProduct(p.formulaId).name} on its own</a></p>`
      : isRestock
        ? `<p class="pdp-aside"><a href="kit.html?id=home-essentials-kit">Need the bottles first — Home Essentials Kit</a></p>`
        : isSet && p.restockId && A.getProduct(p.restockId)
          ? `<p class="pdp-aside"><a href="${A.productHref(A.getProduct(p.restockId))}">Need a restock — ${A.getProduct(p.restockId).name}</a></p>`
          : "";

  const whatFor = isTool ? `<p class="pdp-used">${p.short || p.descriptor || ""}</p>${usedLine(p)}` : isSet || isRestock ? contentsLine(p) : usedLine(p);

  root.innerHTML = `
    ${crumb([
      { href: "shop.html", label: "Shop all" },
      { href: parentHref, label: parentLabel },
      { href: A.productHref(p), label: p.name },
    ])}
    <article class="bb-pdp"${p.scentHex ? ` style="--scent:${p.scentHex}"` : ""}>
      ${gallery(A.productImage(p), p.name, thumbs, !isTool)}
      <div class="bb-pdp__buy">
        ${buyHead(eyebrow, p.short, isTool ? usedLine(p) : whatFor)}
        ${tbd ? `<a class="btn btn--secondary btn--full" href="shop.html">Explore the collection <span aria-hidden="true">→</span></a>` : `<button type="button" class="btn btn--primary btn--full" data-add-cart data-product-id="${p.id}" data-size-id="default" data-format="default">Add to cart</button>`}
        ${formulaLink}
        ${isSet || isStarter ? `<p class="bb-pdp__yield">Refill each formula with its own Restock pouch.</p>` : ""}
        ${isRestock ? `<p class="bb-pdp__yield">Pouches only. Keep the bottles you already have. No cloth. No scrub.</p>` : ""}
        ${trust()}
        ${quoteBlock(p.id)}
        ${acc([
          includeHTML ? { title: "What's included", html: `<ul class="bb-include-list">${includeHTML}</ul>` } : null,
          { title: isTool ? "What it is for" : "How to use", html: howSteps(p) || `<p>${p.helper || p.descriptor || ""}</p>` },
          shippingAcc(),
        ])}
      </div>
    </article>
    ${howBand(p)}
    ${isSet || isStarter || isRestock ? includeGrid(p, isRestock ? "The restock" : isSet ? "The kit" : "The starter", "What's included") : ""}
    ${alsoBlock("Pair with", pair, "Pair with")}
    ${isTool ? alsoBlock("Make it a starter / kit", makeKit, "Make it a starter / kit") : ""}
    ${alsoBlock("You may also like", isTool ? also : isSet || isStarter ? also : also, "You may also like")}
    ${faqBlock()}`;
  bindSticky(p.name, p.id, "default", "default");
  if (window.AevaAlsoLike) window.AevaAlsoLike.bindAll();
})();

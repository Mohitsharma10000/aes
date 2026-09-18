/**
 * Aeva Essentials — spec mock catalog.
 * Prices are TBD (priceStatus: "tbd"). Never display ₹0.
 * IA: Shop all / Kits / Restock / Kitchen / Bathroom / Surfaces.
 */
(function () {
  const SCENT = {
    floor: { hex: "#5B7A4E", name: "Lavender / Peppermint / Eucalyptus", character: "pale gold", css: "var(--scent-floor)" },
    dishwash: { hex: "#C4A35A", name: "Lemon / Orange / Ginger", character: "pale gold", css: "var(--scent-dishwash)" },
    surface: { hex: "#6B5B8A", name: "Lavender / Lemon / Rosemary", character: "pale lavender", css: "var(--scent-surface)" },
    bathroom: { hex: "#3D8B7A", name: "Lemon / Tea Tree / Eucalyptus", character: "pale mint", css: "var(--scent-bathroom)" },
    toilet: { hex: "#3D5A80", name: "Pine / Eucalyptus / Tea Tree", character: "pale blue", css: "var(--scent-toilet)" },
    degreaser: { hex: "#C47A3D", name: "Orange / Lemon / Peppermint", character: "pale peach", css: "var(--scent-degreaser)" },
  };

  const tbd = {
    priceStatus: "tbd",
    price: 0,
    compareAt: null,
    launch: true,
  };

  const ALIASES = {
    "complete-home-set": "home-essentials-kit",
    "microfibre-cloth": "cotton-cloth",
    "floor-cleaning-cloth": "cotton-cloth",
  };

  function bottleSize(sku, helper, volumeMl, spray) {
    return Object.assign(
      {
        id: "bottle",
        sku: sku,
        label: "Essentials",
        helper: helper,
        format: "bottle",
        variant: "essentials",
        volumeMl: volumeMl,
        closure: spray ? "spray" : "pour",
      },
      tbd
    );
  }

  function pouchSize(sku) {
    return Object.assign(
      {
        id: "pouch",
        sku: sku,
        label: "Restock",
        helper: "1 L spout pouch — refill the bottle",
        format: "pouch",
        variant: "restock",
        volumeMl: 1000,
      },
      tbd
    );
  }

  const AEVA = {
    brand: "Aeva Essentials",
    tagline: "Clean, without compromise.",
    currency: "INR",
    schemaVersion: 6,
    scope: "full-range",
    sotNote: "Spec mock. Catalog supersedes kitchen-only fork. Prices TBD.",

    shipping: {
      freeOverInr: 499,
      codEnabled: true,
      taxInclusiveDisplay: true,
      belowThresholdCopy: "Shipping calculated at checkout",
    },

    siteContent: {
      freeShipInr: 499,
      currencyNote: "Prices in INR. Tax-inclusive when set. Mock prices TBD.",
      reviews: {
        showWhenEmpty: false,
        mock: true,
        items: [
          {
            published: true,
            stars: 5,
            quote: "The floor cleaner does the day's dust without the heavy smell I used to live with.",
            by: "Meera",
            city: "Mumbai",
            productId: "floor-cleaner",
          },
          {
            published: true,
            stars: 5,
            quote: "I keep the bottle on the sink. The pouch lives in the cupboard. That is the whole system.",
            by: "Rohan",
            city: "Bengaluru",
            productId: "dishwash",
          },
          {
            published: true,
            stars: 5,
            quote: "Colour in the bottle is the scent. I can tell dishwash from degreaser without reading the label.",
            by: "Anika",
            city: "Delhi",
            productId: "surface-cleaner",
          },
          {
            published: true,
            stars: 5,
            quote: "We started with the kitchen kit. The rest of the house followed.",
            by: "Farah",
            city: "Pune",
            productId: "kitchen-set",
          },
          {
            published: true,
            stars: 5,
            quote: "It cuts masala and oil, and the bottle earns its place by the sink.",
            by: "Kabir",
            city: "Hyderabad",
            productId: "kitchen-degreaser",
          },
        ],
      },
      faqs: [
        {
          q: "What is in the range?",
          a: "Six formulas — floor, dishwash, surface spray, bathroom spray, toilet, and kitchen degreaser — each as an Essentials bottle and a Restock pouch, plus two tools: a cotton cloth and an eco dishwash scrub.",
        },
        {
          q: "Are the bottles glass?",
          a: "No. Daily sizes ship in transparent PET so the liquid — and its scent colour — is visible. A 1 L spout pouch refills the same bottle.",
        },
        {
          q: "How does restock work?",
          a: "Keep the bottle. Pour the 1 L pouch into it. A 500 ml bottle takes two fills from one pouch; a 1 L bottle takes one. Restock the house, a room, or one formula. Pouches only — no cloth, no scrub.",
        },
        {
          q: "What is a starter versus a kit?",
          a: "A starter is one formula: Essentials bottle, Restock pouch, and the matching tool when there is one (toilet and floor are bottle and pouch). A room kit is the bottles and tools for that room. The house kits cover all six formulas.",
        },
        {
          q: "Do you ship across India?",
          a: "When live: prepaid UPI and cards, COD, 3–5 days. Planning free shipping over ₹499. Below that, shipping is calculated at checkout.",
        },
        {
          q: "What does it smell like?",
          a: "Each formula has its own blend, printed on the pack. Floor is lavender, peppermint, and eucalyptus; dishwash is lemon, orange, and ginger; surface is lavender, lemon, and rosemary; bathroom is lemon, tea tree, and eucalyptus; toilet is pine, eucalyptus, and tea tree; kitchen degreaser is orange, lemon, and peppermint.",
        },
      ],
      notes: [
        { quote: "The home is a living surface, not a laboratory to be attacked.", by: "Aeva" },
        { quote: "Six formulas. Each scent has a colour you can see.", by: "Aeva" },
        { quote: "Keep the bottle. Pour the pouch. Go.", by: "Aeva" },
      ],
    },

    faqHTML() {
      const faqs = (this.siteContent && this.siteContent.faqs) || [];
      if (!faqs.length) return "";
      return `<div class="bb-faq">${faqs
        .map(
          (f, i) =>
            `<details class="bb-pdp__acc"${i === 0 ? " open" : ""}><summary>${f.q}</summary><div class="bb-pdp__acc-body"><p>${f.a}</p></div></details>`
        )
        .join("")}</div>`;
    },

    notesHTML() {
      const notes = (this.siteContent && this.siteContent.notes) || [];
      if (!notes.length) return "";
      return `<div class="bb-notes">${notes
        .map((n) => `<blockquote><p>${n.quote}</p><cite>${n.by}</cite></blockquote>`)
        .join("")}</div>`;
    },

    usedForHTML(p) {
      const jobs = (p && p.usedFor) || [];
      if (!jobs.length) return "";
      return `<p class="bb-used-label">Used for</p><ul class="bb-used">${jobs.map((j) => `<li>${j}</li>`).join("")}</ul>`;
    },

    yieldLineFor(p) {
      if (!p || p.merchPath !== "formula") return "";
      return p.yieldLine || "One 1 L pouch fills this bottle.";
    },

    getPublishedReviews(productId) {
      const block = this.siteContent && this.siteContent.reviews;
      if (!block || !Array.isArray(block.items)) return [];
      return block.items.filter((r) => {
        if (!r || !r.published || !r.quote) return false;
        if (productId == null || productId === "") return true;
        return !r.productId || r.productId === productId;
      });
    },

    isTbd(item) {
      if (!item) return true;
      if (item.priceStatus === "tbd") return true;
      if (item.price == null || item.price === "") return true;
      return false;
    },

    formatPrice(n, opts) {
      opts = opts || {};
      if (opts.tbd || n == null || n === "" || (opts.checkStatus && this.isTbd(opts))) {
        return "₹—";
      }
      if (typeof n === "object" && n && this.isTbd(n)) return "₹—";
      const num = Number(n);
      if (!num || Number.isNaN(num)) return "₹—";
      return "₹" + num.toLocaleString("en-IN");
    },

    priceHTML(sell, compareAt, opts) {
      opts = opts || {};
      const tbdFlag = opts.tbd || sell == null || sell === 0 || opts.priceStatus === "tbd";
      if (tbdFlag) {
        return `<span class="price-sale">₹—</span>`;
      }
      const s = Number(sell);
      let html = "";
      if (opts.mrpCaption && compareAt != null && Number(compareAt) > 0) {
        html += `<span class="price-mrp">MRP ${this.formatPrice(compareAt)} incl. of all taxes</span> `;
      }
      html += `<span class="price-sale">${this.formatPrice(s)}</span>`;
      return html;
    },

    basePath: "",
    assetVersion: "pack-botanical-1",

    scentOf(key) {
      return SCENT[key] || { hex: "#C4B48A", character: "pale liquid", css: "var(--aeva-accent)" };
    },

    paperWellHTML(item, opts) {
      opts = opts || {};
      const key = item.formulaKey || item.scentSlot || "";
      const scent = this.scentOf(key);
      const name = item.name || "";
      const alt = `${name}, clear bottle, ${scent.character} liquid`;
      return `<div class="paper-well" style="--well-scent:${scent.hex}" role="img" aria-label="${alt}">
        <span class="paper-well__chip" aria-hidden="true"></span>
        <span class="paper-well__name">${name}</span>
        ${opts.note ? `<span class="paper-well__note">${opts.note}</span>` : ""}
      </div>`;
    },

    productsRoot() {
      return (this.basePath || "") + "assets/products/";
    },

    withAssetVersion(url) {
      if (!url) return url;
      const v = this.assetVersion || "1";
      if (String(url).indexOf("v=") !== -1) return url;
      return String(url) + (String(url).indexOf("?") === -1 ? "?" : "&") + "v=" + v;
    },

    normalizeFormat(f) {
      if (f == null || f === "") return null;
      const s = String(f).toLowerCase();
      if (s === "bottle" || s === "pet" || s === "essentials" || s === "pet-bottle" || s === "pet_bottle" || s === "glass" || s === "glass-bottle")
        return "bottle";
      if (s === "pouch" || s === "refill" || s === "1l pouch" || s === "1l-pouch") return "pouch";
      if (s === "default" || s === "bundle") return "default";
      return s;
    },

    normalizeSizeId(s) {
      if (s == null || s === "") return null;
      const key = String(s).toLowerCase().replace(/\s/g, "");
      const map = {
        bottle: "bottle",
        pouch: "pouch",
        essentials: "bottle",
        restock: "pouch",
        default: "default",
        "500": "bottle",
        "500ml": "bottle",
        "1000": "pouch",
        "1000ml": "pouch",
        "1l": "pouch",
      };
      return map[key] || key;
    },

    products: [],
    kits: [],
    collections: {},

    resolveId(idOrSlug) {
      return ALIASES[idOrSlug] || idOrSlug;
    },

    getProduct(idOrSlug) {
      const key = this.resolveId(idOrSlug);
      return this.products.find((p) => p.id === key || p.slug === key || p.handle === key);
    },

    getKit(idOrSlug) {
      const p = this.getProduct(idOrSlug);
      if (p && (p.merchPath === "room-set" || p.merchPath === "starter" || p.merchPath === "restock")) return p;
      return null;
    },

    getSize(product, sizeId) {
      if (!product || !product.sizes) return null;
      const id = this.normalizeSizeId(sizeId) || sizeId;
      return (
        product.sizes.find((s) => s.id === id || s.format === id || s.variant === id) ||
        product.sizes.find((s) => s.id === sizeId) ||
        product.sizes[0] ||
        null
      );
    },

    sizePrice(product, sizeId) {
      const s = this.getSize(product, sizeId);
      if (!s || this.isTbd(s)) return null;
      return s.price;
    },

    fromPrice(product) {
      if (!product) return null;
      if (this.isTbd(product) || (product.sizes && product.sizes.every((s) => this.isTbd(s)))) return null;
      const prices = (product.sizes || []).filter((s) => s.launch !== false && !this.isTbd(s)).map((s) => s.price);
      return prices.length ? Math.min.apply(null, prices) : null;
    },

    fromCompareAt() {
      return null;
    },

    listFormulas() {
      return this.products.filter((p) => p.merchPath === "formula");
    },
    listStarters() {
      return this.products.filter((p) => p.merchPath === "starter");
    },
    listSets() {
      return this.products.filter((p) => p.merchPath === "room-set" && p.kitFamily === "room");
    },
    listRoomKits() {
      return this.listSets();
    },
    listHouse() {
      return ["home-essentials-kit", "home-keep-going-kit"].map((id) => this.getProduct(id)).filter(Boolean);
    },
    homeMerch: {
      limit: 4,
      bestsellers: ["floor-cleaner", "dishwash", "surface-cleaner", "kitchen-set"],
      starters: ["floor-starter", "dishwash-starter", "degreaser-starter", "surface-starter"],
      rooms: ["kitchen-set", "bathroom-set", "surfaces-set", "home-essentials-kit"],
    },
    listHomeMerch(key) {
      const cfg = this.homeMerch || {};
      const limit = cfg.limit || 4;
      const ids = cfg[key];
      if (Array.isArray(ids) && ids.length) {
        return ids.map((id) => this.getProduct(id)).filter(Boolean).slice(0, limit);
      }
      if (key === "starters") return this.listStarters().slice(0, limit);
      if (key === "rooms") return this.listSets().slice(0, limit);
      return this.listFormulas().slice(0, limit);
    },
    listRestocks() {
      return this.products.filter((p) => p.merchPath === "restock");
    },
    listAccessories() {
      return this.products.filter((p) => p.merchPath === "accessory");
    },
    listShopable() {
      return this.products.slice();
    },
    listCollection(key) {
      return (this.collections && this.collections[key]) || [];
    },

    productHref(p, format) {
      if (!p) return "shop.html";
      if (p.merchPath === "room-set" || p.merchPath === "restock") return "kit.html?id=" + p.slug;
      if (p.merchPath === "starter") return "starter.html?id=" + p.slug;
      const fmt = this.normalizeFormat(format);
      if (p.merchPath === "formula" && fmt === "pouch") return "product.html?id=" + p.slug + "&format=pouch";
      if (p.merchPath === "formula" && fmt === "bottle") return "product.html?id=" + p.slug + "&format=bottle";
      return "product.html?id=" + p.slug;
    },

    collectionHref(key) {
      const map = {
        all: "shop.html",
        shop: "shop.html",
        kits: "kits.html",
        restock: "refills.html",
        kitchen: "kitchen.html",
        bathroom: "bathroom.html",
        surfaces: "surfaces.html",
        accessories: "shop.html#shop-accessories",
      };
      return map[key] || "shop.html";
    },

    packDir() {
      return (this.basePath || "") + "assets/products/designs/clear-pet/";
    },

    packUrl(file) {
      if (!file) return "";
      return this.withAssetVersion(this.packDir() + file);
    },

    productImage(product, format, sizeId) {
      if (!product) return "";
      const fmt = this.normalizeFormat(format) || this.normalizeSizeId(sizeId) || format;
      if (product.merchPath === "formula") {
        if (fmt === "pouch") return this.packUrl(product.imagePouch || product.id + "-pouch.jpg");
        return this.packUrl(product.imageBottle || product.id + "-bottle.jpg");
      }
      if (product.image) return this.packUrl(product.image);
      if (product.merchPath === "accessory") return this.packUrl(product.id + ".jpg");
      if (product.merchPath === "starter") return this.packUrl(product.id + ".jpg");
      if (product.merchPath === "room-set" || product.merchPath === "restock") return this.packUrl(product.id + ".jpg");
      return "";
    },

    groupImage() {
      const first = this.listFormulas()[0];
      return first ? this.productImage(first, "bottle") : "";
    },

    contentLabel(c) {
      if (!c) return "";
      if (c.label) return c.label;
      const item = this.getProduct(c.productId);
      if (!item) return "";
      const qty = c.qty && c.qty > 1 ? " pack of " + c.qty : "";
      if (c.format === "bottle") {
        const size = this.getSize(item, "bottle");
        const ml = size && size.volumeMl ? " " + size.volumeMl + " ml" : "";
        return item.name + " Essentials" + ml;
      }
      if (c.format === "pouch") {
        const size = this.getSize(item, "pouch");
        const ml = size && size.volumeMl ? " " + size.volumeMl + " ml" : " 1000 ml";
        return item.name + " Restock" + ml;
      }
      return item.name + qty;
    },

    addOnLabel(acc) {
      if (!acc) return "";
      const an = /^[aeiou]/i.test(acc.name) ? "an" : "a";
      return "Add " + an + " " + acc.name;
    },

    assertKitsValid() {
      return [];
    },
  };

  function formula(spec) {
    const scent = SCENT[spec.formulaKey];
    const bottle = bottleSize(spec.bottleSku, spec.bottleHelper, spec.bottleMl, spec.spray);
    const pouch = pouchSize(spec.pouchSku);
    return {
      id: spec.id,
      slug: spec.id,
      handle: spec.id,
      merchPath: "formula",
      productType: "Formula",
      formulaKey: spec.formulaKey,
      scentSlot: spec.formulaKey,
      scentName: scent.name,
      scentCharacter: scent.character,
      scentHex: scent.hex,
      imageBottle: spec.id + "-bottle.jpg",
      imagePouch: spec.id + "-pouch.jpg",
      name: spec.name,
      descriptor: spec.descriptor,
      short: spec.short,
      rooms: spec.rooms,
      category: spec.formulaKey,
      accessoryId: spec.accessoryId || null,
      pairWithId: spec.pairWithId || null,
      starterId: spec.starterId,
      setIds: spec.setIds || [],
      how: spec.how,
      ingredients: spec.ingredients,
      why: spec.why,
      surfaces: spec.surfaces,
      cautions: spec.cautions,
      usedFor: spec.usedFor || [],
      yieldLine: spec.bottleMl >= 1000 ? "One 1 L pouch fills this bottle." : "One 1 L pouch fills this bottle twice.",
      reviewCount: 0,
      sizes: [bottle, pouch],
      priceStatus: "tbd",
    };
  }

  const formulas = [
    formula({
      id: "floor-cleaner",
      formulaKey: "floor",
      name: "Floor Cleaner",
      descriptor: "Floors, without the heavy film",
      short: "A 1 L pour for sealed floors — pale, scent-true liquid you can see.",
      rooms: ["surfaces"],
      bottleSku: "FLR-1000",
      bottleHelper: "Essentials 1000 ml PET — pour",
      bottleMl: 1000,
      pouchSku: "FLR-P1000",
      accessoryId: null,
      pairWithId: "surface-cleaner",
      starterId: "floor-starter",
      setIds: ["surfaces-set"],
      spray: false,
      how: ["Dilute as on the label for mopping, or use neat on a cloth for spots", "Mop or wipe", "Refill from the 1 L pouch"],
      ingredients: ["Aqua (Water)", "Plant-derived surfactant (illustrative)", "Citric acid", "Preservation system", "Scent (to come)"],
      why: ["Built for Indian dust and daily mopping", "Scent colour you can see in clear PET", "Refill without a new bottle"],
      surfaces: "Sealed tile, stone, and hard floors. Spot-test unsealed wood.",
      usedFor: ["Sealed tile", "Stone floors", "Daily mopping", "Spots"],
      cautions: "Keep out of eyes. Do not mix with bleach.",
    }),
    formula({
      id: "dishwash",
      formulaKey: "dishwash",
      name: "Dishwash Liquid",
      descriptor: "Grease, met with quiet strength",
      short: "Cuts cooking grease and food residue, with a little that goes a long way.",
      rooms: ["kitchen"],
      bottleSku: "DSH-500",
      bottleHelper: "Essentials 500 ml PET — for the sink",
      bottleMl: 500,
      pouchSku: "DSH-P1000",
      accessoryId: "eco-dishwash-scrub",
      pairWithId: "kitchen-degreaser",
      starterId: "dishwash-starter",
      setIds: ["kitchen-set"],
      spray: false,
      how: ["Dispense a small amount onto sponge or into basin", "Wash, rinse thoroughly", "Refill from the 1 L pouch"],
      ingredients: ["Aqua (Water)", "Sodium Coco-Sulfate (illustrative)", "Decyl Glucoside", "Glycerin", "Scent (to come)"],
      why: ["Effective on oil and masala residue", "Kind to hands that wash often", "Bottle stays; pouch restocks"],
      surfaces: "Dishes, cookware, cutlery. Not a substitute for oven carbon.",
      usedFor: ["Dishes", "Cookware", "Oil and masala", "The sink"],
      cautions: "Keep out of eyes. Store upright.",
    }),
    formula({
      id: "surface-cleaner",
      formulaKey: "surface",
      name: "Surface Spray",
      descriptor: "Daily surfaces, calmly cleared",
      short: "A 500 ml spray for counters, tables, and high-touch areas.",
      rooms: ["surfaces"],
      bottleSku: "SFC-500",
      bottleHelper: "Essentials 500 ml PET spray — for the counter",
      bottleMl: 500,
      pouchSku: "SFC-P1000",
      accessoryId: "cotton-cloth",
      pairWithId: "floor-cleaner",
      starterId: "surface-starter",
      setIds: ["surfaces-set"],
      spray: true,
      how: ["Spray onto surface or cloth", "Wipe", "Refill from the 1 L pouch"],
      ingredients: ["Aqua (Water)", "Decyl Glucoside (illustrative)", "Sodium citrate", "Scent (to come)"],
      why: ["Daily film without aggressive solvents", "Pairs with a cotton cloth", "Scent colour visible in the bottle"],
      surfaces: "Sealed counters, laminate, tiles, switches. Spot-test natural stone.",
      usedFor: ["Counters", "Tables", "Switches", "High-touch"],
      cautions: "Avoid unsealed wood unless spot-tested.",
    }),
    formula({
      id: "bathroom-cleaner",
      formulaKey: "bathroom",
      name: "Bathroom Spray",
      descriptor: "A calm, capable ritual for wet rooms",
      short: "A 500 ml spray for tiles, taps, and bathroom surfaces.",
      rooms: ["bathroom"],
      bottleSku: "BTH-500",
      bottleHelper: "Essentials 500 ml PET spray",
      bottleMl: 500,
      pouchSku: "BTH-P1000",
      accessoryId: "cotton-cloth",
      pairWithId: "toilet-cleaner",
      starterId: "bathroom-starter",
      setIds: ["bathroom-set"],
      spray: true,
      how: ["Spray", "Allow a brief dwell on soap film", "Wipe", "Refill from the pouch"],
      ingredients: ["Aqua (Water)", "Plant-derived surfactant (illustrative)", "Citric acid", "Scent (to come)"],
      why: ["Wet-room film without hospital-grade claims", "Clear PET, scent-true colour", "Refill pouch"],
      surfaces: "Tiles, taps, sealed bathroom surfaces. Not for natural stone unless spot-tested.",
      usedFor: ["Tiles", "Taps", "Wet rooms", "Soap film"],
      cautions: "Do not mix with bleach or ammonia products.",
    }),
    formula({
      id: "toilet-cleaner",
      formulaKey: "toilet",
      name: "Toilet Cleaner",
      descriptor: "The bowl, without sanitary blue",
      short: "A 1 L pour for the bowl. Colour is scent — not a blue dye job.",
      rooms: ["bathroom"],
      bottleSku: "TLT-1000",
      bottleHelper: "Essentials 1000 ml PET — pour",
      bottleMl: 1000,
      pouchSku: "TLT-P1000",
      accessoryId: null,
      pairWithId: "bathroom-cleaner",
      starterId: "toilet-starter",
      setIds: ["bathroom-set"],
      spray: false,
      how: ["Apply under the rim", "Leave briefly", "Brush and flush", "Refill from the pouch"],
      ingredients: ["Aqua (Water)", "Surfactant (illustrative)", "Citric acid", "Scent (to come)"],
      why: ["No sanitary-blue juice", "Bottle + pouch, no tool in the starter", "Scent colour, not job dye"],
      surfaces: "Toilet bowl and rim. Do not use on other ceramics without checking.",
      usedFor: ["Bowl", "Rim"],
      cautions: "Never mix with bleach. Keep out of reach of children.",
    }),
    formula({
      id: "kitchen-degreaser",
      formulaKey: "degreaser",
      name: "Kitchen Degreaser Spray",
      descriptor: "Grease on the hob, not the whole house",
      short: "A 500 ml spray for stove, splashback, and greasy kitchen film.",
      rooms: ["kitchen"],
      bottleSku: "DGR-500",
      bottleHelper: "Essentials 500 ml PET spray",
      bottleMl: 500,
      pouchSku: "DGR-P1000",
      accessoryId: "cotton-cloth",
      pairWithId: "dishwash",
      starterId: "degreaser-starter",
      setIds: ["kitchen-set"],
      spray: true,
      how: ["Spray onto cool surfaces", "Wipe with a cloth", "Repeat on heavy soil", "Refill from the pouch"],
      ingredients: ["Aqua (Water)", "Grease-cutting surfactant (illustrative)", "Scent (to come)"],
      why: ["Kitchen grease without a 5 L can", "Lives next to dishwash in the Kitchen Kit", "Clear PET"],
      surfaces: "Hobs, splashbacks, sealed counters. Not for hot pans.",
      usedFor: ["Hob", "Splashback", "Greasy film", "Cool stove"],
      cautions: "Spray onto cool surfaces only.",
    }),
  ];

  function accessory(spec) {
    return {
      id: spec.id,
      slug: spec.id,
      handle: spec.id,
      merchPath: "accessory",
      productType: "Accessory",
      formulaKey: null,
      name: spec.name,
      descriptor: spec.descriptor,
      short: spec.short || spec.descriptor,
      rooms: spec.rooms || [],
      pairsWith: spec.pairsWith || [],
      kitIds: spec.kitIds || [],
      usedFor: spec.usedFor || [],
      image: spec.image || spec.id + ".jpg",
      sizes: [Object.assign({ id: "default", sku: spec.id.toUpperCase().replace(/-/g, ""), label: "One", format: "default", helper: "" }, tbd)],
      priceStatus: "tbd",
      how: spec.how || ["Use with the matching formula.", "Rinse and dry after use."],
      ingredients: [],
      why: [],
    };
  }

  const accessories = [
    accessory({
      id: "cotton-cloth",
      name: "Cotton Cloth",
      descriptor: "100% cotton. For sprays.",
      short: "100% cotton. For sprays.",
      rooms: ["kitchen", "bathroom", "surfaces"],
      pairsWith: ["kitchen-degreaser", "surface-cleaner", "bathroom-cleaner"],
      kitIds: [
        "degreaser-starter",
        "surface-starter",
        "bathroom-starter",
        "kitchen-set",
        "bathroom-set",
        "surfaces-set",
        "home-essentials-kit",
        "home-keep-going-kit",
      ],
      usedFor: ["Sprays", "Counters", "Tiles"],
      image: "microfibre-cloth.jpg",
      how: ["Use with a spray.", "Rinse and dry after use."],
    }),
    accessory({
      id: "eco-dishwash-scrub",
      name: "Eco Dishwash Scrub",
      descriptor: "For the sink.",
      short: "For the sink.",
      rooms: ["kitchen"],
      pairsWith: ["dishwash"],
      kitIds: ["dishwash-starter", "kitchen-set", "home-essentials-kit", "home-keep-going-kit"],
      usedFor: ["The sink", "Dishes"],
      image: "eco-dishwash-scrub.jpg",
      how: ["Use with Dishwash Liquid.", "Rinse and dry after use."],
    }),
  ];

  function starter(id, formulaId, name, contents, short, toolNote) {
    const f = formulas.find((x) => x.id === formulaId);
    return {
      id: id,
      slug: id,
      handle: id,
      merchPath: "starter",
      productType: "Starter",
      kitFamily: "start",
      image: id + ".jpg",
      formulaKey: f.formulaKey,
      formulaId: formulaId,
      scentCharacter: f.scentCharacter,
      scentHex: f.scentHex,
      name: name,
      descriptor: toolNote ? "Bottle, pouch, and tool" : "Bottle and pouch",
      short: short,
      rooms: f.rooms,
      contents: contents,
      sizes: [
        Object.assign(
          { id: "default", sku: id.toUpperCase().replace(/-/g, ""), label: "Starter", format: "default", helper: "Essentials + Restock" },
          tbd
        ),
      ],
      priceStatus: "tbd",
      helper: "Refill happens per formula — not as a house crate.",
      how: ["Keep the bottle.", "Pour the pouch.", toolNote ? "Use the tool if included." : "No tool in this starter."].filter(Boolean),
    };
  }

  const starters = [
    starter(
      "floor-starter",
      "floor-cleaner",
      "Floor Starter",
      [
        { productId: "floor-cleaner", format: "bottle" },
        { productId: "floor-cleaner", format: "pouch" },
      ],
      "Floor Cleaner Essentials 1000 ml and Restock 1000 ml.",
      null
    ),
    starter(
      "dishwash-starter",
      "dishwash",
      "Dish Starter",
      [
        { productId: "dishwash", format: "bottle" },
        { productId: "dishwash", format: "pouch" },
        { productId: "eco-dishwash-scrub", format: "default" },
      ],
      "Includes Eco Dishwash Scrub.",
      "tool"
    ),
    starter(
      "degreaser-starter",
      "kitchen-degreaser",
      "Degreaser Starter",
      [
        { productId: "kitchen-degreaser", format: "bottle" },
        { productId: "kitchen-degreaser", format: "pouch" },
        { productId: "cotton-cloth", format: "default" },
      ],
      "Includes Cotton Cloth.",
      "tool"
    ),
    starter(
      "surface-starter",
      "surface-cleaner",
      "Surface Starter",
      [
        { productId: "surface-cleaner", format: "bottle" },
        { productId: "surface-cleaner", format: "pouch" },
        { productId: "cotton-cloth", format: "default" },
      ],
      "Includes Cotton Cloth.",
      "tool"
    ),
    starter(
      "bathroom-starter",
      "bathroom-cleaner",
      "Bathroom Starter",
      [
        { productId: "bathroom-cleaner", format: "bottle" },
        { productId: "bathroom-cleaner", format: "pouch" },
        { productId: "cotton-cloth", format: "default" },
      ],
      "Includes Cotton Cloth.",
      "tool"
    ),
    starter(
      "toilet-starter",
      "toilet-cleaner",
      "Toilet Starter",
      [
        { productId: "toilet-cleaner", format: "bottle" },
        { productId: "toilet-cleaner", format: "pouch" },
      ],
      "Toilet Cleaner Essentials 1000 ml and Restock 1000 ml.",
      null
    ),
  ];

  function kit(spec) {
    return {
      id: spec.id,
      slug: spec.id,
      handle: spec.id,
      merchPath: spec.merchPath || "room-set",
      productType: spec.productType || "Kit",
      kitFamily: spec.kitFamily,
      image: spec.image || spec.id + ".jpg",
      name: spec.name,
      descriptor: spec.descriptor,
      short: spec.short || spec.descriptor,
      rooms: spec.rooms,
      restockId: spec.restockId || null,
      includes: spec.includes || [],
      accessories: spec.accessories || [],
      contents: spec.contents,
      sizes: [
        Object.assign(
          {
            id: "default",
            sku: spec.id.toUpperCase().replace(/-/g, ""),
            label: spec.productType || "Kit",
            format: "default",
            helper: spec.helper || "",
          },
          tbd
        ),
      ],
      priceStatus: "tbd",
      how: spec.how || ["Unbox.", "Put them where you use them.", "Buy a pouch when a bottle runs out."],
    };
  }

  const allFormulaIds = formulas.map((f) => f.id);

  const kits = [
    kit({
      id: "kitchen-set",
      kitFamily: "room",
      name: "Kitchen Kit",
      descriptor: "Dishwash, degreaser, Eco Dishwash Scrub, and Cotton Cloth.",
      short: "Dishwash + Degreaser + Eco Dishwash Scrub + Cotton Cloth.",
      rooms: ["kitchen"],
      restockId: "kitchen-restock",
      includes: ["dishwash", "kitchen-degreaser"],
      accessories: ["eco-dishwash-scrub", "cotton-cloth"],
      contents: [
        { productId: "dishwash", format: "bottle" },
        { productId: "kitchen-degreaser", format: "bottle" },
        { productId: "eco-dishwash-scrub", format: "default" },
        { productId: "cotton-cloth", format: "default" },
      ],
      helper: "Bottles and tools for the kitchen",
    }),
    kit({
      id: "bathroom-set",
      kitFamily: "room",
      name: "Bathroom Kit",
      descriptor: "Bathroom spray, toilet cleaner, and Cotton Cloth.",
      short: "Bathroom Spray + Toilet Cleaner + Cotton Cloth.",
      rooms: ["bathroom"],
      restockId: "bathroom-restock",
      includes: ["bathroom-cleaner", "toilet-cleaner"],
      accessories: ["cotton-cloth"],
      contents: [
        { productId: "bathroom-cleaner", format: "bottle" },
        { productId: "toilet-cleaner", format: "bottle" },
        { productId: "cotton-cloth", format: "default" },
      ],
      helper: "Bottles and cloth for the bathroom",
    }),
    kit({
      id: "surfaces-set",
      kitFamily: "room",
      name: "Surfaces Kit",
      descriptor: "Surface spray, floor cleaner, and Cotton Cloth.",
      short: "Surface Spray + Floor Cleaner + Cotton Cloth.",
      rooms: ["surfaces"],
      restockId: "surfaces-restock",
      includes: ["surface-cleaner", "floor-cleaner"],
      accessories: ["cotton-cloth"],
      contents: [
        { productId: "surface-cleaner", format: "bottle" },
        { productId: "floor-cleaner", format: "bottle" },
        { productId: "cotton-cloth", format: "default" },
      ],
      helper: "Bottles and cloth for surfaces",
    }),
    kit({
      id: "home-essentials-kit",
      kitFamily: "house",
      name: "Home Essentials Kit",
      descriptor: "All 6 Essentials bottles, Cotton Cloth pack of 3, Eco Dishwash Scrub.",
      short: "All 6 bottles, Cotton Cloth pack of 3, Eco Dishwash Scrub.",
      rooms: ["whole-home"],
      restockId: "home-restock",
      includes: allFormulaIds,
      accessories: ["cotton-cloth", "eco-dishwash-scrub"],
      contents: allFormulaIds
        .map((id) => ({ productId: id, format: "bottle" }))
        .concat([
          { productId: "cotton-cloth", format: "default", qty: 3 },
          { productId: "eco-dishwash-scrub", format: "default" },
        ]),
      image: "complete-home-set.jpg",
      helper: "The house, in bottles",
    }),
    kit({
      id: "home-keep-going-kit",
      kitFamily: "house",
      name: "Ultimate Essentials Kit",
      descriptor: "All 6 bottles, all 6 pouches, Cotton Cloth pack of 3, Eco Dishwash Scrub.",
      short: "All 6 bottles, all 6 pouches, Cotton Cloth pack of 3, Eco Dishwash Scrub.",
      rooms: ["whole-home"],
      restockId: "home-restock",
      includes: allFormulaIds,
      accessories: ["cotton-cloth", "eco-dishwash-scrub"],
      contents: allFormulaIds
        .flatMap((id) => [
          { productId: id, format: "bottle" },
          { productId: id, format: "pouch" },
        ])
        .concat([
          { productId: "cotton-cloth", format: "default", qty: 3 },
          { productId: "eco-dishwash-scrub", format: "default" },
        ]),
      image: "complete-home-set.jpg",
      helper: "Bottles, pouches, and tools",
    }),
  ];

  const restockHow = [
    "Open the pouch that matches the bottle.",
    "Pour into the bottle you kept.",
    "A 500 ml bottle takes two fills; a 1 L bottle takes one.",
  ];

  const restocks = [
    kit({
      id: "home-restock",
      merchPath: "restock",
      productType: "Restock",
      kitFamily: "house",
      name: "Home Restock Pack",
      descriptor: "All 6 Restock pouches. Keep the bottles.",
      short: "All 6 Restock pouches.",
      rooms: ["whole-home"],
      includes: allFormulaIds,
      accessories: [],
      contents: allFormulaIds.map((id) => ({ productId: id, format: "pouch" })),
      image: "home-restock.jpg",
      helper: "Pouches only. Keep the bottles you already have.",
      how: restockHow,
    }),
    kit({
      id: "kitchen-restock",
      merchPath: "restock",
      productType: "Restock",
      kitFamily: "room",
      name: "Kitchen Restock Pack",
      descriptor: "Dishwash Liquid and Kitchen Degreaser Spray pouches. Keep the bottles.",
      short: "Dishwash Liquid + Kitchen Degreaser Spray Restock pouches.",
      rooms: ["kitchen"],
      includes: ["dishwash", "kitchen-degreaser"],
      accessories: [],
      contents: [
        { productId: "dishwash", format: "pouch" },
        { productId: "kitchen-degreaser", format: "pouch" },
      ],
      image: "kitchen-restock.jpg",
      helper: "Pouches only. Keep the bottles you already have.",
      how: restockHow,
    }),
    kit({
      id: "bathroom-restock",
      merchPath: "restock",
      productType: "Restock",
      kitFamily: "room",
      name: "Bathroom Restock Pack",
      descriptor: "Bathroom Spray and Toilet Cleaner pouches. Keep the bottles.",
      short: "Bathroom Spray + Toilet Cleaner Restock pouches.",
      rooms: ["bathroom"],
      includes: ["bathroom-cleaner", "toilet-cleaner"],
      accessories: [],
      contents: [
        { productId: "bathroom-cleaner", format: "pouch" },
        { productId: "toilet-cleaner", format: "pouch" },
      ],
      image: "bathroom-restock.jpg",
      helper: "Pouches only. Keep the bottles you already have.",
      how: restockHow,
    }),
    kit({
      id: "surfaces-restock",
      merchPath: "restock",
      productType: "Restock",
      kitFamily: "room",
      name: "Surfaces Restock Pack",
      descriptor: "Surface Spray and Floor Cleaner pouches. Keep the bottles.",
      short: "Surface Spray + Floor Cleaner Restock pouches.",
      rooms: ["surfaces"],
      includes: ["surface-cleaner", "floor-cleaner"],
      accessories: [],
      contents: [
        { productId: "surface-cleaner", format: "pouch" },
        { productId: "floor-cleaner", format: "pouch" },
      ],
      image: "surfaces-restock.jpg",
      helper: "Pouches only. Keep the bottles you already have.",
      how: restockHow,
    }),
  ];

  function entry(id, format) {
    return format ? { id: id, format: format } : { id: id };
  }

  AEVA.products = formulas.concat(starters, kits, restocks, accessories);
  AEVA.kits = kits.filter((k) => k.kitFamily === "room");
  AEVA.collections = {
    "shop-start": starters.map((p) => entry(p.id)),
    "shop-rooms": ["kitchen-set", "bathroom-set", "surfaces-set"].map((id) => entry(id)),
    "shop-house": ["home-essentials-kit", "home-keep-going-kit"].map((id) => entry(id)),
    "shop-kits": starters
      .map((p) => entry(p.id))
      .concat(["kitchen-set", "bathroom-set", "surfaces-set"].map((id) => entry(id)))
      .concat(["home-essentials-kit", "home-keep-going-kit"].map((id) => entry(id))),
    "shop-essentials": formulas.map((p) => entry(p.id, "bottle")),
    "shop-restock": ["home-restock", "kitchen-restock", "bathroom-restock", "surfaces-restock"]
      .map((id) => entry(id))
      .concat(formulas.map((p) => entry(p.id, "pouch"))),
    "shop-accessories": ["cotton-cloth", "eco-dishwash-scrub"].map((id) => entry(id)),
    "shop-kitchen": ["kitchen-set", "dishwash", "kitchen-degreaser", "eco-dishwash-scrub", "cotton-cloth"].map((id) => entry(id)),
    "shop-bathroom": ["bathroom-set", "bathroom-cleaner", "toilet-cleaner", "cotton-cloth"].map((id) => entry(id)),
    "shop-surfaces": ["surfaces-set", "surface-cleaner", "floor-cleaner", "cotton-cloth"].map((id) => entry(id)),
    "kits-start": starters.map((p) => entry(p.id)),
    "kits-rooms": ["kitchen-set", "bathroom-set", "surfaces-set"].map((id) => entry(id)),
    "kits-house": ["home-essentials-kit", "home-keep-going-kit"].map((id) => entry(id)),
    "kits-accessories": ["cotton-cloth", "eco-dishwash-scrub"].map((id) => entry(id)),
    "kits-all": starters
      .map((p) => entry(p.id))
      .concat(["kitchen-set", "bathroom-set", "surfaces-set"].map((id) => entry(id)))
      .concat(["home-essentials-kit", "home-keep-going-kit"].map((id) => entry(id))),
    "restock-house": [entry("home-restock")],
    "restock-kitchen": [entry("kitchen-restock"), entry("dishwash", "pouch"), entry("kitchen-degreaser", "pouch")],
    "restock-bathroom": [entry("bathroom-restock"), entry("bathroom-cleaner", "pouch"), entry("toilet-cleaner", "pouch")],
    "restock-surfaces": [entry("surfaces-restock"), entry("surface-cleaner", "pouch"), entry("floor-cleaner", "pouch")],
    "restock-all": [entry("home-restock")]
      .concat([entry("kitchen-restock"), entry("dishwash", "pouch"), entry("kitchen-degreaser", "pouch")])
      .concat([entry("bathroom-restock"), entry("bathroom-cleaner", "pouch"), entry("toilet-cleaner", "pouch")])
      .concat([entry("surfaces-restock"), entry("surface-cleaner", "pouch"), entry("floor-cleaner", "pouch")]),
    "kitchen-jobs": [entry("dishwash", "bottle"), entry("kitchen-degreaser", "bottle")],
    "kitchen-starters": [entry("dishwash-starter"), entry("degreaser-starter")],
    "kitchen-carousel": [entry("dishwash-starter"), entry("degreaser-starter"), entry("eco-dishwash-scrub"), entry("cotton-cloth")],
    "kitchen-restock-feature": [entry("kitchen-restock")],
    kitchen: [
      entry("kitchen-set"),
      entry("dishwash", "bottle"),
      entry("kitchen-degreaser", "bottle"),
      entry("kitchen-restock"),
      entry("dishwash", "pouch"),
      entry("kitchen-degreaser", "pouch"),
      entry("dishwash-starter"),
      entry("degreaser-starter"),
    ],
    "bathroom-jobs": [entry("bathroom-cleaner", "bottle"), entry("toilet-cleaner", "bottle")],
    "bathroom-starters": [entry("bathroom-starter"), entry("toilet-starter")],
    "bathroom-carousel": [entry("bathroom-starter"), entry("toilet-starter"), entry("cotton-cloth")],
    "bathroom-restock-feature": [entry("bathroom-restock")],
    bathroom: [
      entry("bathroom-set"),
      entry("bathroom-cleaner", "bottle"),
      entry("toilet-cleaner", "bottle"),
      entry("bathroom-restock"),
      entry("bathroom-cleaner", "pouch"),
      entry("toilet-cleaner", "pouch"),
      entry("bathroom-starter"),
      entry("toilet-starter"),
    ],
    "surfaces-jobs": [entry("surface-cleaner", "bottle"), entry("floor-cleaner", "bottle")],
    "surfaces-starters": [entry("surface-starter"), entry("floor-starter")],
    "surfaces-carousel": [entry("surface-starter"), entry("floor-starter"), entry("cotton-cloth")],
    "surfaces-restock-feature": [entry("surfaces-restock")],
    surfaces: [
      entry("surfaces-set"),
      entry("surface-cleaner", "bottle"),
      entry("floor-cleaner", "bottle"),
      entry("surfaces-restock"),
      entry("surface-cleaner", "pouch"),
      entry("floor-cleaner", "pouch"),
      entry("surface-starter"),
      entry("floor-starter"),
    ],
    "kitchen-also": [
      entry("eco-dishwash-scrub"),
      entry("cotton-cloth"),
      entry("bathroom-set"),
      entry("surfaces-set"),
      entry("home-essentials-kit"),
    ],
    "bathroom-also": [
      entry("cotton-cloth"),
      entry("kitchen-set"),
      entry("surfaces-set"),
      entry("home-essentials-kit"),
    ],
    "surfaces-also": [
      entry("cotton-cloth"),
      entry("kitchen-set"),
      entry("bathroom-set"),
      entry("home-essentials-kit"),
    ],
  };

  window.AEVA = AEVA;
})();

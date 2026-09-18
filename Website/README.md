# Aeva Essentials — spec mock

Clickable HTML storefront for the production design spec (`docs/AEVA-WEBSITE-DESIGN.md`). Not live Shopify checkout.

**Range:** 6 formulas (Essentials bottle + Restock pouch), 6 starters, 3 room kits, 3 house kits, 2 accessories.  
**Prices:** TBD (`₹—`). ATC disabled until prices exist.

## Run

```bash
cd /Users/batmaninc/Projects/aeva-essentials/Website
python3 -m http.server 8081
```

→ http://localhost:8081/home.html

| Page | File | URL |
|---|---|---|
| Home | `home.html` | `/` |
| Shop all | `shop.html` | `/collections/all` |
| Starter Kits | `kits.html` | `/collections/kits` |
| Restock | `refills.html` | `/collections/restock` |
| Kitchen | `kitchen.html` | `/collections/kitchen` |
| Bathroom | `bathroom.html` | `/collections/bathroom` |
| Surfaces | `surfaces.html` | `/collections/surfaces` |
| Formula PDP | `product.html?id=dishwash` | `/products/dishwash-liquid` |
| Kit PDP | `kit.html?id=kitchen-set` | `/products/kitchen-kit` |
| Starter PDP | `starter.html?id=dishwash-starter` | `/products/dish-starter` |
| Cotton Cloth | `product.html?id=cotton-cloth` | `/products/cotton-cloth` |
| Eco Dishwash Scrub | `product.html?id=eco-dishwash-scrub` | `/products/eco-dishwash-scrub` |

Header: Shop all · Starter Kits · Restock · Kitchen · Bathroom · Surfaces. Accessories is a section on Shop all and Starter Kits, not a tab.

Cart key: `aeva.spec.cart.v1`

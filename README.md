# Five Loaves & Two Fish Website

**Live Demo:** https://ghostassa.github.io/five-loaves-two-fish-site/

**Admin Panel (private — bookmark this URL):** https://ghostassa.github.io/five-loaves-two-fish-site/admin.html

A responsive, static campus restaurant site for **Five Loaves & Two Fish** with menu browsing, cart management, and WhatsApp order checkout.

## Key Features
- Full menu browsing experience with Dishes, Soups, Proteins, and Extras
- **Special Packages** section with two curated value bundles and selectable substitutions
- Floating cart icon with live item count and cart modal
- Quantity controls, item removal, and localStorage cart persistence
- WhatsApp order checkout with pre-formatted message
- Fish, Chicken, Bread, Egg, and Swallow variant pricing selectors
- Reviews page with star rating and share options
- Responsive UI designed for mobile and desktop
- Admin availability panel (not linked in customer nav — access via direct URL)

## Menu Items
### Dishes
Exclusive White Rice, Swallow, Exclusive Jollof Rice, Exclusive Fried Rice, Stir Fry Spag, Special Noodles, Boiled Yam, Hot Moi Moi, Beans, Coleslaw

### Soups
Ewedu, Gbegiri, Abula, Egusi, Efo Riro, Okra, Stew

### Proteins
Fried Egg, Boiled Egg, Beef, Fish, Chicken, Bread, Goat Meat

### Also Available
Ponmo, Plantain, Assorted Meat

### Special Packages
- **Ultimate Feast** (₦2,500) — Jollof Rice × 3, Fried Rice × 2 (or Spag), Plantain, Big Chicken, Coleslaw (or swap)
- **Campus Special** (₦1,500) — Jollof Rice × 2, Fried Rice × 1 (or Spag), Plantain, Chicken

## Repository Structure
- `index.html` — Home page
- `menu.html` — Full menu and ordering interface
- `order.html` — Order workflow and cart instructions
- `about.html` — Restaurant story and values
- `contact.html` — Contact details and location
- `reviews.html` — Customer reviews and submission form
- `admin.html` — Admin availability panel (not linked from customer nav)
- `styles.css` — Site styling and responsive layout
- `cart.js` — Cart logic and WhatsApp integration
- `availability.js` — Dish availability system (admin + menu)
- `script.js` — Supporting page interactions

## Admin Panel
The admin panel is **not linked** from the customer-facing navigation. Access it directly at:

```
https://ghostassa.github.io/five-loaves-two-fish-site/admin.html
```

From the admin panel you can toggle availability on/off for every item on the menu. Changes are stored in the browser's localStorage, so use the same device/browser that customers interact with.

> **Note:** A fully separate admin deployment (different domain) would require a shared backend (e.g. Firebase) for availability data to sync, since localStorage is origin-bound. The current setup keeps admin.html in the same repo so availability changes instantly reflect on the customer menu.

## Run Locally
1. Open the repository folder in VS Code
2. Open `index.html` directly in a browser
3. Or run a local server:
   ```powershell
   cd "c:\Users\DANIEL R\Desktop\Fives Loaves"
   python -m http.server 8000
   ```
4. Visit `http://localhost:8000`

## Deployment
The site is deployed on GitHub Pages from the `gh-pages` branch.

**Live Site:** https://ghostassa.github.io/five-loaves-two-fish-site/

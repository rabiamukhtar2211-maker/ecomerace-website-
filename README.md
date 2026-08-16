# Lumière Aura — Luxury Perfume & Skincare (React + JavaScript)

Standalone Vite + React (JavaScript) build with **two completely separate sides**:

- `src/user/` — customer storefront (home, shop, perfumes, skincare, gifts, product detail, cart, checkout, wishlist, journal, about, FAQ, contact)
- `src/admin/` — staff control panel (dashboard, products, orders, customers, analytics, settings)
- `src/shared/` — shared data, cart context, images

No admin links appear anywhere on the customer site. The admin panel is reached
only by opening `/admin-login` directly.

## Run in VS Code

1. Install [Node.js](https://nodejs.org) 18 or newer.
2. Open this folder in VS Code, then in the terminal:

```bash
npm install
npm run dev
```

3. Open http://localhost:5173

Build for production: `npm run build` (output in `dist/`).

## Admin demo login

Open http://localhost:5173/admin-login

- Email: `admin@lumiere.com`
- Password: `admin123`

(Demo auth only — stored in localStorage. Replace with a real backend before going live.)

## Libraries used

| Library | Purpose |
| --- | --- |
| react / react-dom | UI |
| react-router-dom | routing for both sides |
| tailwindcss v4 + @tailwindcss/vite | styling / design tokens |
| lucide-react | icons |
| recharts | admin charts |
| sonner | toast notifications |
| vite + @vitejs/plugin-react | dev server & build |

Recommended VS Code extensions: ESLint, Tailwind CSS IntelliSense, Prettier.

## Structure

```
src/
  App.jsx              all routes (user + admin)
  main.jsx             entry
  styles.css           design system (purple / pink / gold tokens)
  user/
    components/        Navbar, Footer, ProductCard, ShopGrid, SiteLayout
    pages/             storefront pages
  admin/
    components/        AdminShell (sidebar layout + auth guard)
    pages/             dashboard, products, orders, customers, analytics, settings, login
  shared/
    lib/               products.js (30 products + demo orders/customers), cart.jsx, router.jsx
    assets/            all product & hero images (JPG)
```

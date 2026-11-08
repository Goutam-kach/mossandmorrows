# Morrow & Moss storefront

The Git repository root is the parent `mossandmorrows/` folder; this nested `crochet/` folder is the Astro app root. Business settings, the Formspree ID, and every Astro image reference are centralized in [`site.config.json`](site.config.json). The root `index.html` is a standalone styling preview only; the full route transitions and Three.js thread are available when you run the Astro app with `npm run dev`.

## Project structure

```text
site.config.json
src/
	components/
		Breadcrumbs.astro
		CustomOrderForm.astro
		ProductCard.astro
		ProductGallery.astro
		SiteFooter.astro
		SiteHeader.astro
		ThreadJourney.astro
	content/products/
	layouts/SiteLayout.astro
	pages/
		index.astro
		shop/index.astro
		shop/[slug].astro
		custom-orders.astro
		about.astro
		contact.astro
		privacy.astro
		404.astro
		robots.txt.ts
		sitemap.xml.ts
	styles/
		experience.css
		tokens.css
		global.css
tests/playwright/storefront.spec.ts
public/
	assets/
```

## Configure the site

- Change the brand name, wordmark, tagline, domain, and contact email in `site.config.json`.
- Put every image in `public/assets/`, then update the matching `src` and `alt` values under `assets` in `site.config.json`. Use paths such as `/assets/hero.webp`.
- Create a Formspree form and paste only its form ID into `formspree.formId`. Leave it blank to keep the prefilled-email fallback. No private API key is needed.

## Install and run on Windows

1. Install the current Node.js LTS Windows installer from [nodejs.org](https://nodejs.org/en/download/). Keep the npm package manager and PATH options enabled.
2. Close and reopen VS Code. To view only the clone, choose **File > Open Folder...** and select the `mossandmorrows/` Git root. Open its `crochet/` child in the Explorer. Run npm from that child folder, which contains `package.json`, `astro.config.mjs`, and `site.config.json`.
3. Confirm Node and npm are available, install dependencies, and start Astro:

```powershell
cd "$HOME\Downloads\Personal\crochet\mossandmorrows\crochet"
node --version
npm --version
npm install
npx playwright install chromium
npm run dev
```

4. Open the local URL Astro prints, normally `http://localhost:4321/`.

Run `npm run check` for diagnostics, `npm run test:e2e` for desktop and mobile Playwright coverage, `npm run build` for the static production build, and `npm run preview` to preview `dist/`. The Playwright test command starts Astro automatically. Git commands and `.gitignore` are at the parent `mossandmorrows/` repository root.

## Replace before publishing

- Replace the sample brand, contact email, site URL, and photo references in `site.config.json`.
- Replace the Unsplash image URLs with your own work by placing files in `public/assets/` and editing the config's image paths and alt text. Product descriptions and names stay in `src/content/products/`.
- Update the sample product names, categories, prices, and availability to match the real collection.
- Add the Formspree form ID in `site.config.json`, then submit a real test order and confirm delivery in Formspree.
- Update the domain in `site.config.json`; canonical metadata, JSON-LD, `robots.txt`, and `sitemap.xml` derive from it.
- Configure 301 redirects at the hosting provider. Add analytics only if needed, with the appropriate consent flow, and verify the live site in Search Console.
- Review and update the Astro privacy page for the final form provider, analytics, shipping regions, and applicable privacy requirements.

## Current interactions

- Mobile navigation menu with keyboard escape support.
- Collection filters for wearables and home pieces.
- Product links preselect a custom-order item.
- Custom order form validates required fields, submits to Formspree when configured, and otherwise opens a prefilled email.
- Three.js draws a braided thread and crochet hook inside the making-journey section; the scene scrolls with the page and the hook follows the thread as that section enters view.
- Astro view transitions connect page navigation and matching product images.
- Scroll reveals respect reduced-motion preferences.

## Production checklist

- [x] Pre-rendered HTML is delivered with the page content; this static site does not use runtime server-side rendering.
- [x] `robots.txt` and `sitemap.xml` are generated from the domain in `site.config.json`.
- [x] Home, privacy, and 404 pages have distinct title tags.
- [x] Pages have meta descriptions.
- [x] Each page has one H1.
- [x] Canonical URLs are set on index and privacy pages; replace the example domain.
- [x] Open Graph title, description, URL, and image are set for the home page.
- [x] A custom `404.html` is included; configure the host to serve it for missing routes.
- [ ] Configure required 301 redirects at the hosting provider.
- [x] Content images have descriptive alt text.
- [x] Unsplash image URLs request automatic modern image formats with `auto=format`; replace with optimized product photos.
- [x] Below-the-fold images use native lazy loading.
- [x] Organization JSON-LD is included; replace the example business details.
- [x] Breadcrumb navigation is present on the privacy page; the shop is a single-page collection.
- [x] Main navigation and key page actions use internal links.
- [ ] Google Analytics is not connected. Add it only if needed and configure consent/privacy requirements.
- [ ] Verify the production domain in Google Search Console.
- [x] A starter privacy page is included; update it for the actual business, host, and order process.
- [ ] Add the Formspree form ID in `site.config.json` and confirm a real submission arrives before launch.

Also replace the sample brand and product copy, and replace the reference photos with your own work. Review image crops on mobile and desktop before publishing.

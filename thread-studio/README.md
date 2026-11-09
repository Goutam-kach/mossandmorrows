# Thread Studio

A self-contained, no-build Morrow & Moss website. This is the repository's only website; it replaces the previous Astro application and legacy preview.

## Open

Double-click `index.html`, or open it in a current Edge, Chrome, Firefox, or Safari browser. There is no npm install, development server, or compilation step. All runtime libraries, photographs, icons, and fonts are included locally.

This folder is the website. Open `thread-studio/index.html` from the repository root.

## Experience

- A full-viewport Three.js scene starts with two separated textured yarn balls (sage and coral) and two crochet hooks. Each strand stays attached to a winding on its rotating, shrinking source ball and to its hook tip. Both hooks travel from the first scroll, follow their matching planter stitches row by row, and trace their respective birds. Both source balls remain visible in the finished composition.
- Three scroll-driven making stages. Both yarn colors are worked into every planter round as alternating sage and coral crochet loops, with a lightly irregular stitch path. The terracotta planter grows into a leafy plant with flowers, followed by two fully covered amigurumi birds, one teal and one coral, with dense crochet-loop surface texture across their rounded bodies, heads, bellies, and layered flapping wings. The birds fly left in separated lanes. This is a stylized Three.js crochet illustration, not a physical crochet simulation.
- The birds form one at a time, flap their 3D wings independently, and fly from right to left as scrolling advances. Scrolling backwards returns them to their perches and reveals the crochet forms in reverse.
- The hook and connecting yarn respond from the first scroll at the top of the page, without waiting for the making section. There is no separate vertical strand along the later sections.
- A dark-sage header, warm-paper lettering, and copper edge retain the same palette with stronger contrast.
- The scene follows page scroll and respects the operating system's reduced-motion preference.
- Smooth anchor navigation, scroll reveals, photo parallax, and an animated text ribbon.
- Responsive collection filters, enlarged image previews, and product-specific inquiries.
- Reduced-motion support, keyboard navigation, and a static yarn fallback when WebGL is unavailable.
- Animation pauses when reduced motion is enabled or the browser tab is hidden. The large 3D objects leave the viewport after the making journey.

## Edit

`site.config.js` contains the brand, email, Formspree ID, photo paths, and collection entries. Keep its JavaScript syntax intact. It contains public information only; never put API secrets here.

Drop replacement photos into `assets/`, then update the corresponding config paths and alt text. Paths are relative, such as `assets/my-blanket.jpg`, not `/assets/my-blanket.jpg`. Current product categories are `blankets` and `custom`. Each product's `inquiry` supplies the order-form selection.

The current photos are downloaded crochet reference images, not the business's product photography. Their source URLs and license information are in `assets/SOURCES.md`. Replace them with your own work before presenting the gallery as products for sale. Update the moodboard/reference disclosures at that time.

Page copy and default metadata live in `index.html`. Palette, typography, and layout live in `styles.css`; the 3D composition is in `scene.js`; UI behavior is in `app.js`.

## Inquiries

With `formspreeId: ''`, the form prepares an email link; the visitor must open their email application and send the message. It does not claim delivery.

To receive submissions directly, create a Formspree form, verify its destination email, and put the public form ID in `site.config.js`. Publish to an HTTPS static host and test an actual submission. The UI handles pending, success, and failure states and retains an email alternative. No real Formspree delivery has been tested; browser tests used mocked responses.

The default brand, contact address, copy, and collection are placeholders. This is an inquiry storefront, not a checkout or stock-management system. Review the privacy wording and your Formspree settings before collecting customer data.

## Deploy

Upload the entire contents of this folder to any static HTTPS host. There is no build command; the publish directory is `thread-studio` relative to the repository root. Keep the `assets` and `vendor` directories with the HTML. Relative URLs also support hosting under a subdirectory. Remove any old Astro build command or `crochet/dist` publish setting from your host.

No analytics, cookies, remote font requests, or runtime CDN requests are included. Formspree is contacted only when configured and submitted.

## Commit Checklist

- [x] Standalone site moved to the repository-root `thread-studio` folder; obsolete `crochet` app removed.
- [x] Local libraries, fonts, photos, configuration, source credits, and licenses retained. No Node installation or build required.
- [x] Relocated page loads, local images decode, fonts load, and the 3D scene starts without runtime errors.
- [x] Mobile navigation, collection filters, photo preview and Escape, inquiry selection, and reduced motion checked.
- [x] Email fallback and mocked Formspree success/failure checked without sending real inquiries; unavailable-WebGL fallback checked.
- [x] Yarn attachments, both hooks, progressive stitches, reverse scrolling, and responsive layouts checked as described below.
- [x] Windows, publish, and Git instructions updated for the new layout. No commit or push performed automatically.

Ready to commit as a placeholder site, not yet ready to present as a live customer storefront:

- [ ] Replace placeholder brand/contact details and reference photos with your business information and work.
- [ ] Configure the real Formspree destination if wanted, deploy over HTTPS, and verify actual inquiry delivery.
- [ ] Review privacy wording and retention settings; check the deployed site on real phones and Safari/Firefox.

## Verification

Verified in the integrated Chromium browser on Windows:

- Current 3D plant/bird journey: screenshots at 390 x 844 and 1440 x 960; widths 320, 390, 607 x 404, 768, 1440, and 1920, with no horizontal overflow or bird overlap with headings, paragraphs, or progress labels at sampled stages.
- Rendered mobile and desktop screenshots, loaded local images/fonts, and checked WebGL output and runtime errors. The separate page-spanning strand was removed.
- Early-scroll regression check at widths 390 and 1440: the hook moves and the ball begins shrinking at scroll positions 20, 100, and 300 pixels, before the making section. This immediate-scroll start is retained in the plant scene.
- The planter and leaves finish before the two fully stitched birds form. Both balls and hooks remain visible, and each working strand connects its colored source to its corresponding hook. The birds' positions move left across successive scroll stages, and their wing angles change during flight.
- Attachment regression: both strand endpoints remain within floating-point tolerance of their winding anchors and hook tips throughout sampled progress at all six viewport sizes. Both hooks move before and during planter construction; all 324 planter stitches appear and reset on reverse scroll. Desktop/mobile screenshots and live-render pixel checks confirm visible output. The mobile sage source clears the journey heading.
- Reduced-motion mode freezes frame advancement and wing angles. Reverse scrolling removes the birds and growing plant. The layered color palette includes sage, cream, teal, coral, marigold, and terracotta.
- Header foreground/background contrast: approximately 7.5:1.
- Reduced-motion mode pauses the 3D scene; normal scrolling controls its progress.
- Mobile menu, Escape, filters, image preview, and inquiry preselection.
- Email fallback, mocked Formspree success/error, reduced-motion mode, and simulated unavailable WebGL.

Actual iOS/Android hardware, Safari/Firefox rendering, live email delivery, and deployed-host settings still need a pre-launch check.

## Libraries

Three.js 0.160.1 and Lucide 0.468.0 are vendored with their licenses. Three.js uses its classic browser build so direct `file://` opening works without a module server; its upstream deprecation warning is expected. Do not replace it with a newer ES-module file without adapting the script loading. Fraunces and Manrope are locally hosted open-source fonts with license files in `assets/`.

See `guidelines.txt` for exact Windows and Git commands. No commit or push was performed automatically.
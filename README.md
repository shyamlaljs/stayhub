# StayHub

An independently built student housing finder demo for exploring PG stays and shared rooms across Indian cities. The visual design, front-end implementation, and sample listings in this project were created from scratch; no code or images were copied from the shared PGLife archive.

**Live demo:** https://stayhub-seven-pink.vercel.app/

## What it does

- Search by city, neighbourhood, or listing name
- Filter by monthly rent, room type, audience, amenities, and verified status
- Sort by price or review score and share a filtered search with a URL
- Save stays between visits and build a comparison of up to three homes
- Compare rent, deposit, move-in estimate, amenities, availability, and reviews
- Open a detail view with house notes and use the interactive stay-cost estimator
- Adapt to narrow mobile screens and support keyboard navigation

Listings and ratings are sample data. Cost figures are planning estimates. This demo has no user accounts, real enquiries, reservations, payment processing, or live inventory.

## Run locally

This project has no build step or package dependencies. Open `index.html` in a browser, or serve the folder with a local static server, for example:

```bash
python -m http.server 5173
```

Then visit `http://localhost:5173`.

## Built with

- HTML, CSS, and JavaScript
- Browser `localStorage` for the saved stays shortlist
- CSS and inline interface illustration; no property photos are bundled

## Attribution

This is an original portfolio project built around a general student-housing search concept. The PGLife ZIP shared for reference was incomplete and contained no license file, so its source code and assets were not reused. Ask the original author for a complete source URL and license before reusing any of that project.

## License

No license has been added. All rights are reserved by default; contact the author before reusing this code or its visual assets.

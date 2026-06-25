# NYC Headlights — Business Information

> Reference for the homepage rebrand (from client brief + https://nycheadlights.com, 2026-06-25).

## Identity
- **Name:** NYC Headlights
- **Tagline:** NYC's precision headlight specialists
- **Headline:** "Precision Optics for the City that Never Sleeps"
- **Positioning:** OEM headlight specialists for BMW, Mercedes-Benz, Lexus, Audi, Toyota & Mazda — trained optics specialists, not general mechanics.

## Contact
- **Phone:** (929) 409-9330
- **Email:** jerry@nycheadlights.com
- **Location:** New York City (all five boroughs); walk-in service available

## Hours
- Mon–Sat: 9AM – 7PM
- Sunday: By Appointment

## Services
1. **OEM Replacement** — Factory-direct optics for all major makes and models. Certified parts with full warranty.
2. **Restoration & Refurbish** — Lens restoration, moisture removal, wiring repair, ballast diagnostics.
3. **Aftermarket Upgrades** — Performance LED & laser conversions, projector retrofits, custom DRL installs.
4. **Wholesale & Recycling** — Used headlight assembly purchasing and core recycling; trade pricing for shops.

## Selling points / stats
- 10,000+ headlight parts in stock
- 24-hour turnaround capability; most repairs 3–5 days, express options available
- Direct manufacturer relationships — authenticated, warranted parts
- Technicians are trained optics specialists, not general mechanics

## Service area
All five boroughs of NYC: Manhattan, Brooklyn, Queens, the Bronx, Staten Island.

## Assets (scraped from nycheadlights.com, 2026-06-25)
Stored under `public/assets/nych/`:
- `logo.png` — official white line-art logo (headlight + NYC skyline, transparent). Inverted to
  black via CSS for the light header; used as-is (white) in the dark footer.
- `favicon.png` — site favicon.
- `hero-headlight.jpg` — lit chrome headlight; used as the hero background.
- `audi.avif` — black Audi front-end; used as the CTA backdrop.
- `gallery/g1–g7.jpg` — real OEM headlight assemblies; g1/g4/g6/g5 power the "Featured OEM
  Headlights in Stock" product cards (g2/g3/g7 are spares).
- `brands/{bmw,mercedes-benz,audi,toyota,lexus,mazda}.png` — official manufacturer logos
  (car-logos-dataset) for the "Shop OEM Headlights by Vehicle" cards.

## Homepage sections (matching the live site)
01 Services · 02 Featured OEM Headlights in Stock · 03 Shop OEM Headlights by Vehicle ·
04 Service Areas · 05 Process. Featured/by-vehicle copy is lifted verbatim from nycheadlights.com.

## Notes for future expansion
- Home page only for now (single-page React/Vite site).
- "Makes We Service" is a text-badge grid; can become real OEM brand logos later.
- Accent color is a headlight-beam blue (`--red: #1e7fff` in `src/index.css`).
- Original full-res versions of the gallery photos (1707px–2560px) exist on the live site if
  larger sources are needed; we pulled the 1024px renditions for weight.

# Next session prompt

Copy everything below the line into a fresh session started from the repo root.

---

Convert this repo's React SPA into an editable WordPress theme on the live
Hostinger site, following `docs/SPA-TO-WORDPRESS-THEME-PLAYBOOK.md`.

Read `CLAUDE.md` and the playbook first. The playbook is written for SiteGround
and must be ported to Hostinger — details below.

## Current state

The live site at https://nycheadlights.com is **WordPress 7.1.2 + Elementor** on
the `hello-elementor` theme. It serves real customers. This repo is a separate,
never-launched React 18 + Vite rebrand (`src/App.jsx`, 575 lines). The goal is to
replace the Elementor front end with a generated theme built from this repo,
keeping WordPress as the CMS/backend per the playbook.

A static build of the repo is already deployed to https://nycheadlights.com/staging/
via `make deploy`. The live WordPress site is untouched by it.

## Connection facts (playbook §0.0 — already established, do not re-ask)

| Fact | Value |
|---|---|
| SSH alias | `ssh NYCH` (configured in `~/.ssh/config`) |
| User / host / port | `u837167039` / `145.79.4.82` / **65002** |
| Private key | `~/.ssh/nycheadlights_ed25519` |
| Live domain | `nycheadlights.com` |
| Doc root | `~/domains/nycheadlights.com/public_html` |
| Staging dir | `<docroot>/staging` (noindex robots.txt) |
| Theme slug | **decide with the user** |

Server has WP-CLI 2.12, PHP 8.2.33, git, composer, rsync. **No Node** — build
locally, rsync the result up.

## Porting the playbook from SiteGround → Hostinger

1. **Port 65002**, not 18765.
2. **Doc root is `domains/<domain>/public_html`**, not `www/<domain>/public_html`.
3. **Cache purging is different and matters.** The playbook calls `wp sg purge`
   and `sg_cachepress_purge_cache()` after every save (§4.1, §7). Neither exists
   on Hostinger. `wp cache flush` works; there is an `advanced-cache.php` dropin
   and a Hostinger CDN in front (`server: hcdn`). Replace every SiteGround cache
   call with a Hostinger equivalent, and do not leave the save handler silently
   failing to purge.
4. The orphaned `sg-cachepress`, `sg-security`, `sg-ai-studio` plugins are still
   installed from the old host and should be removed.
5. A `Makefile` already exists in this repo with a working rsync-over-SSH deploy
   to the staging dir. Extend it with the playbook's targets rather than
   replacing it wholesale.

## Gaps to close before the theme generator (playbook §1.2)

| Prerequisite | Status |
|---|---|
| Pure client-rendered React SPA | met |
| `base: "./"` in `vite.config.js` | currently `process.env.VITE_BASE \|\| '/'` — reconcile |
| History-based routing | **missing — no router at all; multi-page is required, so this must be built** |
| `getText(key, default)` content layer | **missing — 46 strings + 5 assets hardcoded** |

`src/App.jsx` is one scrolling page with anchor sections (`services`, `faq`,
`inventory`, `vehicles`, `areas`, `categories`, `trade`, `quote`). Those are
anchors, not routes.

## Decisions already made (do not re-ask)

1. **Multi-page.** Every page gets a real, crawlable URL and its own Yoast
   fields — not anchor links on one scrolling page. This means React Router with
   `BrowserRouter`, a route list kept in sync with `xo_required_pages()`, and one
   WordPress page per route (playbook §1.1, §1.4b).
2. **Elementor is being retired entirely.** Elementor Pro's missing license is
   therefore moot — do not chase it. Once the generated theme is proven, Elementor,
   Elementor Pro, and the addon plugins all come out.
3. **Companion doc resolved.** `docs/WORDPRESS-SITE-SETUP-AND-LEADS.md` now
   resolves, holding Part A (admin page) and Part B (Leads) PHP, written against
   an `acme` prefix — substitute `xo`. Like the playbook beside it, it is a
   **symlink** into the iDeal Auto Collision repo, not a copy — see CLAUDE.md.

## Still to confirm with the user

1. **Theme slug** (playbook §0.0).
2. **The route list and slugs.** Proposal below — confirm before building, since
   slug choices affect what stays indexed.

| Route | Source | Note |
|---|---|---|
| `/` | Home | existing front page |
| `/services` | `services` section | new |
| `/oem-headlights` | `inventory` + `vehicles` sections | **keep slug, already indexed** |
| `/faq` | `faq` section | **keep slug, already indexed** |
| `/service-areas` | `areas` section | new |
| `/contact` | `quote` section | replaces `/contact-ideal-auto-body/`, 301 it |
| `/privacy-policy` | existing | currently `/privacy-policy-2/`, 301 it |
| `/terms` | existing | currently `/terms-and-conditions/` |
| `/accessibility` | existing | currently `/accessibility-statement/` |

Also needs 301s: `/ideal-repair-process/` and the six dropped blog posts → `/`.

## SEO follow-up the user explicitly wants

The site is **not currently in Google Search Console**. Add the property and
submit the sitemap once the multi-page theme is live, otherwise none of the new
URLs can be monitored. Yoast is already installed and serving
`/sitemap_index.xml`.

## Hard constraints

- **Do not break the live site.** It serves customers. Deploy the new theme and
  verify it before activating; the fallback is re-activating `hello-elementor`.
- **Do not touch DNS.** Google Workspace email runs on this domain. The four
  records (MX, SPF, DKIM, DMARC) are documented in `CLAUDE.md` with a verify
  command. The DKIM key was already lost once during the registrar transfer.
- **Never install WordPress locally** (playbook hard rule). The live site is the
  test environment, reached over SSH.
- Take a backup before destructive steps. `make backup` dumps the DB. An existing
  rollback point is at `~/backups-preupdate-20261005-152035` on the server.

## Gotchas discovered in the previous session

- **`wp db query` silently returns empty on this install.** It reported 0 rows for
  a table holding 6,222. Use `wp eval` with `$wpdb` instead. This produced one
  wrong conclusion before it was caught — do not trust `wp db query` here.
- **Elementor Pro 3.28.4 has no license key stored** and cannot update. The user
  has decided to retire Elementor entirely, so this is moot — do not chase it.
- **The 6 blog posts are not this client's content.** All are iDeal Auto Collision
  auto-body articles with zero mentions of headlights. Two page slugs carry the
  same problem (`/ideal-repair-process/`, `/contact-ideal-auto-body/`). The site
  `<title>` still reads "iDeal Collision Centers". Recommend dropping the posts
  with 301s to the homepage, and fixing the title and slugs.
- The site is **not in Google Search Console**, so SEO impact is unmeasured. The
  domain was registered Jan 2026 and the WP install created Jul 2026, so there is
  little accumulated equity at risk.

## Suggested order

1. Confirm the theme slug and the route list/slugs above.
2. Port playbook Part 0 to Hostinger; `make test-connection` equivalent must pass.
3. Retrofit `getText()` across `src/App.jsx` (46 strings, 5 assets).
4. Add React Router (BrowserRouter) and build out the routes; keep the route list
   in sync with xo_required_pages().
5. Build `build-wordpress-theme.cjs`; generate the theme.
6. Deploy to the server **without activating**; verify.
7. Activate, verify as logged-out visitor, test inline edit + a real lead.
8. Add 301s for the old slugs and the six dropped posts.
9. Retire Elementor, Elementor Pro, and the addon plugins once the theme is proven.
10. Add the site to Google Search Console and submit the sitemap.

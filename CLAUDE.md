# NYC Headlights

## What this repo is

A **React 18 + Vite SPA** (React Router, multi-page) that is compiled into the
**`nyc-headlights` WordPress theme** by `build-wordpress-theme.cjs`, following
`docs/SPA-TO-WORDPRESS-THEME-PLAYBOOK.md` (ported from SiteGround to Hostinger).
WordPress stays the CMS: the **NYC Headlights** site setup page (WP Admin
menu, `admin.php?page=xo-admin`), Leads, inline editing, Yoast SEO.

**This theme is live** at https://nycheadlights.com (activated 2026-10-05).
Elementor, Elementor Pro and their addons were deleted the same day; their
folders are archived in `~/backups-20261005-172900/removed-plugins.tgz` on the
server. Pages built in Elementor keep their old HTML in `post_content`, which is
what the legal pages render.

| | |
|---|---|
| Routes | `src/routes.json` — the single list, read by the React router AND the generator (`xo_required_pages()`, legacy 301s, Yoast seed). Add a route there, never in only one place. |
| Pages | `/`, `/services`, `/oem-headlights`, `/faq`, `/service-areas`, `/contact`, `/privacy-policy`, `/terms`, `/accessibility` |
| Legal pages | body comes from the WordPress page itself (edited in WP Admin), not from React |
| Static preview | https://nycheadlights.com/staging/ (`make deploy`, noindex) |

## Commands

```bash
make install / dev          # pnpm install / Vite dev server (no WordPress: forms fall back to mailto)
make test-connection        # SSH + WP-CLI go/no-go gate (playbook Part 0)
make build-and-push         # build the theme and rsync it to wp-content/themes/nyc-headlights (does NOT activate)
make push-functions         # upload only functions.php
make purge-cache            # flush WP object cache + confirm the CDN is not caching HTML
make push-preview           # install the preview mu-plugin; prints ?xo_preview=<token> URL
make remove-preview         # delete it (do this after launch)
make pull-content           # merge live inline edits into src/data/liveData.json
make check-content-drift    # exit 1 if live has edits the local defaults lack
make backup                 # dump the live WordPress DB to the server
make deploy / verify        # static build to /staging/
make shell                  # ssh into Hostinger
```

**Generated files are never hand-edited.** Everything in `wordpress-theme/` and
`wordpress-mu/` (gitignored) is rewritten on every build. All PHP lives in
`build-wordpress-theme.cjs`.

### Base paths

`vite.config.js` reads `VITE_BASE` (assets) and the router reads
`VITE_ROUTER_BASE` (falls back to `VITE_BASE`). They differ only in the theme
build: assets from `/wp-content/themes/nyc-headlights/`, routes from `/`.
(The playbook's `base: "./"` breaks here: relative asset URLs resolve against
nested routes like `/faq/`.)

- WordPress theme: set by the generator
- staging: `/staging/`
- GitHub Pages preview: `/NYC-Headlights/` (set in `.github/workflows/deploy.yml`)

## Content layer

Every visible string and image goes through `getText(key, default)`
(`src/content/`). Key conventions, enforced by the save endpoint:

- `global_*` → site setup page option (`xo_global_*`): phone, email, hours, name
- `page_*` → scoped to one route; everything else → site-wide (header, footer, shared sections)
- `*_html` → limited inline HTML · `*_url` / `*_img` → sanitized as URLs · `*_alt` → plain text
- `{{PHONE}}`, `{{EMAIL}}`, `{{BUSINESS_NAME}}`, `{{CITY_STATE}}` resolve from the site setup page

## Content sync rule (live WordPress is the source of truth for content)

Logged-in users edit text/images/links directly on the live site; those edits are
stored in the WordPress DB and SHADOW the local defaults in src/data/liveData.json.
The local file is therefore possibly stale at any moment.

- BEFORE editing src/data/liveData.json, any getText()/`<T>` default string, or
  any content key in components: run `make check-content-drift`.
- If it reports drift: STOP. Run `make pull-content`, review the diff, commit the
  sync (`chore(content): sync live edits`), and only then apply the requested
  local change on top.
- If SSH is unavailable, say so explicitly and warn that local content may be
  stale — do not proceed with content edits silently.
- After deploying local content changes (`make build-and-push`), remember that DB
  overrides still win over the new defaults; clearing a stale override means
  deleting it (`xo_route_overrides` / `xo_global_*`), not just redeploying.

## Caching on Hostinger

There is no SiteGround cache here (`wp sg purge` does not apply). HTML is sent
`no-cache` by the theme and Hostinger's CDN passes it through
(`x-hcdn-cache-status: DYNAMIC`); hashed bundles are cached forever. Saves call
`xo_purge_caches()`, which flushes the object cache and **reports** failure to
the edit toolbar and the site setup page rather than failing silently. (The SiteGround
plugins and their `advanced-cache.php` dropin were removed on 2026-10-05.)

## Docs are symlinks, not copies

`docs/SPA-TO-WORDPRESS-THEME-PLAYBOOK.md` and
`docs/WORDPRESS-SITE-SETUP-AND-LEADS.md` are **absolute symlinks** into
`~/Documents/GitHub/iDeal Auto/iDeal Auto Collision/docs/`, so every project
shares one copy and improvements propagate. Git stores the link target, not the
content.

**Treat both as read-only from this repo.** Content flows one way, iDeal Auto
Collision → here. They are one file, not a copy, so editing either through this
repo's path silently rewrites the shared original for every project that links
it. If a playbook needs a fix, make it in
`~/Documents/GitHub/iDeal Auto/iDeal Auto Collision/docs/` deliberately, where
that repo's git history records it.

Two other things to know: the links are absolute and resolve only on this
machine, so a fresh clone elsewhere gets dangling links; and never "fix" a
dangling link by replacing it with a copy, which forks the shared doc.

## Infrastructure

Migrated off SiteGround in Oct 2026. Current state:

- **Registrar**: Hostinger (transferred from Namecheap, completed 2026-10-05)
- **Expires**: 2028-01-20 — *auto-renewal was off, check it is on*
- **Nameservers**: `aster.dns-parking.com`, `helios.dns-parking.com`
- **Hosting**: Hostinger Premium Web Hosting
- **Email**: Google Workspace (not Hostinger mail)

### SSH

```bash
ssh NYCH     # configured in ~/.ssh/config
```

Resolves to `u837167039@145.79.4.82:65002`, key `~/.ssh/nycheadlights_ed25519`.

- Web root: `~/domains/nycheadlights.com/public_html`
- Staging: `~/domains/nycheadlights.com/public_html/staging` (has a noindex `robots.txt`)
- Available: WP-CLI 2.12, PHP 8.2.33, git, composer, rsync
- **No Node on the server.** Build locally or in CI, then upload `dist/`.

> `~/public_html` exists but is **empty**. The real document root is under
> `~/domains/`. Easy to waste time on.

### DNS records that must never break

The client's email runs on Google Workspace. These four records carry it, and
the DKIM key was dropped once already during the registrar transfer:

```
MX   @                  1   smtp.google.com
TXT  @                      v=spf1 include:_spf.google.com ~all
TXT  google._domainkey      v=DKIM1; k=rsa; p=MIIBIjAN...  (410 chars, ends QIDAQAB)
TXT  _dmarc                 v=DMARC1; p=none; aspf=r; adkim=r;
```

Verify after any DNS change:

```bash
dig +short MX nycheadlights.com
dig +short TXT google._domainkey.nycheadlights.com | wc -c   # expect 416
```

## Known issues on the live WordPress site

- **WordPress core** has major updates pending at times. Do them in their own
  window, not alongside plugin work.
- **Elementor-built pages pointed at the deleted `elementor_canvas` template**,
  which makes WordPress refuse to save them ("Invalid page template").
  `xo_ensure_required_pages()` (NYC Headlights page → Pages) resets any template the
  theme doesn't provide; run it again if old content ever comes back.
- **Outgoing mail shows "via srv2184.main-hosting.eu" in Gmail.** The theme sets
  the visible From to `NYC Headlights <no-reply@nycheadlights.com>`, but mail is
  sent by Hostinger while SPF/DKIM only authorize Google, so the domains don't
  align. **Accepted as-is (decided 2026-10-05):** it only appears on internal
  lead/admin emails, and the only fixes are Google Workspace SMTP or DNS changes.
  Don't force the envelope sender to nycheadlights.com: SPF would then softfail.
- **`wp db query` silently returns empty on this install.** Use `wp eval` with
  `$wpdb`, or `wp option` / `wp post meta`.
- **Yoast titles are cached in its indexables table.** Writing `_yoast_wpseo_*`
  meta directly does nothing visible until the indexable is rebuilt;
  `xo_sync_yoast()` does that.

Always `make backup` before touching plugins or core. Rollback points on the
server, each with a DB dump and an archive of the plugins removed in that step:
`~/backups-20261005-165857` (theme activation; SiteGround plugins),
`~/backups-20261005-172900` (Elementor + addons, LayerSlider, WP Reset, Under
Construction), `~/backups-20261005-173304` (Contact Form 7, YellowPencil, WPFront
Scroll Top, Duplicate Page), `~/backups-20261005-173803` (DB only: before the
iDeal page/posts and Elementor/CF7 template records were trashed — the trash
auto-empties after 30 days). Remaining plugins: Akismet, Site Kit, Ally
(pojo-accessibility), Wordfence, WP Activity Log, Yoast SEO.

## Do not touch

`~/.ssh/config` contains **13 SiteGround host entries** (`SG`, `SG_corporate`,
`SG_flushing`, …). **None of them belong to NYC Headlights** — they are other
XO clients still hosted on SiteGround, all on the same shared server. Removing
them breaks access to roughly a dozen live sites.

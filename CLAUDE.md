# NYC Headlights

## What this repo is (and is not)

This repo is a **React 18 + Vite single-page rebrand** of the NYC Headlights homepage.
It is **not** what currently serves https://nycheadlights.com.

The live site is a **WordPress + Elementor** install. The two are separate things:

| | Live site | This repo |
|---|---|---|
| Stack | WordPress 7.0.6 + Elementor | React 18 + Vite (static) |
| URL | https://nycheadlights.com | https://nycheadlights.com/staging/ |
| Pages | 8 pages + 6 posts | homepage only |
| Status | in production | not launched |

The WordPress site has indexed pages (`/oem-headlights/`, `/faq/`,
`/ideal-repair-process/`, `/contact-ideal-auto-body/`, plus legal pages) that the
React site does not reproduce. **Replacing the live site with this repo would 404
all of them.** That cutover is a deliberate decision, not a deploy step.

## Commands

```bash
make install        # pnpm install
make dev            # Vite dev server
make build          # production build, root base path "/"
make build-staging  # build with base "/staging/"
make deploy         # build-staging + rsync to the staging dir on Hostinger
make verify         # curl the staging URL
make backup         # dump the live WordPress DB to the server
make shell          # ssh into Hostinger
```

`make deploy` only ever writes to the **staging subdirectory**. It never touches
the WordPress web root.

### Base path

`vite.config.js` reads `VITE_BASE` and defaults to `/`. Anything served from a
subdirectory must set it, or every asset 404s:

- production (future, web root): `/`
- staging: `/staging/`
- GitHub Pages preview: `/NYC-Headlights/` (set in `.github/workflows/deploy.yml`)

## Docs are symlinks, not copies

`docs/SPA-TO-WORDPRESS-THEME-PLAYBOOK.md` and
`docs/WORDPRESS-SITE-SETUP-AND-LEADS.md` are **absolute symlinks** into
`~/Documents/GitHub/iDeal Auto/iDeal Auto Collision/docs/`, so every project
shares one copy and improvements propagate. Git stores the link target, not the
content.

Consequences: editing either file here edits the shared source for every repo
that links it. The links resolve only on this machine — a fresh clone elsewhere
gets dangling links. Never replace one with a copy to "fix" it.

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

- **Elementor version mismatch.** Elementor is 4.3.3, Elementor Pro is 3.28.4.
  Pro cannot update because **no license key is stored**. Needs the client's
  license entered in WP Admin under Elementor → License. Pages render fine today,
  but Pro widgets can fail subtly across a gap that large.
- **LayerSlider 7.10.1** is active, unlicensed, unpatched, and **unused** (no
  slider table, no shortcodes, no Elementor references). Candidate for deletion.
- **WordPress core** 7.0.6 has a major update to 7.1.2 pending. Do it in its own
  window, not alongside plugin work.
- **SEO leftovers from the template.** The `<title>` still reads "iDeal Collision
  Centers" and slugs like `/contact-ideal-auto-body/` persist. Content fix, not
  a hosting one.

Always `make backup` before touching plugins or core. Existing rollback point:
`~/backups-preupdate-20261005-152035` (DB dump + the 3 plugin folders).

## Do not touch

`~/.ssh/config` contains **13 SiteGround host entries** (`SG`, `SG_corporate`,
`SG_flushing`, …). **None of them belong to NYC Headlights** — they are other
XO clients still hosted on SiteGround, all on the same shared server. Removing
them breaks access to roughly a dozen live sites.

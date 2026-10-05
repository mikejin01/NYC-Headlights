# NYC Headlights

Marketing site for **NYC Headlights** — NYC's precision headlight specialists. Built with React + Vite.

## Develop

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build      # root base path
pnpm preview
```

## Deploy

The live site at nycheadlights.com is WordPress. This React site deploys to a
staging subdirectory only. See CLAUDE.md before any production cutover.

```bash
make deploy     # build + rsync to https://nycheadlights.com/staging/
make verify     # check it responds
```

## Contact

- Phone: (929) 409-9330
- Email: jerry@nycheadlights.com
- Hours: Mon–Sat 9AM–7PM · Sun by appointment
- New York City — all five boroughs

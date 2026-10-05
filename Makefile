# NYC Headlights - build & deploy
#
# IMPORTANT: the live site at https://nycheadlights.com is WordPress, served from
# the Hostinger web root. This repo is a separate React/Vite rebrand that has NOT
# launched. Deploying it over the web root would destroy the WordPress site, so
# `deploy` targets a staging subdirectory only. Production cutover is a deliberate,
# separate decision - see CLAUDE.md.

SSH_HOST   := NYCH
WEB_ROOT   := domains/nycheadlights.com/public_html
STAGE_DIR  := $(WEB_ROOT)/staging
STAGE_URL  := https://nycheadlights.com/staging/
STAGE_BASE := /staging/

# ----- WordPress theme (playbook Part 0, ported SiteGround -> Hostinger) -----
# Connection details (port 65002, key) live in ~/.ssh/config under the NYCH alias.
LIVE_URL    := https://nycheadlights.com
THEME_SLUG  := nyc-headlights
THEME_DIR   := $(WEB_ROOT)/wp-content/themes/$(THEME_SLUG)
MU_DIR      := $(WEB_ROOT)/wp-content/mu-plugins
WP          := ssh $(SSH_HOST) 'cd ~/$(WEB_ROOT) && wp
LIVE_CONTENT_DIR := .content-sync

.PHONY: help install dev build preview deploy verify backup shell clean \
        info test-connection ssh build-wordpress push build-and-push push-functions \
        pull purge-cache push-preview preview-url remove-preview pull-content check-content-drift

help:
	@echo "make install   - install dependencies (pnpm)"
	@echo "make dev       - run the Vite dev server"
	@echo "make build     - production build into dist/ (root base path)"
	@echo "make build-staging - build with /staging/ base path"
	@echo "make preview   - serve the built dist/ locally"
	@echo "make deploy    - build, then rsync dist/ to the STAGING dir on Hostinger"
	@echo "make verify    - check the staging URL responds"
	@echo "make backup    - dump the live WordPress DB + plugins to the server"
	@echo "make shell     - ssh into the Hostinger account"
	@echo ""
	@echo "WordPress theme ($(THEME_SLUG)):"
	@echo "make info / test-connection - show config / prove SSH + WP-CLI work"
	@echo "make build-and-push   - build the theme and rsync it to the live server (does NOT activate)"
	@echo "make push             - rsync the already-built wordpress-theme/"
	@echo "make push-functions   - upload only functions.php"
	@echo "make purge-cache      - flush the WP object cache and check the CDN is not caching HTML"
	@echo "make push-preview     - install the preview mu-plugin; make preview-url prints the link"
	@echo "make remove-preview   - delete the preview mu-plugin"
	@echo "make pull             - download the live theme to .live-theme/ for inspection"
	@echo "make pull-content     - merge live inline edits into src/data/liveData.json"
	@echo "make check-content-drift - fail if live has edits the local defaults lack"
	@echo ""
	@echo "staging URL: $(STAGE_URL)"

install:
	pnpm install

dev:
	pnpm dev

build:
	pnpm build

# Staging lives in a subdirectory, so assets must be built against /staging/.
build-staging:
	VITE_BASE=$(STAGE_BASE) pnpm build

preview: build
	pnpm preview

# --delete keeps staging an exact mirror of dist/, but robots.txt is excluded
# so the noindex guard is never removed. The .htaccess sends router deep links
# (/staging/faq/) to index.html.
deploy: build-staging
	@printf 'RewriteEngine On\nRewriteBase /staging/\nRewriteCond %%{REQUEST_FILENAME} !-f\nRewriteCond %%{REQUEST_FILENAME} !-d\nRewriteRule . /staging/index.html [L]\n' > dist/.htaccess
	rsync -avz --delete --exclude 'robots.txt' \
		-e "ssh" \
		dist/ $(SSH_HOST):$(STAGE_DIR)/
	@echo "deployed -> $(STAGE_URL)"

verify:
	@curl -sL -o /dev/null -w "staging: HTTP %{http_code}  %{size_download} bytes\n" $(STAGE_URL)

backup:
	ssh $(SSH_HOST) 'cd ~/$(WEB_ROOT) && B=~/backups-$$(date +%Y%m%d-%H%M%S) && mkdir -p $$B && \
	  DBN=$$(wp config get DB_NAME) && DBU=$$(wp config get DB_USER) && \
	  DBP=$$(wp config get DB_PASSWORD) && DBH=$$(wp config get DB_HOST) && \
	  MYSQL_PWD="$$DBP" mysqldump --no-tablespaces --single-transaction \
	    -h"$$DBH" -u"$$DBU" "$$DBN" | gzip > $$B/db.sql.gz && \
	  echo "backup written to $$B"'

shell:
	ssh $(SSH_HOST)

# ===== WordPress theme =====================================================
# Never install WordPress locally (playbook hard rule): the live install is the
# test environment. `push` only uploads files; activating the theme is a
# separate, deliberate step (`wp theme activate $(THEME_SLUG)`), and the fallback
# is `wp theme activate hello-elementor`.

info:
	@echo "ssh host    $(SSH_HOST)  (see ~/.ssh/config: port 65002)"
	@echo "web root    ~/$(WEB_ROOT)"
	@echo "theme dir   ~/$(THEME_DIR)"
	@echo "live url    $(LIVE_URL)"

test-connection:
	@ssh -o ConnectTimeout=15 $(SSH_HOST) 'cd ~/$(WEB_ROOT) && echo "connected: $$(whoami)@$$(hostname)" && \
	  php -r "echo \"php \".PHP_VERSION.PHP_EOL;" && wp --version && echo "wordpress $$(wp core version)" && \
	  echo "active theme: $$(wp theme list --status=active --field=name)"'

ssh: shell

build-wordpress:
	pnpm run build:wordpress

# --delete keeps the remote theme an exact mirror of the generated one.
push:
	@test -f wordpress-theme/functions.php || (echo "wordpress-theme/ missing: run make build-wordpress" && exit 1)
	rsync -avz --delete wordpress-theme/ $(SSH_HOST):$(THEME_DIR)/
	@ssh $(SSH_HOST) 'php -l ~/$(THEME_DIR)/functions.php'
	@$(MAKE) --no-print-directory purge-cache

build-and-push: build-wordpress push

push-functions:
	rsync -avz wordpress-theme/functions.php $(SSH_HOST):$(THEME_DIR)/functions.php
	@ssh $(SSH_HOST) 'php -l ~/$(THEME_DIR)/functions.php'
	@$(MAKE) --no-print-directory purge-cache

pull:
	rsync -avz $(SSH_HOST):$(THEME_DIR)/ .live-theme/

# Hostinger port of `wp cache flush && wp sg purge`: there is no SiteGround
# cache here. Flush the object cache (via the theme's purge when it is active,
# which also records the result), then prove the CDN is passing HTML through.
purge-cache:
	@$(WP) eval '\''if (function_exists("xo_purge_caches")) { $$r = xo_purge_caches(); echo "purge: ", $$r["ok"] ? "ok (".implode(",", $$r["done"]).")" : "FAILED: ".$$r["error"], PHP_EOL; exit($$r["ok"] ? 0 : 1); } wp_cache_flush(); echo "purge: object cache flushed (theme not active)", PHP_EOL;'\'''
	@status=$$(curl -sI $(LIVE_URL)/ | tr -d '\r' | awk -F': ' 'tolower($$1)=="x-hcdn-cache-status"{print $$2}'); \
	  echo "cdn html cache status: $${status:-none}"; \
	  if [ "$$status" = "HIT" ]; then echo "WARNING: the CDN is caching HTML; purge it in hPanel -> CDN"; exit 1; fi

# Pre-activation preview: an mu-plugin that serves the new theme only to
# requests carrying a secret token. Inert for everyone else.
push-preview:
	rsync -avz wordpress-mu/xo-theme-preview.php $(SSH_HOST):$(MU_DIR)/xo-theme-preview.php
	@$(WP) option get xo_preview_token >/dev/null 2>&1 || wp option add xo_preview_token $$(openssl rand -hex 16) --autoload=no' && \
	  $(MAKE) --no-print-directory preview-url

preview-url:
	@echo "$(LIVE_URL)/?xo_preview=$$($(WP) option get xo_preview_token')"

remove-preview:
	ssh $(SSH_HOST) 'rm -f ~/$(MU_DIR)/xo-theme-preview.php'
	@$(WP) option delete xo_preview_token' || true

# Two-way content sync (playbook §4.3): live WordPress is the source of truth.
pull-content:
	@mkdir -p $(LIVE_CONTENT_DIR)
	@$(WP) option list --search=xo_global_* --format=json' > $(LIVE_CONTENT_DIR)/options.json
	@$(WP) option get xo_route_overrides --format=json 2>/dev/null || echo {}' > $(LIVE_CONTENT_DIR)/route-overrides.json
	@node scripts/merge-live-content.mjs
	@echo "Review with: git diff src/data/liveData.json"

check-content-drift:
	@mkdir -p $(LIVE_CONTENT_DIR)
	@$(WP) option list --search=xo_global_* --format=json' > $(LIVE_CONTENT_DIR)/options.json
	@$(WP) option get xo_route_overrides --format=json 2>/dev/null || echo {}' > $(LIVE_CONTENT_DIR)/route-overrides.json
	@node scripts/merge-live-content.mjs --check

clean:
	rm -rf dist dist-wp wordpress-theme wordpress-mu nyc-headlights.zip

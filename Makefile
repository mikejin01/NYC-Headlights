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

.PHONY: help install dev build preview deploy verify backup shell clean

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
# so the noindex guard is never removed.
deploy: build-staging
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

clean:
	rm -rf dist

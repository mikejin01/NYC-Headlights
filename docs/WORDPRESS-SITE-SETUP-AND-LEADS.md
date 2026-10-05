# Adding a "Site Setup" Page + "Leads" Page to Any WordPress Site

A reusable runbook for building two admin features into any WordPress theme (or a
companion plugin) you ship:

1. **Site Setup** — a single admin screen where the client edits their business
   details, imports demo images, fixes the sitemap/HTTPS, repairs missing pages,
   scans for SEO issues, and syncs SEO meta to Yoast.
2. **Leads** — a custom post type that captures front-end form submissions in the
   dashboard **and automatically emails every new lead to the address configured on
   the Site Setup page.**

This guide is deliberately generic. The reference implementation lives in this repo
(`build-wordpress-theme.cjs` → generated `functions.php`) and is auto-body-specific;
here we strip out the API/multi-location machinery and keep only what every site
needs.

---

## Step 0 — Ask before you build

Collect these answers **first** (ask the user/client). They drive every prefix and
label below:

| Input | Example | Used for |
|---|---|---|
| **Site Setup page name** *(ask this every time)* | `Acme Dental Site Setup` | The admin menu label + page `<h1>` |
| Function/option prefix | `acme` | All PHP function names + `acme_global_*` options |
| REST namespace | `acme/v1` | Form submission endpoints |
| Brand/menu accent color | `#0ea5e9` | Highlighting the menu items (optional) |
| Notification email | *(the client sets this in the page itself)* | Where leads are emailed |

> Throughout this doc, replace `acme` / `Acme` with the prefix you chose, and replace
> `Acme Dental Site Setup` with the page name the user gave you.

**What we deliberately skip** (present in the reference build, not needed for a
general site): the "Quick Preset / store selector" (multi-location), the third-party
BizAPI forwarding, and the image-history tools ("Restore/Promote edited images").
Those only matter for the multi-store inline-editing system.

**What we keep** (the essentials):

- Fine-Tune Details (business info + the lead email) — **required**
- Content Placeholders reference — nice to have
- Import Demo Images
- Sitemap & HTTPS (Yoast SEO)
- Repair / Create Missing Pages
- SEO Health Scanner
- Sync to Yoast SEO
- Master Reset — optional (danger button)

---

## Architecture at a glance

- **Global business settings** are stored as WordPress **options** (`acme_global_*`)
  via `update_option`/`get_option`. One row per field. Simple, cache-friendly, and
  readable anywhere in the theme.
- **Leads** are a **custom post type** (`lead_submission`). Each submission is one
  post; structured fields (email, phone, etc.) live in post meta so the admin list
  table can show real columns.
- **Form submissions** come in through the **REST API** (`/acme/v1/lead`). The
  handler saves the CPT and then `wp_mail()`s the configured Site Setup address.
- **Form processing on the admin page** uses the **POST → Redirect → GET (PRG)**
  pattern inside `admin_init`, so we can `wp_redirect()` safely (no "resubmit form?"
  prompts, headers not yet sent).

```
Front-end form ──POST──▶ /acme/v1/lead ──▶ save lead_submission CPT
                                          └─▶ wp_mail(get_option('acme_global_contact_email'))
                                                              ▲
Admin edits email in ── Site Setup ▶ update_option('acme_global_contact_email') ──┘
```

---

# Part A — The Site Setup admin page

## A1. Register the admin menu

```php
function acme_add_admin_menu() {
    // Main Site Setup page. Use the NAME the user gave you in Step 0.
    add_menu_page(
        'Acme Dental Site Setup', // page <title>
        'Site Setup',             // menu label (short)
        'manage_options',         // capability
        'acme-site-setup',        // menu slug
        'acme_render_settings_page',
        'dashicons-admin-generic',
        3                         // position (just under Dashboard)
    );

    // Leads menu item with a "new" count bubble (see Part B).
    $new = acme_count_new_leads();
    $label = 'Leads';
    if ($new > 0) {
        $c = intval($new);
        $label .= ' <span class="awaiting-mod count-' . $c . '"><span class="pending-count">' . $c . '</span></span>';
    }
    add_menu_page(
        'Leads',
        $label,
        'manage_options',
        'edit.php?post_type=lead_submission', // link straight to the CPT list
        '',
        'dashicons-email-alt',
        4
    );
}
add_action('admin_menu', 'acme_add_admin_menu');
```

> The Leads item is a `add_menu_page` whose slug is `edit.php?post_type=lead_submission`.
> Because the CPT is registered with `show_in_menu => false` (Part B), this is the only
> place it appears — giving you full control over position and the count badge.

## A2. Seed default options on activation

Set sane defaults once, so the page is never blank on a fresh install.

```php
function acme_set_defaults() {
    $defaults = array(
        'acme_global_business_name'   => 'Acme Dental',
        'acme_global_city_state'      => 'Your City, ST',
        'acme_global_contact_phone'   => '(555) 555-1234',
        'acme_global_contact_email'   => '',            // client fills this in
        'acme_global_contact_address' => '123 Main St, Your City, ST 12345',
        'acme_global_contact_hours'   => "Mon-Fri: 9-5\nSat-Sun: Closed",
    );
    foreach ($defaults as $key => $val) {
        if (get_option($key) === false) {  // only if not set
            add_option($key, $val);
        }
    }
}
add_action('after_switch_theme', 'acme_set_defaults');
// If shipping as a plugin instead: register_activation_hook(__FILE__, 'acme_set_defaults');
```

## A3. Handle all form POSTs in `admin_init` (PRG pattern)

Processing here (not in the render callback) lets you `wp_redirect()` after saving.
Every action below is a separate `if (isset($_POST[...]))` block.

```php
add_action('admin_init', function () {
    if (!current_user_can('manage_options')) return;

    // --- Save business details (Section: Fine-Tune Details) ---
    if (isset($_POST['acme_save_details'])) {
        check_admin_referer('acme_save_details');
        update_option('acme_global_business_name',   sanitize_text_field($_POST['business_name'] ?? ''));
        update_option('acme_global_city_state',      sanitize_text_field($_POST['city_state'] ?? ''));
        update_option('acme_global_contact_phone',   sanitize_text_field($_POST['phone'] ?? ''));
        update_option('acme_global_contact_email',   sanitize_email($_POST['contact_email'] ?? ''));
        update_option('acme_global_contact_address', sanitize_textarea_field($_POST['address'] ?? ''));
        update_option('acme_global_contact_hours',   sanitize_textarea_field($_POST['hours'] ?? ''));

        // SEO / Schema (optional block)
        if (isset($_POST['seo_geo'])) {
            $geo = trim((string) $_POST['seo_geo']);
            if ($geo === '' || preg_match('/^-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?$/', $geo)) {
                update_option('acme_global_geo', $geo);
            }
        }
        if (isset($_POST['seo_same_as'])) update_option('acme_global_same_as', sanitize_textarea_field($_POST['seo_same_as']));
        if (isset($_POST['seo_og_image'])) update_option('acme_global_og_image_url', esc_url_raw((string) $_POST['seo_og_image']));

        wp_redirect(add_query_arg('acme_saved', '1', admin_url('admin.php?page=acme-site-setup')));
        exit;
    }

    // Other action handlers (import images, sitemap, repair, SEO scan, Yoast sync)
    // are added in the sections below — each is its own isset() block here.
});
```

**Why `admin_init` and not the page callback?** The menu-page render callback fires
*after* WordPress has started sending the admin page HTML, so `wp_redirect()` there is
unreliable. `admin_init` runs before any output on every admin request — the correct
place for save-then-redirect. (The reference build mixes the two; this is the cleaner
pattern.)

## A4. Render the page

The render callback only **reads** options and prints the form. Keep it a two-column
grid of white "cards," one per section.

```php
function acme_render_settings_page() {
    if (isset($_GET['acme_saved'])) {
        echo '<div class="updated notice is-dismissible"><p>Settings saved.</p></div>';
    }
    ?>
    <div class="wrap">
        <h1>Acme Dental Site Setup</h1>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:20px;">
            <div style="display:flex; flex-direction:column; gap:20px;">
                <?php acme_section_details(); ?>
                <?php acme_section_placeholders(); ?>
            </div>
            <div style="display:flex; flex-direction:column; gap:20px;">
                <?php acme_section_import_images(); ?>
                <?php acme_section_sitemap_https(); ?>
                <?php acme_section_repair_pages(); ?>
                <?php acme_section_seo_scanner(); ?>
                <?php acme_section_yoast_sync(); ?>
                <?php acme_section_master_reset(); // optional ?>
            </div>
        </div>
    </div>
    <?php
}
```

Each `acme_section_*()` helper prints one card. Below are the essential ones.

---

## Section 1 — Fine-Tune Details *(required — this is where the lead email lives)*

```php
function acme_section_details() {
    $email = get_option('acme_global_contact_email', '');
    ?>
    <div style="background:#fff;padding:24px;border-radius:12px;border:1px solid #e2e8f0;">
        <h2>Business Details</h2>
        <form method="post">
            <?php wp_nonce_field('acme_save_details'); ?>
            <table class="form-table">
                <tr><th><label>Business Name</label></th>
                    <td><input name="business_name" type="text" class="regular-text"
                        value="<?php echo esc_attr(get_option('acme_global_business_name')); ?>"></td></tr>
                <tr><th><label>City / State</label></th>
                    <td><input name="city_state" type="text" class="regular-text"
                        value="<?php echo esc_attr(get_option('acme_global_city_state')); ?>"></td></tr>
                <tr><th><label>Phone</label></th>
                    <td><input name="phone" type="text" class="regular-text"
                        value="<?php echo esc_attr(get_option('acme_global_contact_phone')); ?>"></td></tr>
                <tr><th><label>Email</label></th>
                    <td><input name="contact_email" type="email" class="regular-text"
                        value="<?php echo esc_attr($email); ?>" placeholder="you@example.com">
                        <p class="description"><strong>Leads and quote requests are emailed here.</strong></p></td></tr>
                <tr><th><label>Address</label></th>
                    <td><textarea name="address" rows="2" class="large-text"><?php
                        echo esc_textarea(get_option('acme_global_contact_address')); ?></textarea></td></tr>
                <tr><th><label>Hours</label></th>
                    <td><textarea name="hours" rows="3" class="large-text"><?php
                        echo esc_textarea(get_option('acme_global_contact_hours')); ?></textarea></td></tr>

                <!-- Optional SEO/Schema block for LocalBusiness JSON-LD + OpenGraph -->
                <tr><td colspan="2"><hr><strong>SEO &amp; Schema (optional)</strong></td></tr>
                <tr><th><label>Geo (lat,lng)</label></th>
                    <td><input name="seo_geo" type="text" class="regular-text"
                        value="<?php echo esc_attr(get_option('acme_global_geo')); ?>" placeholder="40.7,-73.9"></td></tr>
                <tr><th><label>Social Profiles</label></th>
                    <td><textarea name="seo_same_as" rows="3" class="large-text" placeholder="One URL per line"><?php
                        echo esc_textarea(get_option('acme_global_same_as')); ?></textarea></td></tr>
                <tr><th><label>Share Image</label></th>
                    <td><input name="seo_og_image" type="url" class="regular-text"
                        value="<?php echo esc_attr(get_option('acme_global_og_image_url')); ?>"
                        placeholder="https://…1200x630.jpg"></td></tr>
            </table>
            <input type="hidden" name="acme_save_details" value="1">
            <?php submit_button('Save Changes'); ?>
        </form>
    </div>
    <?php
}
```

> **The Email field here is the single source of truth for lead forwarding.** Part B
> reads `acme_global_contact_email` when a form is submitted. If it's blank, leads are
> still captured in the dashboard but **no email is sent** — so make setting it the
> first thing you tell the client to do.

---

## Section 2 — Content Placeholders *(reference card, optional)*

If your theme resolves tokens like `{{PHONE}}` in content, show the live values so the
client understands them. Add a resolver used wherever you output content:

```php
function acme_resolve_placeholders($text) {
    $map = array(
        '{{BUSINESS_NAME}}' => get_option('acme_global_business_name', ''),
        '{{CITY_STATE}}'    => get_option('acme_global_city_state', ''),
        '{{PHONE}}'         => get_option('acme_global_contact_phone', ''),
        '{{EMAIL}}'         => get_option('acme_global_contact_email', ''),
        '{{ADDRESS}}'       => get_option('acme_global_contact_address', ''),
    );
    return strtr((string) $text, $map);
}
```

The card itself is just a two-column table listing each `<code>{{TOKEN}}</code>` next to
its live `get_option()` value. Skip this section entirely if your site doesn't use tokens.

---

## Section 3 — Import Demo Images

Ships placeholder images inside the theme and copies them into the Media Library on one
click, so a fresh install isn't full of broken images.

**Handler** (add inside the `admin_init` block from A3):

```php
if (isset($_POST['acme_import_images'])) {
    check_admin_referer('acme_import_images');
    require_once ABSPATH . 'wp-admin/includes/image.php';
    require_once ABSPATH . 'wp-admin/includes/file.php';
    require_once ABSPATH . 'wp-admin/includes/media.php';

    $src_dir = get_template_directory() . '/demo-images/';   // ship images here
    $imported = 0; $skipped = 0;

    if (is_dir($src_dir)) {
        foreach ((array) glob($src_dir . '*') as $file) {
            if (!is_file($file)) continue;
            $filename = basename($file);

            // Skip if an attachment with this filename already exists.
            $existing = get_posts(array(
                'post_type' => 'attachment', 'posts_per_page' => 1, 'fields' => 'ids',
                'meta_query' => array(array(
                    'key' => '_wp_attached_file', 'value' => $filename, 'compare' => 'LIKE',
                )),
            ));
            if ($existing) { $skipped++; continue; }

            $upload = wp_upload_bits($filename, null, file_get_contents($file));
            if (!empty($upload['error'])) continue;

            $type = wp_check_filetype($upload['file']);
            $attach_id = wp_insert_attachment(array(
                'guid'           => $upload['url'],
                'post_mime_type' => $type['type'],
                'post_title'     => preg_replace('/\.[^.]+$/', '', $filename),
                'post_status'    => 'inherit',
            ), $upload['file']);
            if ($attach_id) {
                wp_update_attachment_metadata($attach_id,
                    wp_generate_attachment_metadata($attach_id, $upload['file']));
                $imported++;
            }
        }
    }
    update_option('acme_images_imported', '1');
    wp_redirect(add_query_arg(array('acme_imported' => $imported, 'acme_skipped' => $skipped),
        admin_url('admin.php?page=acme-site-setup')));
    exit;
}
```

> **Improvement over the reference build:** the original copies from a hardcoded date
> path (`/wp-content/uploads/2026/01/`) and uses `copy()` into a manually-built target
> dir. Using `wp_upload_bits()` lets WordPress place the file in the *current* month's
> uploads folder and avoids the stale-date-path bug. Ship your images in a fixed
> `demo-images/` folder in the theme.

**Card:** a form posting `acme_import_images` with `wp_nonce_field('acme_import_images')`,
plus a "one-time — replace with your own photos afterward" note. Show a ✓ if
`get_option('acme_images_imported') === '1'`.

---

## Section 4 — Sitemap & HTTPS (Yoast SEO)

Flushes rewrite rules, rewrites lingering `http://` URLs in the DB to `https://`, writes
a `robots.txt` pointing at the Yoast sitemap index, and (optionally) adds an HTTPS-enforce
+ HSTS block to `.htaccess`.

**Handler:**

```php
if (isset($_POST['acme_configure_sitemap'])) {
    check_admin_referer('acme_configure_sitemap');
    flush_rewrite_rules();
    $fixed = acme_enforce_https();
    acme_rebuild_seo_files();
    wp_redirect(add_query_arg('acme_https_fixed', intval($fixed),
        admin_url('admin.php?page=acme-site-setup')));
    exit;
}
```

**Helpers:**

```php
function acme_enforce_https() {
    global $wpdb;
    $home = untrailingslashit(get_home_url());
    if (strpos($home, 'https://') !== 0) return 0;   // only if site is already HTTPS
    $http = str_replace('https://', 'http://', $home);
    $count = 0;
    foreach (array(
        array($wpdb->postmeta, 'meta_value'),
        array($wpdb->posts,    'post_content'),
        array($wpdb->options,  'option_value'),
    ) as $t) {
        list($table, $col) = $t;
        $count += (int) $wpdb->query($wpdb->prepare(
            "UPDATE {$table} SET {$col} = REPLACE({$col}, %s, %s) WHERE {$col} LIKE %s",
            $http, $home, '%' . $wpdb->esc_like($http) . '%'
        ));
    }
    return $count;
}

function acme_rebuild_seo_files() {
    $home = untrailingslashit(get_home_url());
    // Remove any stale static sitemap so Yoast's dynamic one is authoritative.
    if (file_exists(ABSPATH . 'sitemap.xml')) @unlink(ABSPATH . 'sitemap.xml');
    // Point robots.txt at the Yoast sitemap index.
    @file_put_contents(ABSPATH . 'robots.txt',
        "User-agent: *\nDisallow:\n\nSitemap: {$home}/sitemap_index.xml\n");
}
```

**Card:** show the sitemap URL (`home_url('/sitemap_index.xml')`) as a clickable link to
submit to Google Search Console, plus the "Flush Rewrite Rules & Enforce HTTPS" button.
Note the requirement: **Yoast SEO must be active**, and Settings → General must already
use `https://` for both URLs.

> **Caution:** `acme_enforce_https()` does a blind DB search-replace. It's guarded to
> run only when the home URL is already `https://`, but **always take a DB backup first**
> and never run it on a site still transitioning to HTTPS.

---

## Section 5 — Repair / Create Missing Pages

Guarantees every page your theme's routes/navigation expect actually exists in
WordPress, and sets the front page. Driven by a config array — customize the list per
site.

**Handler:**

```php
if (isset($_POST['acme_repair_pages'])) {
    check_admin_referer('acme_repair_pages');
    $required = array(
        'home'     => array('title' => 'Home', 'is_front' => true),
        'services' => array('title' => 'Services'),
        'about'    => array('title' => 'About Us'),
        'contact'  => array('title' => 'Contact'),
        // …add every slug your theme links to…
    );
    $created = 0; $existed = 0;
    foreach ($required as $slug => $data) {
        $page = get_page_by_path($slug);
        if (!$page) {
            $id = wp_insert_post(array(
                'post_title'  => $data['title'],
                'post_name'   => $slug,
                'post_status' => 'publish',
                'post_type'   => 'page',
            ));
            if ($id && !is_wp_error($id)) $created++;
        } else {
            $id = $page->ID; $existed++;
        }
        if (!empty($data['is_front']) && $id) {
            update_option('show_on_front', 'page');
            update_option('page_on_front', $id);
        }
    }
    wp_redirect(add_query_arg(array('acme_created' => $created, 'acme_existed' => $existed),
        admin_url('admin.php?page=acme-site-setup')));
    exit;
}
```

**Card:** a single "Check & Create Missing Pages" button. Show `created`/`existed`
counts from the redirect query args as an admin notice.

---

## Section 6 — SEO Health Scanner

Two-step design so heavy work never times out: **Scan** (count issues, cache in a
transient) then **Fix** per-category (process in small batches). Keep it to
universally-useful checks; extend per project.

```php
// SCAN — count issues only, store in a transient.
if (isset($_POST['acme_seo_scan'])) {
    check_admin_referer('acme_seo_scan');
    set_time_limit(120);
    global $wpdb;

    // Missing alt text on image attachments.
    $alt_missing = (int) $wpdb->get_var(
        "SELECT COUNT(*) FROM {$wpdb->posts} p
         LEFT JOIN {$wpdb->postmeta} pm
           ON p.ID = pm.post_id AND pm.meta_key = '_wp_attachment_image_alt'
         WHERE p.post_type='attachment' AND p.post_mime_type LIKE 'image/%'
           AND p.post_status='inherit' AND (pm.meta_value IS NULL OR pm.meta_value='')"
    );

    // Oversized images (>1MB or >2048px on a side).
    $oversized = 0;
    $atts = get_posts(array('post_type'=>'attachment','post_mime_type'=>'image',
        'post_status'=>'inherit','posts_per_page'=>-1,'fields'=>'ids'));
    foreach ($atts as $id) {
        $file = get_attached_file($id);
        if (!$file || !file_exists($file)) continue;
        $dims = @getimagesize($file);
        if ($dims && (filesize($file) > 1048576 || $dims[0] > 2048 || $dims[1] > 2048)) $oversized++;
    }

    set_transient('acme_seo_scan', array(
        'alt_text'  => array('label'=>'Missing Alt Text', 'count'=>$alt_missing),
        'oversized' => array('label'=>'Oversized Images', 'count'=>$oversized),
    ), HOUR_IN_SECONDS);
    wp_redirect(admin_url('admin.php?page=acme-site-setup')); exit;
}

// FIX — one category per request, batched.
if (isset($_POST['acme_seo_fix'])) {
    $cat = sanitize_text_field($_POST['acme_seo_fix']);
    check_admin_referer('acme_seo_fix_' . $cat);
    set_time_limit(120);
    global $wpdb;

    if ($cat === 'alt_text') {
        // Generate alt text from the filename for images that have none.
        $ids = $wpdb->get_col(
            "SELECT p.ID FROM {$wpdb->posts} p
             LEFT JOIN {$wpdb->postmeta} pm
               ON p.ID = pm.post_id AND pm.meta_key = '_wp_attachment_image_alt'
             WHERE p.post_type='attachment' AND p.post_mime_type LIKE 'image/%'
               AND p.post_status='inherit' AND (pm.meta_value IS NULL OR pm.meta_value='')
             LIMIT 50"  // batch
        );
        foreach ($ids as $id) {
            $name = pathinfo(get_attached_file($id), PATHINFO_FILENAME);
            $alt  = ucwords(trim(preg_replace('/[-_]+/', ' ', $name)));
            update_post_meta($id, '_wp_attachment_image_alt', $alt);
        }
    }
    // (Add an 'oversized' branch that resizes/recompresses ~25 per batch.)

    delete_transient('acme_seo_scan');  // force a re-scan to refresh counts
    wp_redirect(admin_url('admin.php?page=acme-site-setup')); exit;
}
```

**Card:** a "Scan for Issues" button; once `get_transient('acme_seo_scan')` exists, render
a table of `label` / `count` with a per-row "Fix" button (each wrapped in its own form
with `wp_nonce_field('acme_seo_fix_' . $cat)`).

---

## Section 7 — Sync to Yoast SEO

Pushes your code-defined per-page SEO title/description into Yoast's post meta so Yoast
(the source of truth for what Google indexes) has values to serve. **Non-destructive by
default: only fills empty Yoast fields**, so any title/description a human typed in Yoast
survives. A "Force overwrite" checkbox allows a deliberate reset.

```php
if (isset($_POST['acme_yoast_sync'])) {
    check_admin_referer('acme_yoast_sync');
    $force = !empty($_POST['acme_yoast_force']);

    // Your own map of slug => array('title'=>…, 'desc'=>…). Define per site.
    $seo = acme_seo_registry();

    $synced = 0; $preserved = 0;
    foreach (get_posts(array('post_type'=>'page','post_status'=>'publish',
                             'posts_per_page'=>-1)) as $page) {
        $slug = get_page_uri($page);
        if (empty($seo[$slug])) continue;

        // Only write when empty, unless forcing. This is what makes "Yoast wins".
        $put = function ($key, $val) use ($page, $force, &$synced, &$preserved) {
            $existing = trim((string) get_post_meta($page->ID, $key, true));
            if (!$force && $existing !== '') { $preserved++; return; }
            update_post_meta($page->ID, $key, $val); $synced++;
        };
        $put('_yoast_wpseo_title',    $seo[$slug]['title']);
        $put('_yoast_wpseo_metadesc', $seo[$slug]['desc']);
    }
    wp_redirect(add_query_arg(array('acme_yoast_synced'=>$synced,'acme_yoast_kept'=>$preserved),
        admin_url('admin.php?page=acme-site-setup')));
    exit;
}
```

**Card:** a "Sync Now" button plus a "Force overwrite existing Yoast values" checkbox
(with a `confirm()` on submit). Requires Yoast SEO active. Report `synced` vs `kept` in
the notice.

> **How this ties to the head output:** your theme should *defer* to Yoast — when a
> SEO plugin is active, don't emit your own `<title>`/`<meta description>`. Yoast's
> `wp_head` output then becomes the only source, and this sync just seeds its fields.

---

## Section 8 — Master Reset *(optional, danger)*

A single button that restores all `acme_global_*` options to code defaults. Guard it
with a `confirm()` dialog and the `delete` button style.

```php
if (isset($_POST['acme_master_reset'])) {
    check_admin_referer('acme_master_reset');
    foreach (array('business_name','city_state','contact_phone','contact_email',
                   'contact_address','contact_hours','geo','same_as','og_image_url') as $k) {
        delete_option('acme_global_' . $k);
    }
    acme_set_defaults();
    wp_redirect(add_query_arg('acme_reset','1', admin_url('admin.php?page=acme-site-setup')));
    exit;
}
```

---

# Part B — The Leads page (+ email forwarding)

## B1. Register the Leads custom post type

```php
function acme_register_leads() {
    register_post_type('lead_submission', array(
        'labels'       => array('name' => 'Leads', 'singular_name' => 'Lead'),
        'public'       => false,   // never a front-end URL
        'show_ui'      => true,    // but visible in admin
        'show_in_menu' => false,   // we add our own top-level menu (A1)
        'supports'     => array('title', 'editor'),
        'capability_type' => 'post',
    ));
}
add_action('init', 'acme_register_leads');
```

## B2. Nice admin columns

```php
add_filter('manage_lead_submission_posts_columns', function ($cols) {
    return array(
        'cb'          => $cols['cb'] ?? '',
        'title'       => 'Name',
        'lead_email'  => 'Email',
        'lead_phone'  => 'Phone',
        'lead_status' => 'Status',
        'date'        => 'Date',
    );
});

add_action('manage_lead_submission_posts_custom_column', function ($col, $post_id) {
    if ($col === 'lead_email') {
        $v = (string) get_post_meta($post_id, 'lead_email', true);
        echo $v ? '<a href="mailto:' . esc_attr($v) . '">' . esc_html($v) . '</a>' : '—';
    } elseif ($col === 'lead_phone') {
        echo esc_html(get_post_meta($post_id, 'lead_phone', true) ?: '—');
    } elseif ($col === 'lead_status') {
        $reviewed = get_post_meta($post_id, 'lead_reviewed', true) === '1';
        if ($reviewed) { echo '<span style="color:#065f46;font-weight:600;">Reviewed</span>'; return; }
        $url = wp_nonce_url(
            admin_url('admin-post.php?action=acme_mark_reviewed&lead_id=' . intval($post_id)),
            'acme_mark_reviewed_' . intval($post_id)
        );
        echo '<a class="button button-small" href="' . esc_url($url) . '">Mark reviewed</a>';
    }
}, 10, 2);
```

## B3. "Mark reviewed" action + new-lead count badge

```php
add_action('admin_post_acme_mark_reviewed', function () {
    $id = intval($_GET['lead_id'] ?? 0);
    if ($id && current_user_can('manage_options')
        && check_admin_referer('acme_mark_reviewed_' . $id)) {
        update_post_meta($id, 'lead_reviewed', '1');
    }
    wp_safe_redirect(admin_url('edit.php?post_type=lead_submission'));
    exit;
});

function acme_count_new_leads() {
    $q = new WP_Query(array(
        'post_type'      => 'lead_submission',
        'post_status'    => 'publish',
        'posts_per_page' => -1,
        'fields'         => 'ids',
        'meta_query'     => array(array(
            'key' => 'lead_reviewed', 'value' => '1', 'compare' => '!=',
        )),
        'no_found_rows'  => true,
    ));
    return count($q->posts);
}
```

## B4. The submission endpoint + **email forwarding to the Site Setup email**

This is the core requirement: on submit, save the lead **and** email it to whatever the
client typed into the Site Setup "Email" field (`acme_global_contact_email`).

```php
add_action('rest_api_init', function () {
    register_rest_route('acme/v1', '/lead', array(
        'methods'             => 'POST',
        'callback'            => 'acme_handle_lead',
        'permission_callback' => '__return_true',  // public form
    ));
});

function acme_handle_lead($request) {
    $p = $request->get_json_params();
    if (!is_array($p)) $p = array();

    // Honeypot: bots fill the hidden "company" field. Silently succeed so the bot
    // gets a 200 and no useful feedback.
    if (!empty($p['company'])) {
        return new WP_REST_Response(array('success' => true), 200);
    }

    $name    = sanitize_text_field($p['name'] ?? '');
    $email   = sanitize_email($p['email'] ?? '');
    $phone   = sanitize_text_field($p['phone'] ?? '');
    $message = sanitize_textarea_field($p['message'] ?? '');

    if (!$name || !$email || !$message) {
        return new WP_REST_Response(array('success' => false,
            'message' => 'Missing required fields.'), 400);
    }

    $when = current_time('mysql');
    $body  = "Name: {$name}\nEmail: {$email}\n";
    if ($phone) $body .= "Phone: {$phone}\n";
    $body .= "Submitted: {$when}\n\n{$message}\n";

    // 1) Save to the dashboard.
    $post_id = wp_insert_post(array(
        'post_type'    => 'lead_submission',
        'post_status'  => 'publish',
        'post_title'   => sprintf('Lead: %s (%s)', $name, current_time('Y-m-d H:i')),
        'post_content' => $body,
    ), true);
    if (is_wp_error($post_id)) {
        return new WP_REST_Response(array('success' => false,
            'message' => 'Failed to save lead.'), 500);
    }
    update_post_meta($post_id, 'lead_name',    $name);
    update_post_meta($post_id, 'lead_email',   $email);
    update_post_meta($post_id, 'lead_phone',   $phone);
    update_post_meta($post_id, 'lead_message', $message);
    update_post_meta($post_id, 'lead_reviewed', '0');

    // 2) Forward to the address configured on the Site Setup page.
    $to = get_option('acme_global_contact_email', '');
    if ($to && is_email($to)) {
        $brand   = get_option('acme_global_business_name', '')
                   ?: (wp_parse_url(home_url(), PHP_URL_HOST) ?: 'Website');
        $subject = sprintf('[%s] New Lead: %s', $brand, $name);
        $headers = array(
            'Content-Type: text/plain; charset=UTF-8',
            'Reply-To: ' . $name . ' <' . $email . '>',  // reply goes to the lead
        );
        wp_mail($to, $subject, $body, $headers);
    }

    return new WP_REST_Response(array('success' => true, 'id' => (int) $post_id), 200);
}
```

**Key points**

- The email destination is read live from `get_option('acme_global_contact_email')` on
  every submission — so whenever the client updates it in Site Setup, forwarding follows
  automatically. No second place to configure.
- If that option is blank, the lead is **still saved** in the dashboard; only the email
  is skipped.
- `Reply-To` is set to the submitter, so the client can reply straight from their inbox.

## B5. Wire the front-end form

Minimal `fetch` example (adapt to your framework). Include the honeypot field:

```html
<form id="lead-form">
  <input name="name" required>
  <input name="email" type="email" required>
  <input name="phone">
  <textarea name="message" required></textarea>
  <!-- honeypot: hide with CSS, keep out of tab order -->
  <input name="company" tabindex="-1" autocomplete="off"
         style="position:absolute;left:-9999px" aria-hidden="true">
  <button type="submit">Send</button>
</form>
<script>
document.getElementById('lead-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  const res = await fetch('/wp-json/acme/v1/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  alert(json.success ? 'Thanks — we\'ll be in touch!' : (json.message || 'Something went wrong.'));
});
</script>
```

---

# Testing checklist

1. **Activate** the theme/plugin → confirm the "Site Setup" and "Leads" menu items
   appear.
2. **Site Setup → Business Details** → set the Email → Save → reload → value persists.
3. **Submit the front-end form** → a new post appears under **Leads**, columns show
   name/email/phone, Status shows "Mark reviewed", and the menu badge count increments.
4. **Check the inbox** for the configured email. If nothing arrives, see the SMTP note
   below (the lead should still be in the dashboard).
5. **Mark reviewed** → status flips to "Reviewed", badge count drops.
6. **Honeypot** → submit with the `company` field filled → returns success but **no**
   lead is created.
7. Run **Import Demo Images**, **Repair Pages**, **Sitemap & HTTPS**, **SEO Scan/Fix**,
   and **Yoast Sync** once each and confirm the success notices + that re-running is
   idempotent (no duplicates).

---

# Logic review — issues found in the reference build & general gotchas

While adapting the auto-body implementation I checked the kept sections. Findings:

### 1. SEO Scanner: `$registry` used before it's defined *(real bug in the reference)*

In `build-wordpress-theme.cjs` (generated `functions.php`), inside the scan handler the
"Missing H1 Tags" loop reads `$registry[$slug]`:

```php
// ~line 5285
if (isset($registry[$slug])) continue;   // $registry is NOT defined yet here
...
// ~line 5297  (AFTER the loop)
$registry = ideal_auto_route_registry();
```

`$registry` isn't assigned until *after* the loop, so during the H1 count it is
undefined — the `isset()` is always false and the registry-based skip is dead code.
Effect is mild (the subsequent `post_title` check catches most pages, so H1s are only
over-counted for the rare title-less page), but it emits a PHP notice and the check
doesn't do what it reads like it does. **Fix:** move
`$registry = ideal_auto_route_registry();` *above* the H1 loop. In the general version
here that ordering is already correct.

### 2. Email forwarding silently no-ops when the Site Setup email is empty

Both the reference and this guide only `wp_mail()` when `contact_email` is set and valid.
That's correct behavior, but it means **"I'm not getting lead emails" is almost always
"the email field is blank in Site Setup."** Make setting it step one of client handoff,
and consider surfacing a warning banner on the Site Setup page when it's empty.

### 3. `wp_mail()` depends on the host being able to send mail

On most shared hosts PHP `mail()` is unreliable or lands in spam. For production,
install an SMTP plugin (WP Mail SMTP, or your host's transactional mail) and verify
delivery. This is an environment concern, not a code bug — but it's the #1 reason
forwarding "doesn't work."

### 4. Import Demo Images: avoid hardcoded date paths

The reference copies from a fixed `/wp-content/uploads/2026/01/` path and reconstructs
the target dir by hand. If that folder isn't shipped, nothing imports. The
`wp_upload_bits()` approach in Section 3 above sidesteps this — ship images in a stable
`demo-images/` folder instead.

### 5. HTTPS enforcement is a blind DB search-replace

`acme_enforce_https()` / the reference `ideal_auto_enforce_https()` run
`UPDATE … REPLACE(...)` across several tables. It's guarded to only run when the site is
already on `https://`, but it is still a bulk write. **Back up the database before
running**, and don't expose it to non-admins (the `current_user_can('manage_options')`
guard is essential — present in both).

### 6. Yoast "Force overwrite" really does overwrite

The default sync is safe (fills empty fields only). The Force path replaces hand-typed
Yoast titles/descriptions with code defaults. Keep the `confirm()` dialog and make the
checkbox clearly labeled, exactly as the reference does.

---

# Adapting this to a brand-new site — quick checklist

- [ ] Ask for and set the **Site Setup page name** (Step 0).
- [ ] Global find/replace the `acme` / `Acme` prefix and the `acme/v1` REST namespace.
- [ ] Edit `acme_set_defaults()` with the new client's starter values.
- [ ] Edit the **Repair Pages** list (Section 5) to match this site's pages.
- [ ] Edit the **Yoast SEO registry** (`acme_seo_registry()`) with per-page titles/descs.
- [ ] Ship placeholder images in `demo-images/` for the import tool.
- [ ] Confirm **Yoast SEO** is installed (required for Sections 4 & 7).
- [ ] Install/configure an **SMTP plugin** so lead emails actually deliver.
- [ ] Drop any section you don't need — each is a self-contained card + `admin_init` block.
```

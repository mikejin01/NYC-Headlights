import { useState } from 'react'
import { T } from '../content/InlineEdit'
import { BgChip, BgImg, Img, useImageValue } from '../content/ImageEdit'
import { LinkEdit, SmartLink } from '../content/LinkEdit'
import { useBusiness, useWPEdit } from '../content/WPEditProvider'
import { brands, categories, faqs, featured, icons, regions, areas, services } from '../data/catalog'
import { QuoteForm } from './QuoteForm'

// Sections shared across pages. Keys without a page_ prefix are site-wide: an
// edit made on any page shows everywhere the section appears.

export const asset = (p) => `${import.meta.env.BASE_URL}assets/nych/${p}`

function SecHead({ id, kicker, title, intro, as: H = 'h2' }) {
  return (
    <div className="sec-head">
      <div>
        <T k={`site_${id}_kicker`} as="div" className="k mono">{kicker}</T>
        <T k={`site_${id}_title`} as={H}>{title}</T>
      </div>
      <T k={`site_${id}_intro`} as="p" multiline>{intro}</T>
    </div>
  )
}

// Sub-page header band: each route's own <h1>, so every page has exactly one.
export function PageHero({ slug, kicker, title, intro }) {
  return (
    <section className="page-hero dark">
      <div className="wrap">
        <T k={`page_${slug}_kicker`} as="div" className="k mono">{kicker}</T>
        <T k={`page_${slug}_title`} as="h1">{title}</T>
        {intro && <T k={`page_${slug}_intro`} as="p" multiline>{intro}</T>}
      </div>
    </section>
  )
}

export function HomeHero() {
  const bg = useImageValue('page_home_hero_img', asset('hero-headlight.jpg'))
  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true" style={{ backgroundImage: `url(${bg})` }} />
      <BgChip k="page_home_hero_img" src={asset('hero-headlight.jpg')} label="Replace hero background" />
      <div className="hero-content">
        <div className="wrap hero-grid">
          <div className="hero-main">
            <T k="page_home_kicker" as="div" className="hero-kicker mono">OEM Headlight Specialists · Trade &amp; Retail · All Five Boroughs</T>
            <T k="page_home_title_html" as="h1">{'Precision optics<br>for the city that <em>never sleeps.</em>'}</T>
            <div className="hero-row">
              <T k="page_home_intro" as="p" multiline>NYC Headlights is the city's OEM headlight specialist — restoration, retrofits and certified replacements for BMW, Mercedes-Benz, Lexus, Audi, Toyota, Mazda and more, across all five boroughs.</T>
            </div>
            <div className="hero-meta mono">
              <T k="page_home_meta_1">10,000+ parts in stock</T>
              <T k="page_home_meta_2">24-hour turnaround available</T>
              <T k="page_home_meta_3">Certified · Warrantied</T>
            </div>
          </div>
          <QuoteForm />
        </div>
      </div>
    </section>
  )
}

export function Categories() {
  return (
    <section className="cats" id="categories">
      <div className="wrap">
        <div className="cats-head">
          <T k="site_cats_kicker" as="div" className="k mono">Shop by Type</T>
          <T k="site_cats_title" as="h2">Browse headlights</T>
          <T k="site_cats_intro" as="p">Jump straight to the work you need — OEM, upgrades or restoration.</T>
        </div>
        <div className="cat-row">
          {categories.map((c) => (
            <SmartLink className="cat" href={c.href} key={c.id}>
              <span className="cat-ic">{icons[c.icon]}</span>
              <T k={`site_cat_${c.id}_name`} className="cat-name">{c.name}</T>
            </SmartLink>
          ))}
        </div>
      </div>
    </section>
  )
}

export function SpecialistBanner() {
  return (
    <section className="license">
      <div className="wrap">
        <T k="site_license_line_html" as="p" className="license-line">{'<span class="nyc">NYC\'s</span> precision headlight <span class="lic">specialists</span>'}</T>
        <T k="site_license_sub" as="p" className="license-sub">Certified automotive lighting solutions — OEM specialists for BMW, Mercedes-Benz, Lexus, Audi, Toyota &amp; Mazda.</T>
      </div>
    </section>
  )
}

const TRUST = [
  ['<em>10,000</em>+', 'Headlight parts in stock'],
  ['24<em>hr</em>', 'Express turnaround available'],
  ['<em>5</em>', 'NYC boroughs served'],
  ['OEM', 'Certified parts & warranty'],
]

export function Trust() {
  return (
    <div className="trust dark">
      {TRUST.map(([n, l], i) => (
        <div key={i}>
          <T k={`site_trust_${i + 1}_n_html`} as="div" className="n">{n}</T>
          <T k={`site_trust_${i + 1}_l`} as="div" className="l">{l}</T>
        </div>
      ))}
    </div>
  )
}

export function Services({ headingLevel }) {
  const { getText } = useWPEdit()
  return (
    <section className="sec" id="services">
      <div className="wrap">
        <SecHead id="svc" as={headingLevel} kicker="Services" title="What we do" intro="Trained optics specialists — not general mechanics. From a clouded lens to a full OEM assembly, we diagnose, source and install it right." />
        <div className="svc">
          {services.map((s) => (
            <div className="svc-card" key={s.id}>
              <div className="svc-icon-tr">{icons[s.icon]}</div>
              <T k={`site_svc_${s.id}_title`} as="h3">{s.title}</T>
              <T k={`site_svc_${s.id}_copy`} as="p" multiline>{s.copy}</T>
              <EditableTags k={`site_svc_${s.id}_tags`} fallback={s.tags.join(', ')} getText={getText} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Tags are one comma-separated content value: edited as text, rendered as chips.
function EditableTags({ k, fallback, getText }) {
  const { isEditing } = useWPEdit()
  if (isEditing) return <div className="tags"><T k={k} className="tag">{fallback}</T></div>
  const tags = getText(k, fallback).split(',').map((t) => t.trim()).filter(Boolean)
  return <div className="tags">{tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
}

export function InStock() {
  const { email } = useBusiness()
  return (
    <section className="sec dark" id="inventory">
      <div className="wrap">
        <SecHead id="stock" kicker="In Stock" title="Featured OEM headlights in stock" intro="Ready-to-ship OEM headlights for popular makes and models — authenticated, warranted and ready to install or deliver." />
        <div className="feat">
          {featured.map((f) => (
            <div className="prod" key={f.id}>
              <div className="prod-media">
                <BgImg k={`site_stock_${f.id}_img`} src={asset(`gallery/${f.img}`)} className="img" />
                <T k="site_stock_badge" className="prod-badge mono">In Stock</T>
              </div>
              <div className="prod-info">
                <T k={`site_stock_${f.id}_make`} className="prod-make mono">{f.make}</T>
                <T k={`site_stock_${f.id}_model`} as="h3">{f.model}</T>
                <T k="site_stock_link" className="prod-link">OEM Headlight Assembly →</T>
              </div>
            </div>
          ))}
        </div>
        <div className="feat-foot">
          <LinkEdit className="btn ghost" urlKey="site_stock_button_url" defaultHref={`mailto:${email}?subject=${encodeURIComponent('Inventory inquiry')}`}>
            <T k="site_stock_button">Check full inventory</T>
          </LinkEdit>
        </div>
      </div>
    </section>
  )
}

export function Vehicles() {
  return (
    <section className="sec" id="vehicles">
      <div className="wrap">
        <SecHead id="veh" kicker="By Vehicle" title="Shop OEM headlights by vehicle" intro="We focus on what matters most — high-demand OEM headlights for the makes we know best, with verified compatibility and faster sourcing." />
        <div className="vehicles">
          {brands.map((b) => (
            <div className="vcard" key={b.slug}>
              <div className="vlogo"><Img k={`site_brand_${b.slug}_img`} src={asset(`brands/${b.slug}.png`)} alt={`${b.name} logo`} loading="lazy" /></div>
              <T k={`site_brand_${b.slug}_name`} as="h3">{b.name}</T>
              <T k={`site_brand_${b.slug}_desc`} as="p" multiline>{b.desc}</T>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Areas({ headingLevel }) {
  const [activeArea, setActiveArea] = useState(null)
  return (
    <section className="sec dark" id="areas">
      <div className="wrap">
        <SecHead id="areas" as={headingLevel} kicker="Service Areas" title="Where we work" intro="Serving all five boroughs of New York City — walk-in service welcome, with same-day options across Manhattan, Brooklyn, Queens, the Bronx and Staten Island." />
        <div className="areas">
          <div className="area-map">
            <svg viewBox="214 171 70 64" role="img" aria-label="NYC Headlights five-borough service area map">
              {regions.map((r) => (
                <path
                  key={r.key}
                  d={r.d}
                  className={`rg${activeArea === r.key ? ' active' : ''}`}
                  onMouseEnter={() => setActiveArea(r.key)}
                  onMouseLeave={() => setActiveArea(null)}
                >
                  <title>{r.name}</title>
                </path>
              ))}
              {regions.map((r) => (
                <text key={r.key} className={`rg-label${activeArea === r.key ? ' active' : ''}`} x={r.lx} y={r.ly} textAnchor="middle">
                  {r.label}
                </text>
              ))}
            </svg>
          </div>
          <ul className="area-grid">
            {areas.map((a, i) => (
              <li
                key={a.key}
                className={activeArea === a.key ? 'active' : ''}
                onMouseEnter={() => setActiveArea(a.key)}
                onMouseLeave={() => setActiveArea(null)}
              >
                {a.name} <span className="mono">{String(i + 1).padStart(2, '0')}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export function Trade() {
  const { phoneTel, phoneDot, email } = useBusiness()
  return (
    <section className="trade" id="trade">
      <div className="wrap">
        <div className="trade-in">
          <div>
            <T k="site_trade_kicker" as="div" className="k mono">Trade &amp; Wholesale</T>
            <T k="site_trade_title" as="h2">Built for body shops &amp; the trade</T>
            <T k="site_trade_intro" as="p" multiline>We supply body shops, dealers and independent garages across NYC with authenticated OEM headlights and a used-assembly buy-back program — trade pricing, fast sourcing and a direct line to a specialist who knows the part.</T>
            <ul>
              <T k="site_trade_li_1" as="li">Trade pricing on OEM &amp; upgrade assemblies for shops</T>
              <T k="site_trade_li_2" as="li">10,000+ parts in stock — driver, passenger or matched pairs</T>
              <T k="site_trade_li_3" as="li">We buy used assemblies and recycle cores</T>
              <T k="site_trade_li_4" as="li">24-hour turnaround available on stocked parts</T>
            </ul>
          </div>
          <div className="trade-card">
            <T k="site_trade_card_k" className="tc-k">Open a trade line</T>
            <a className="tc-phone" href={phoneTel}>{phoneDot}</a>
            <a className="tc-email" href={`mailto:${email}?subject=${encodeURIComponent('Trade / wholesale account inquiry')}`}>{email}</a>
            <div className="tc-div" />
            <LinkEdit className="btn" urlKey="site_trade_button_url" defaultHref={`mailto:${email}?subject=${encodeURIComponent('Trade / wholesale pricing request')}`}>
              <T k="site_trade_button">Request trade pricing</T>
            </LinkEdit>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Faq({ headingLevel }) {
  // Answers live inside closed <details>; open them all while editing.
  const { isEditing } = useWPEdit()
  return (
    <section className="sec dark" id="faq">
      <div className="wrap">
        <SecHead id="faq" as={headingLevel} kicker="FAQ" title="Common questions" intro="Headlights, OEM versus aftermarket, turnaround and fitment — the answers we give most often. Still unsure? Call or send us your vehicle." />
        <div className="faq-list">
          {faqs.map((f) => (
            <details className="faq-item" key={f.id} open={isEditing || undefined}>
              <T k={`site_faq_${f.id}_q`} as="summary">{f.q}</T>
              <T k={`site_faq_${f.id}_a`} as="p" multiline>{f.a}</T>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Cta() {
  const { phone, phoneTel } = useBusiness()
  const bg = useImageValue('site_cta_img', asset('audi.avif'))
  return (
    <section
      className="cta"
      id="quote"
      style={{ backgroundImage: `linear-gradient(rgba(8,9,11,.80),rgba(8,9,11,.88)), url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <BgChip k="site_cta_img" src={asset('audi.avif')} />
      <div className="cta-in">
        <T k="site_cta_title_html" as="h2">{'Ready to <em>light up</em><br>the road ahead?'}</T>
        <T k="site_cta_intro" as="p" multiline>Tell us your year, make, model and the issue — we'll come back with a price and timeline. Free quotes across all five boroughs, usually the same day.</T>
        <div className="cta-actions">
          <LinkEdit className="btn" urlKey="site_cta_button_url" defaultHref="/contact"><T k="site_cta_button">Get a free quote</T></LinkEdit>
          <a className="btn ghost" href={phoneTel}>Call {phone}</a>
        </div>
      </div>
    </section>
  )
}

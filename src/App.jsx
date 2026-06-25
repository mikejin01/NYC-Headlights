import { useState, useCallback } from 'react'

const BASE = import.meta.env.BASE_URL

const PHONE = '(929) 409-9330'
const PHONE_DOT = '929.409.9330'
const PHONE_TEL = 'tel:+19294099330'
const EMAIL = 'jerry@nycheadlights.com'

const services = [
  {
    title: 'OEM Replacement',
    icon: 'oem',
    copy: 'Factory-direct optics for all major makes and models — authenticated, certified assemblies backed by a full warranty.',
    tags: ['OEM', 'Certified', 'Full Warranty'],
  },
  {
    title: 'Restoration & Refurbish',
    icon: 'restore',
    copy: 'Lens restoration, moisture removal, wiring repair and ballast diagnostics — bringing foggy, failing headlights back to factory-clear.',
    tags: ['Lens Restoration', 'Moisture Removal', 'Wiring', 'Ballast'],
  },
  {
    title: 'Aftermarket Upgrades',
    icon: 'upgrade',
    copy: 'Performance LED and laser conversions, projector retrofits and custom DRL installs — brighter, sharper output, cleanly integrated.',
    tags: ['LED', 'Laser', 'Retrofit', 'Custom DRL'],
  },
  {
    title: 'Wholesale & Recycling',
    icon: 'wholesale',
    copy: 'We buy used headlight assemblies and recycle cores — wholesale supply and trade pricing for shops across the city.',
    tags: ['Wholesale', 'Core Buy-Back', 'Recycling'],
  },
]

const ICON_PROPS = { viewBox: '0 0 48 48', fill: 'none', stroke: 'currentColor', strokeWidth: 2.1, strokeLinecap: 'round', strokeLinejoin: 'round' }

const icons = {
  // Headlight assembly with internal reflector + projected beams
  oem: (
    <svg {...ICON_PROPS} aria-hidden="true">
      <path d="M8 18 Q8 12 15 12 L33 13.5 Q39 14 39 24 Q39 34 33 34.5 L15 36 Q8 36 8 30 Z" />
      <circle cx="16.5" cy="24" r="5.2" />
      <path d="M40 19 H45 M40 24 H46 M40 29 H45" className="ic-dot" />
    </svg>
  ),
  // Lens with sparkle — restored optical clarity
  restore: (
    <svg {...ICON_PROPS} aria-hidden="true">
      <path d="M9 17 Q9 11 16 11 L33 12 Q39 12.5 39 24 Q39 35.5 33 36 L16 37 Q9 37 9 31 Z" />
      <path d="M21 19 l2.2 4.4 l4.4 2.2 l-4.4 2.2 l-2.2 4.4 l-2.2-4.4 l-4.4-2.2 l4.4-2.2 Z" className="ic-dot" />
      <path d="M31 16 l1.1 2.3 l2.3 1.1 l-2.3 1.1 l-1.1 2.3 l-1.1-2.3 l-2.3-1.1 l2.3-1.1 Z" className="ic-dot" />
    </svg>
  ),
  // LED bulb radiating beams
  upgrade: (
    <svg {...ICON_PROPS} aria-hidden="true">
      <path d="M18 29 V21 a6 6 0 0 1 12 0 V29 Z" />
      <path d="M19 29 H29 M21 33 H27 M22.5 37 H25.5" />
      <path d="M24 5 V10 M10.5 11 l3 3 M37.5 11 l-3 3 M6 24 H10 M38 24 H42" className="ic-dot" />
    </svg>
  ),
  // Open shipping box — wholesale & recycled cores
  wholesale: (
    <svg {...ICON_PROPS} aria-hidden="true">
      <path d="M9 16.5 L24 9.5 L39 16.5 L24 23.5 Z" />
      <path d="M9 16.5 V32 L24 39 L39 32 V16.5" />
      <path d="M24 23.5 V39" className="ic-dot" />
      <path d="M16.5 13 L31.5 20" className="ic-dot" />
    </svg>
  ),
  // Headlight throwing tight, parallel laser beams
  laser: (
    <svg {...ICON_PROPS} aria-hidden="true">
      <path d="M8 17 Q8 11 15 11 L31 12 Q37 12.5 37 24 Q37 35.5 31 36 L15 37 Q8 37 8 31 Z" />
      <circle cx="16" cy="24" r="4.4" />
      <path d="M39 24 H47 M39 20 H46 M39 28 H46" className="ic-dot" />
    </svg>
  ),
  // Projector lens — concentric optic
  projector: (
    <svg {...ICON_PROPS} aria-hidden="true">
      <circle cx="24" cy="24" r="14" />
      <circle cx="24" cy="24" r="7" />
      <circle cx="24" cy="24" r="2.2" className="ic-dot" />
    </svg>
  ),
  // Magnifier — header search
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21 L16.7 16.7" />
    </svg>
  ),
  // Phone receiver
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  // Clock — business hours
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  ),
}

// Shop-by-type tiles (CarParts-style category row) — every entry is a real
// service/product line; tiles jump to the matching section.
const categories = [
  { name: 'OEM Assemblies', icon: 'oem', href: '#inventory' },
  { name: 'LED Upgrades', icon: 'upgrade', href: '#services' },
  { name: 'Laser Systems', icon: 'laser', href: '#services' },
  { name: 'Projector Retrofit', icon: 'projector', href: '#services' },
  { name: 'Restoration', icon: 'restore', href: '#services' },
  { name: 'Trade & Wholesale', icon: 'wholesale', href: '#trade' },
]

// Featured ready-to-ship OEM headlights (vehicles mirror nycheadlights.com),
// paired with our in-shop assembly photos.
const featured = [
  { make: 'Toyota', model: '2024–2025 Highlander', img: 'g1.jpg' },
  { make: 'BMW', model: '2022–2025 X4 / X5', img: 'g4.jpg' },
  { make: 'Mercedes-Benz', model: '2016–2019 GLC', img: 'g6.jpg' },
  { make: 'Lexus', model: '2023–2025 RX 350', img: 'g5.jpg' },
]

// Shop OEM headlights by vehicle — real manufacturer logos + copy from the live site.
const brands = [
  { slug: 'bmw', name: 'BMW', desc: 'OEM BMW headlights including adaptive LED and laser systems.' },
  { slug: 'mercedes-benz', name: 'Mercedes-Benz', desc: 'Genuine Mercedes-Benz headlights with intelligent LED technology.' },
  { slug: 'lexus', name: 'Lexus', desc: 'Precision Lexus LED headlights with signature DRL styling.' },
  { slug: 'toyota', name: 'Toyota', desc: 'Reliable OEM Toyota headlight assemblies for all models.' },
  { slug: 'audi', name: 'Audi', desc: 'Reliable OEM Audi headlight assemblies for all models.' },
  { slug: 'mazda', name: 'Mazda', desc: 'Sleek Mazda headlights with modern LED performance.' },
]

// Coverage map — the five NYC boroughs. Geographic shapes derived from US
// Census 1:500k county boundaries, projected (Mercator) into the original
// 560×460 space; the viewBox is cropped to frame just the five boroughs.
const regions = [
  { key: 'manhattan', name: 'Manhattan', label: 'MAN', lx: 250, ly: 195, d: 'M243.9,205.0L244.0,204.9L244.1,205.0L244.2,205.1L243.7,206.4L243.6,206.5L243.4,206.4L243.3,206.3L243.3,206.2ZM251.6,200.1L251.7,201.9L251.6,202.1L250.9,203.8L248.5,204.5L247.6,206.4L247.2,206.8L246.1,207.7L245.7,207.4L245.6,207.3L245.5,206.7L245.8,205.9L246.1,205.6L246.3,204.8L246.0,204.1L245.5,203.8L246.6,197.7L247.1,196.8L247.9,195.1L248.6,193.5L249.2,192.2L253.0,184.4L254.1,182.3L254.5,181.3L256.3,182.2L256.7,181.7L257.1,182.1L257.1,182.5L256.6,192.5L256.8,193.2L256.2,193.8L255.0,195.0L254.3,194.7L254.0,195.3L254.1,195.6L254.3,195.7L254.2,195.9L253.8,196.3L253.5,196.6L252.4,198.3L252.1,199.1L251.7,199.4Z' },
  { key: 'brooklyn', name: 'Brooklyn', label: 'BK', lx: 254, ly: 214, d: 'M260.9,205.6L261.1,207.4L262.2,209.7L261.7,210.9L262.7,219.5L254.0,222.4L253.4,222.0L252.9,221.4L252.0,221.5L248.8,221.8L247.8,221.8L247.1,221.5L246.8,221.3L246.7,220.8L247.2,220.1L247.3,220.0L247.8,219.2L247.6,218.5L246.9,217.9L244.7,217.4L244.1,216.3L243.8,214.8L244.2,213.2L244.4,212.7L244.8,212.0L246.2,210.3L245.9,207.8L245.7,207.4L246.1,207.7L247.2,206.8L247.6,206.4L248.5,204.5L250.9,203.8L251.6,202.1L251.7,201.9L251.6,200.1L251.8,200.2L252.4,199.9L253.2,200.1L254.1,201.1L254.9,201.4L255.4,202.4L255.7,203.8L256.6,204.6L257.4,205.6L258.1,207.3L258.8,207.1L260.4,205.8Z' },
  { key: 'queens', name: 'Queens', label: 'QNS', lx: 267, ly: 205, d: 'M260.9,205.6L260.4,205.8L258.8,207.1L258.1,207.3L257.4,205.6L256.6,204.6L255.7,203.8L255.4,202.4L254.9,201.4L254.1,201.1L253.2,200.1L252.4,199.9L251.8,200.2L251.6,200.1L251.7,199.4L252.1,199.1L252.4,198.3L253.5,196.6L253.8,196.3L254.2,195.9L254.3,195.7L254.1,195.6L254.0,195.3L254.3,194.7L255.0,195.0L256.2,193.8L256.8,193.2L256.6,192.5L257.8,193.0L258.6,193.3L258.7,193.3L258.8,193.7L259.3,193.8L260.7,193.7L261.1,192.8L261.5,192.4L264.6,191.6L266.6,191.4L268.3,192.0L269.0,191.9L269.5,192.7L270.0,192.6L270.7,191.9L272.9,194.6L277.3,198.2L277.4,198.9L277.4,199.4L272.1,219.8L272.2,219.2L270.1,219.2L267.5,219.8L267.0,220.0L264.3,220.9L259.9,223.1L254.4,225.1L254.4,223.8L254.6,223.1L254.3,222.5L254.0,222.4L262.7,219.5L261.7,210.9L262.2,209.7L261.1,207.4Z' },
  { key: 'bronx', name: 'The Bronx', label: 'BX', lx: 262, ly: 186, d: 'M270.3,184.3L270.5,184.2L271.0,184.6L271.1,185.0L271.0,186.2L270.6,186.2L270.3,185.8L270.2,184.9ZM269.0,191.9L268.3,192.0L266.6,191.4L264.6,191.6L261.5,192.4L261.1,192.8L260.7,193.7L259.3,193.8L258.8,193.7L258.7,193.3L258.6,193.3L257.8,193.0L256.6,192.5L257.1,182.5L257.1,182.1L256.7,181.7L256.3,182.2L254.5,181.3L254.5,181.3L255.1,179.6L255.9,177.3L256.0,176.7L265.3,180.3L265.3,180.3L265.3,180.3L265.4,180.2L265.4,180.2L267.0,180.7L267.2,180.8L269.3,181.5L269.1,181.8L269.1,183.0L268.7,184.4L268.8,185.0L269.1,185.3L269.4,185.9L269.4,186.2L269.4,186.5L269.5,187.0L269.4,187.1L269.2,187.2L269.1,187.1L268.8,186.6L268.5,186.0L268.7,185.3L268.4,184.8L268.3,184.8L267.9,185.2L267.7,185.8L267.0,185.6L266.4,185.9L266.1,187.5L266.1,188.0L266.5,188.7L267.2,189.6L267.9,190.0Z' },
  { key: 'statenisland', name: 'Staten Island', label: 'S.I.', lx: 233, ly: 221, d: 'M233.7,226.4L233.3,226.5L232.1,227.5L230.4,228.4L230.0,228.3L228.3,229.4L227.2,229.7L226.3,230.6L225.0,230.8L223.7,231.4L223.3,231.4L222.9,230.6L222.8,229.9L223.1,229.1L224.1,228.2L224.2,226.9L223.6,225.3L225.4,223.8L226.6,223.8L227.2,223.1L227.9,219.4L228.6,218.4L228.7,217.8L228.7,215.9L228.2,215.8L228.1,215.5L228.2,213.9L229.3,212.5L230.2,212.1L230.8,212.1L231.2,212.5L232.9,212.9L236.1,212.5L239.4,211.7L240.5,211.7L241.1,212.6L241.3,214.9L242.0,216.4L242.7,217.5L242.1,218.8L241.2,220.0L239.0,222.3L237.0,224.9L236.9,224.8L236.0,225.4L234.4,227.0L234.2,226.6Z' },
]

const areas = regions.map((r) => ({ key: r.key, name: r.name }))

// FAQ — questions & answers lifted verbatim from nycheadlights.com/faq.
const faqs = [
  { q: 'Can foggy headlights be repaired or do they need replacement?', a: 'Foggy headlights can often be restored if the damage is on the surface. However, if there is internal damage, moisture intrusion, or structural issues, replacement may be necessary.' },
  { q: 'Can you help me find the correct OEM headlight?', a: "Yes. We match headlights based on your vehicle's year, make, model, trim, and lighting type to ensure proper fitment." },
  { q: 'What does OEM mean for headlights?', a: "OEM stands for Original Equipment Manufacturer. These headlights are designed to match your vehicle's original factory specifications for fit and performance." },
  { q: 'Are OEM headlights better than aftermarket?', a: "OEM headlights typically provide better fitment, alignment, and compatibility with your vehicle's electrical system compared to aftermarket options." },
  { q: 'What are aftermarket headlight upgrades?', a: 'Aftermarket upgrades include LED conversions, projector retrofits, and custom lighting enhancements designed to improve visibility and appearance.' },
  { q: 'Do LED upgrades improve visibility?', a: 'Yes. High-quality LED upgrades can significantly improve brightness, clarity, and nighttime visibility.' },
  { q: 'Can you fix moisture inside a headlight?', a: 'Yes. We can remove moisture, reseal the housing, and prevent future condensation issues depending on the condition of the headlight.' },
  { q: 'How long does headlight repair take?', a: 'Most headlight repairs can be completed within a few hours. More complex issues involving wiring or internal components may take longer.' },
  { q: 'How much does headlight replacement cost?', a: 'Pricing varies by vehicle and headlight type, with OEM options typically costing more than aftermarket alternatives.' },
  { q: 'Do you service luxury vehicles?', a: 'Yes. We work on a wide range of vehicles including BMW, Mercedes-Benz, Audi, Lexus, and more.' },
  { q: 'Do you offer same-day service?', a: 'Many services can be completed the same day depending on availability and the complexity of the job.' },
]

export default function App() {
  const [activeArea, setActiveArea] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)
  const [query, setQuery] = useState('')
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const onSearchSubmit = useCallback((e) => {
    e.preventDefault()
    const q = query.trim()
    const subject = q ? `Headlight search — ${q}` : 'Headlight inquiry'
    const body = [
      "I'm looking for the following headlight / part:",
      '',
      q || '(year, make, model & side — e.g. 2021 BMW X5 driver side)',
    ].join('\n')
    setMenuOpen(false)
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }, [query])

  const onField = useCallback((e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }, [])

  const onQuoteSubmit = useCallback((e) => {
    e.preventDefault()
    const subject = `Quote request — ${form.name || 'Headlight service'}`
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      '',
      'Vehicle & details:',
      form.message,
    ].join('\n')
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }, [form])

  return (
    <>
      {/* TOP TRUST BAR (CarParts-style utility strip) */}
      <div className="topbar">
        <div className="wrap">
          <div className="topbar-props">
            <span>Guaranteed OEM Fit</span>
            <span>24-Hour Turnaround Available</span>
            <span>Warranty-Backed</span>
            <span>Free Quotes</span>
          </div>
          <div className="topbar-right">
            <span className="tb-hours"><span className="tb-ic">{icons.clock}</span>Mon–Sat 9AM–7PM · Sun by appointment</span>
          </div>
        </div>
      </div>

      <header>
        <div className="wrap nav">
          <a className="nav-logo" href="#" onClick={closeMenu}>
            <img src={`${BASE}assets/nych/logo.png`} alt="NYC Headlights" />
            <span className="nav-brand">
              <span className="nb-name">NYC Headlights</span>
              <span className="nb-tag mono">OEM Headlight Specialists</span>
            </span>
          </a>
          <form className="hsearch" onSubmit={onSearchSubmit} role="search">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by year, make, model or part — e.g. 2021 BMW X5"
              aria-label="Search headlights by vehicle or part"
            />
            <button type="submit" aria-label="Search">{icons.search}</button>
          </form>
          <div className="nav-actions">
            <a className="nav-phone" href={PHONE_TEL}>
              <span className="np-ic">{icons.phone}</span>
              <span className="np-text">{PHONE}</span>
            </a>
            <a className="btn" href="#quote">Get a free quote</a>
          </div>
          <button
            className={`nav-toggle${menuOpen ? ' open' : ''}`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
        <div className="subnav">
          <nav className="wrap subnav-links">
            <a href="#categories">Shop by Type</a>
            <a href="#services">Services</a>
            <a href="#inventory">In Stock</a>
            <a href="#vehicles">Vehicles</a>
            <a href="#trade">Trade &amp; Body Shops</a>
            <a href="#areas">Service Areas</a>
            <a href="#faq">FAQ</a>
          </nav>
        </div>
        <nav className={`mobile-menu${menuOpen ? ' open' : ''}`}>
          <form className="hsearch" onSubmit={onSearchSubmit} role="search">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search year, make, model or part…"
              aria-label="Search headlights"
            />
            <button type="submit" aria-label="Search">{icons.search}</button>
          </form>
          <a href="#categories" onClick={closeMenu}>Shop by Type</a>
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#inventory" onClick={closeMenu}>In Stock</a>
          <a href="#vehicles" onClick={closeMenu}>Vehicles</a>
          <a href="#trade" onClick={closeMenu}>Trade &amp; Body Shops</a>
          <a href="#areas" onClick={closeMenu}>Service Areas</a>
          <a href="#faq" onClick={closeMenu}>FAQ</a>
          <a className="nav-phone" href={PHONE_TEL} onClick={closeMenu}><span className="np-ic">{icons.phone}</span>{PHONE}</a>
          <a className="btn" href="#quote" onClick={closeMenu}>Get a free quote</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" style={{ backgroundImage: `url(${BASE}assets/nych/hero-headlight.jpg)` }} />

        <div className="hero-content">
          <div className="wrap hero-grid">
            <div className="hero-main">
              <div className="hero-kicker mono">OEM Headlight Specialists · Trade &amp; Retail · All Five Boroughs</div>
              <h1>Precision optics<br />for the city that <em>never sleeps.</em></h1>
              <div className="hero-row">
                <p>NYC Headlights is the city's OEM headlight specialist — restoration, retrofits and certified replacements for BMW, Mercedes-Benz, Lexus, Audi, Toyota, Mazda and more, across all five boroughs.</p>
              </div>
              <div className="hero-meta mono">
                <span>10,000+ parts in stock</span>
                <span>24-hour turnaround available</span>
                <span>Certified · Warrantied</span>
              </div>
            </div>

            <form className="quote-card" onSubmit={onQuoteSubmit}>
              <div className="qc-top">
                <span className="qc-kicker mono">Call us today</span>
                <a className="qc-phone" href={PHONE_TEL}>{PHONE_DOT}</a>
              </div>
              <div className="qc-div" />
              <h2 className="qc-h">Get a free quote</h2>
              <div className="qc-fields">
                <input name="name" value={form.name} onChange={onField} placeholder="Name*" autoComplete="name" required />
                <input name="email" type="email" value={form.email} onChange={onField} placeholder="E-mail address*" autoComplete="email" required />
                <input name="phone" type="tel" value={form.phone} onChange={onField} placeholder="Contact number*" autoComplete="tel" required />
                <textarea name="message" value={form.message} onChange={onField} placeholder="Year, make, model & the issue*" rows={4} required />
              </div>
              <button className="btn qc-submit" type="submit">
                {sent ? 'Thank you — opening your email…' : 'Request my free quote'}
              </button>
              <p className="qc-fine mono">Free quotes across all five boroughs · usually the same day</p>
            </form>
          </div>
        </div>
      </section>

      {/* SHOP BY TYPE — category tiles */}
      <section className="cats" id="categories">
        <div className="wrap">
          <div className="cats-head">
            <div className="k mono">Shop by Type</div>
            <h2>Browse headlights</h2>
            <p>Jump straight to the work you need — OEM, upgrades or restoration.</p>
          </div>
          <div className="cat-row">
            {categories.map((c) => (
              <a className="cat" href={c.href} key={c.name}>
                <span className="cat-ic">{icons[c.icon]}</span>
                <span className="cat-name">{c.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIALIST BANNER */}
      <section className="license">
        <div className="wrap">
          <p className="license-line">
            <span className="nyc">NYC's</span> precision headlight <span className="lic">specialists</span>
          </p>
          <p className="license-sub">Certified automotive lighting solutions — OEM specialists for BMW, Mercedes-Benz, Lexus, Audi, Toyota &amp; Mazda.</p>
        </div>
      </section>

      {/* TRUST */}
      <div className="trust dark">
        <div><div className="n"><em>10,000</em>+</div><div className="l">Headlight parts in stock</div></div>
        <div><div className="n">24<em>hr</em></div><div className="l">Express turnaround available</div></div>
        <div><div className="n"><em>5</em></div><div className="l">NYC boroughs served</div></div>
        <div><div className="n">OEM</div><div className="l">Certified parts &amp; warranty</div></div>
      </div>

      {/* SERVICES */}
      <section className="sec" id="services">
        <div className="wrap">
          <div className="sec-head">
            <div><div className="k mono">01 / Services</div><h2>What we do</h2></div>
            <p>Trained optics specialists — not general mechanics. From a clouded lens to a full OEM assembly, we diagnose, source and install it right.</p>
          </div>
          <div className="svc">
            {services.map((s) => (
              <div className="svc-card" key={s.title}>
                <div className="svc-icon-tr">{icons[s.icon]}</div>
                <h3>{s.title}</h3>
                <p>{s.copy}</p>
                <div className="tags">{s.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED IN STOCK */}
      <section className="sec dark" id="inventory">
        <div className="wrap">
          <div className="sec-head">
            <div><div className="k mono">02 / In Stock</div><h2>Featured OEM headlights in stock</h2></div>
            <p>Ready-to-ship OEM headlights for popular makes and models — authenticated, warranted and ready to install or deliver.</p>
          </div>
          <div className="feat">
            {featured.map((f) => (
              <div className="prod" key={f.model}>
                <div className="prod-media">
                  <div className="img" style={{ backgroundImage: `url(${BASE}assets/nych/gallery/${f.img})` }} />
                  <span className="prod-badge mono">In Stock</span>
                </div>
                <div className="prod-info">
                  <span className="prod-make mono">{f.make}</span>
                  <h3>{f.model}</h3>
                  <span className="prod-link">OEM Headlight Assembly →</span>
                </div>
              </div>
            ))}
          </div>
          <div className="feat-foot">
            <a className="btn ghost" href={`mailto:${EMAIL}?subject=${encodeURIComponent('Inventory inquiry')}`}>Check full inventory</a>
          </div>
        </div>
      </section>

      {/* SHOP BY VEHICLE */}
      <section className="sec" id="vehicles">
        <div className="wrap">
          <div className="sec-head">
            <div><div className="k mono">03 / By Vehicle</div><h2>Shop OEM headlights by vehicle</h2></div>
            <p>We focus on what matters most — high-demand OEM headlights for the makes we know best, with verified compatibility and faster sourcing.</p>
          </div>
          <div className="vehicles">
            {brands.map((b) => (
              <div className="vcard" key={b.slug}>
                <div className="vlogo"><img src={`${BASE}assets/nych/brands/${b.slug}.png`} alt={`${b.name} logo`} loading="lazy" /></div>
                <h3>{b.name}</h3>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AREAS */}
      <section className="sec dark" id="areas">
        <div className="wrap">
          <div className="sec-head">
            <div><div className="k mono">04 / Service Areas</div><h2>Where we work</h2></div>
            <p>Serving all five boroughs of New York City — walk-in service welcome, with same-day options across Manhattan, Brooklyn, Queens, the Bronx and Staten Island.</p>
          </div>
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
                  <text
                    key={r.key}
                    className={`rg-label${activeArea === r.key ? ' active' : ''}`}
                    x={r.lx}
                    y={r.ly}
                    textAnchor="middle"
                  >
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

      {/* TRADE / BODY SHOPS */}
      <section className="trade" id="trade">
        <div className="wrap">
          <div className="trade-in">
            <div>
              <div className="k mono">Trade &amp; Wholesale</div>
              <h2>Built for body shops &amp; the trade</h2>
              <p>We supply body shops, dealers and independent garages across NYC with authenticated OEM headlights and a used-assembly buy-back program — trade pricing, fast sourcing and a direct line to a specialist who knows the part.</p>
              <ul>
                <li>Trade pricing on OEM &amp; upgrade assemblies for shops</li>
                <li>10,000+ parts in stock — driver, passenger or matched pairs</li>
                <li>We buy used assemblies and recycle cores</li>
                <li>24-hour turnaround available on stocked parts</li>
              </ul>
            </div>
            <div className="trade-card">
              <span className="tc-k">Open a trade line</span>
              <a className="tc-phone" href={PHONE_TEL}>{PHONE_DOT}</a>
              <a className="tc-email" href={`mailto:${EMAIL}?subject=${encodeURIComponent('Trade / wholesale account inquiry')}`}>{EMAIL}</a>
              <div className="tc-div" />
              <a className="btn" href={`mailto:${EMAIL}?subject=${encodeURIComponent('Trade / wholesale pricing request')}`}>Request trade pricing</a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sec dark" id="faq">
        <div className="wrap">
          <div className="sec-head">
            <div><div className="k mono">05 / FAQ</div><h2>Common questions</h2></div>
            <p>Headlights, OEM versus aftermarket, turnaround and fitment — the answers we give most often. Still unsure? Call or send us your vehicle.</p>
          </div>
          <div className="faq-list">
            {faqs.map((f) => (
              <details className="faq-item" key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="cta"
        id="quote"
        style={{ backgroundImage: `linear-gradient(rgba(8,9,11,.80),rgba(8,9,11,.88)), url(${BASE}assets/nych/audi.avif)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="cta-in">
          <h2>Ready to <em>light up</em><br />the road ahead?</h2>
          <p>Tell us your year, make, model and the issue — we'll come back with a price and timeline. Free quotes across all five boroughs, usually the same day.</p>
          <div className="cta-actions">
            <a className="btn" href={`mailto:${EMAIL}`}>Get a free quote</a>
            <a className="btn ghost" href={PHONE_TEL}>Call {PHONE}</a>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="foot">
            <div className="foot-logo">
              <img src={`${BASE}assets/nych/logo.png`} alt="NYC Headlights" />
              <p className="mono" style={{ marginTop: 16, color: 'var(--mute)' }}>Restore · Retrofit · Replace</p>
            </div>
            <div className="foot-cols">
              <div className="foot-col"><h5 className="mono">Explore</h5><a href="#categories">Shop by Type</a><a href="#inventory">In Stock</a><a href="#vehicles">Vehicles</a><a href="#trade">Trade &amp; Body Shops</a><a href="#faq">FAQ</a><a href="#areas">Service Areas</a></div>
              <div className="foot-col"><h5 className="mono">Services</h5><a href="#services">OEM Replacement</a><a href="#services">Restoration &amp; Refurbish</a><a href="#services">Aftermarket Upgrades</a><a href="#trade">Wholesale &amp; Recycling</a></div>
              <div className="foot-col">
                <h5 className="mono">Contact</h5>
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                <a href={PHONE_TEL}>{PHONE}</a>
                <a href="https://maps.google.com/?q=New+York+City" target="_blank" rel="noreferrer">New York City · All five boroughs</a>
                <span className="foot-hours mono">Mon–Sat: 9AM–7PM · Sun: By Appointment</span>
              </div>
            </div>
          </div>
          <div className="foot-bottom"><span>© 2026 NYC Headlights · OEM Headlight Specialists</span><span>Restore · Retrofit · Replace</span></div>
        </div>
      </footer>
    </>
  )
}

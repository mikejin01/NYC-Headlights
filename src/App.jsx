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
}

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

const steps = [
  { s: '/01', h: 'Diagnose & Quote', p: 'We inspect the assembly, identify the right OEM part or restoration path, and give you a fixed price up front.' },
  { s: '/02', h: 'Source or Prep', p: 'We pull the certified OEM optic from our 10,000+ part inventory — or prep the lens and housing for restoration.' },
  { s: '/03', h: 'Service', p: 'Restore, retrofit or replace — moisture sealing, wiring, ballast work and LED/laser conversions by optics specialists.' },
  { s: '/04', h: 'Install & Warranty', p: 'We fit, aim and road-test every job, then back it with warranty. Most jobs in 3–5 days; express available.' },
]

export default function App() {
  const [activeArea, setActiveArea] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])

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
      <header>
        <div className="wrap nav">
          <a className="nav-logo" href="#" onClick={closeMenu}>
            <img src={`${BASE}assets/nych/logo.png`} alt="NYC Headlights" />
          </a>
          <nav className="nav-links">
            <a href="#services">Services</a>
            <a href="#inventory">In Stock</a>
            <a href="#vehicles">Vehicles</a>
            <a href="#areas">Service Areas</a>
            <a href="#process">Process</a>
            <a className="nav-phone" href={PHONE_TEL}>{PHONE}</a>
            <a className="btn" href="#quote">Get a free quote</a>
          </nav>
          <button
            className={`nav-toggle${menuOpen ? ' open' : ''}`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
        <nav className={`mobile-menu${menuOpen ? ' open' : ''}`}>
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#inventory" onClick={closeMenu}>In Stock</a>
          <a href="#vehicles" onClick={closeMenu}>Vehicles</a>
          <a href="#areas" onClick={closeMenu}>Service Areas</a>
          <a href="#process" onClick={closeMenu}>Process</a>
          <a className="nav-phone" href={PHONE_TEL} onClick={closeMenu}>{PHONE}</a>
          <a className="btn" href="#quote" onClick={closeMenu}>Get a free quote</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" style={{ backgroundImage: `url(${BASE}assets/nych/hero-headlight.jpg)` }} />

        <div className="hero-content">
          <div className="wrap hero-grid">
            <div className="hero-main">
              <div className="hero-kicker mono">OEM Headlight Specialists · All Five Boroughs</div>
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

      {/* PROCESS */}
      <section className="sec" id="process">
        <div className="wrap">
          <div className="sec-head">
            <div><div className="k mono">05 / Process</div><h2>Four steps, one shop</h2></div>
            <p>A straight path from quote to install — diagnostics, parts, service and warranty, all handled in-house by our techs.</p>
          </div>
          <div className="proc">
            {steps.map((st) => (
              <div className="proc-step" key={st.s}>
                <span className="s">{st.s}</span><h4>{st.h}</h4><p>{st.p}</p>
              </div>
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
              <div className="foot-col"><h5 className="mono">Company</h5><a href="#services">Services</a><a href="#inventory">In Stock</a><a href="#vehicles">Vehicles</a><a href="#process">Process</a><a href="#areas">Service Areas</a></div>
              <div className="foot-col"><h5 className="mono">Services</h5><a href="#services">OEM Replacement</a><a href="#services">Restoration &amp; Refurbish</a><a href="#services">Aftermarket Upgrades</a><a href="#services">Wholesale &amp; Recycling</a></div>
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

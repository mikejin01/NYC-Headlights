import { useCallback, useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { T } from '../content/InlineEdit'
import { Img } from '../content/ImageEdit'
import { SmartLink, withSlash } from '../content/LinkEdit'
import { EditToolbar } from '../content/EditToolbar'
import { routeKey, useBusiness, useWPEdit } from '../content/WPEditProvider'
import { icons } from '../data/catalog'
import routeConfig from '../routes.json'
import { asset } from './Sections'

const NAV = [
  { href: '/services', label: 'Services' },
  { href: '/oem-headlights', label: 'OEM Headlights' },
  { href: '/services#trade', label: 'Trade & Body Shops' },
  { href: '/service-areas', label: 'Service Areas' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

const LEGAL = routeConfig.routes.filter((r) => r.wpContent)

// Scroll to top on route change, or to the #anchor when one is present.
// Also keeps <title> right on client-side navigation (Yoast owns the first load).
function RouteEffects() {
  const { pathname, hash } = useLocation()
  const { wpRest } = useWPEdit()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) { el.scrollIntoView({ behavior: 'instant', block: 'start' }); return }
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])
  useEffect(() => {
    const key = routeKey(pathname)
    const fromWp = wpRest?.titles?.[key]
    const route = routeConfig.routes.find((r) => r.path === key)
    if (fromWp || route) document.title = fromWp || route.seoTitle
  }, [pathname, wpRest])
  return null
}

function SearchForm({ placeholder, label, onDone }) {
  const { email } = useBusiness()
  const [query, setQuery] = useState('')
  const onSubmit = (e) => {
    e.preventDefault()
    const q = query.trim()
    const subject = q ? `Headlight search — ${q}` : 'Headlight inquiry'
    const body = ["I'm looking for the following headlight / part:", '', q || '(year, make, model & side — e.g. 2021 BMW X5 driver side)'].join('\n')
    onDone?.()
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }
  return (
    <form className="hsearch" onSubmit={onSubmit} role="search">
      <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={placeholder} aria-label={label} />
      <button type="submit" aria-label="Search">{icons.search}</button>
    </form>
  )
}

export default function Layout() {
  const { phone, phoneTel, email, hours } = useBusiness()
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const { pathname } = useLocation()
  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <>
      <RouteEffects />

      <div className="topbar">
        <div className="wrap">
          <div className="topbar-props">
            <T k="site_topbar_1">Guaranteed OEM Fit</T>
            <T k="site_topbar_2">24-Hour Turnaround Available</T>
            <T k="site_topbar_3">Warranty-Backed</T>
            <T k="site_topbar_4">Free Quotes</T>
          </div>
          <div className="topbar-right">
            <span className="tb-hours"><span className="tb-ic">{icons.clock}</span>{hours}</span>
          </div>
        </div>
      </div>

      <header>
        <div className="wrap nav">
          <SmartLink className="nav-logo" href="/" onClick={closeMenu}>
            <Img k="site_logo_img" src={asset('logo.png')} alt="NYC Headlights" />
            <span className="nav-brand">
              <T k="site_brand_name" className="nb-name">NYC Headlights</T>
              <T k="site_brand_tag" className="nb-tag mono">OEM Headlight Specialists</T>
            </span>
          </SmartLink>
          <SearchForm placeholder="Search by year, make, model or part — e.g. 2021 BMW X5" label="Search headlights by vehicle or part" />
          <div className="nav-actions">
            <a className="nav-phone" href={phoneTel}>
              <span className="np-ic">{icons.phone}</span>
              <span className="np-text">{phone}</span>
            </a>
            <SmartLink className="btn" href="/contact">Get a free quote</SmartLink>
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
          <nav className="wrap subnav-links" aria-label="Main">
            {NAV.map((n) => <NavLink key={n.href} to={withSlash(n.href)} end>{n.label}</NavLink>)}
          </nav>
        </div>
        <nav className={`mobile-menu${menuOpen ? ' open' : ''}`} aria-label="Mobile">
          <SearchForm placeholder="Search year, make, model or part…" label="Search headlights" onDone={closeMenu} />
          {NAV.map((n) => <SmartLink key={n.href} href={n.href} onClick={closeMenu}>{n.label}</SmartLink>)}
          <a className="nav-phone" href={phoneTel} onClick={closeMenu}><span className="np-ic">{icons.phone}</span>{phone}</a>
          <SmartLink className="btn" href="/contact" onClick={closeMenu}>Get a free quote</SmartLink>
        </nav>
      </header>

      <main id="main">
        <Outlet />
      </main>

      <footer>
        <div className="wrap">
          <div className="foot">
            <div className="foot-logo">
              <img src={asset('logo.png')} alt="NYC Headlights" />
              <T k="site_footer_tagline" as="p" className="mono foot-tagline">Restore · Retrofit · Replace</T>
            </div>
            <div className="foot-cols">
              <div className="foot-col">
                <h5 className="mono">Explore</h5>
                <SmartLink href="/#categories">Shop by Type</SmartLink>
                <SmartLink href="/oem-headlights">OEM Headlights</SmartLink>
                <SmartLink href="/services#trade">Trade &amp; Body Shops</SmartLink>
                <SmartLink href="/service-areas">Service Areas</SmartLink>
                <SmartLink href="/faq">FAQ</SmartLink>
              </div>
              <div className="foot-col">
                <h5 className="mono">Services</h5>
                <SmartLink href="/services">OEM Replacement</SmartLink>
                <SmartLink href="/services">Restoration &amp; Refurbish</SmartLink>
                <SmartLink href="/services">Aftermarket Upgrades</SmartLink>
                <SmartLink href="/services#trade">Wholesale &amp; Recycling</SmartLink>
              </div>
              <div className="foot-col">
                <h5 className="mono">Contact</h5>
                <a href={`mailto:${email}`}>{email}</a>
                <a href={phoneTel}>{phone}</a>
                <SmartLink href="/contact">Get a free quote</SmartLink>
                <span className="foot-hours mono">{hours}</span>
              </div>
            </div>
          </div>
          <div className="foot-bottom">
            <T k="site_footer_copy">© 2026 NYC Headlights · OEM Headlight Specialists</T>
            <span className="foot-legal">
              {LEGAL.map((r) => <SmartLink key={r.path} href={r.path}>{r.title}</SmartLink>)}
            </span>
          </div>
        </div>
      </footer>

      <EditToolbar />
    </>
  )
}

import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { T } from '../content/InlineEdit'
import { SmartLink } from '../content/LinkEdit'
import { routeKey, useBusiness, useWPEdit } from '../content/WPEditProvider'
import { QuoteForm } from '../components/QuoteForm'
import {
  Areas, Categories, Cta, Faq, HomeHero, InStock, PageHero, Services,
  SpecialistBanner, Trade, Trust, Vehicles,
} from '../components/Sections'

export function Home() {
  return (
    <>
      <HomeHero />
      <Categories />
      <SpecialistBanner />
      <Trust />
      <Services />
      <InStock />
      <Trade />
      <Cta />
    </>
  )
}

export function ServicesPage() {
  return (
    <>
      <PageHero slug="services" kicker="Services" title="Headlight repair, restoration & upgrades" intro="OEM replacement, lens restoration, LED and laser conversions, projector retrofits and wholesale supply — handled by trained optics specialists." />
      <Services />
      <Categories />
      <Trade />
      <Cta />
    </>
  )
}

export function OemHeadlightsPage() {
  return (
    <>
      <PageHero slug="oem" kicker="OEM Headlights" title="OEM headlights, in stock and ready to install" intro="Authenticated factory assemblies for BMW, Mercedes-Benz, Lexus, Audi, Toyota, Mazda and more — 10,000+ parts on hand, driver, passenger or matched pairs." />
      <InStock />
      <Vehicles />
      <Cta />
    </>
  )
}

export function FaqPage() {
  return (
    <>
      <PageHero slug="faq" kicker="FAQ" title="Headlight questions, answered" intro="OEM versus aftermarket, foggy lenses, moisture, LED upgrades, turnaround and cost." />
      <Faq />
      <Cta />
    </>
  )
}

export function ServiceAreasPage() {
  return (
    <>
      <PageHero slug="areas" kicker="Service Areas" title="Headlight service across all five boroughs" intro="Manhattan, Brooklyn, Queens, the Bronx and Staten Island — walk-ins welcome, with same-day options citywide." />
      <Areas />
      <Cta />
    </>
  )
}

export function ContactPage() {
  const { phone, phoneTel, email, hours } = useBusiness()
  return (
    <>
      <PageHero slug="contact" kicker="Contact" title="Get a free headlight quote" intro="Tell us your year, make, model and the issue. We'll come back with a price and timeline, usually the same day." />
      <section className="sec contact-sec">
        <div className="wrap contact-grid">
          <div className="contact-info">
            <T k="page_contact_info_title" as="h2">Talk to a headlight specialist</T>
            <T k="page_contact_info_intro" as="p" multiline>Call, email or send the form. Trade and body-shop accounts welcome.</T>
            <dl>
              <dt className="mono">Phone</dt><dd><a href={phoneTel}>{phone}</a></dd>
              <dt className="mono">Email</dt><dd><a href={`mailto:${email}`}>{email}</a></dd>
              <dt className="mono">Hours</dt><dd>{hours}</dd>
              <dt className="mono">Area</dt><dd><SmartLink href="/service-areas">New York City · all five boroughs</SmartLink></dd>
            </dl>
          </div>
          <QuoteForm />
        </div>
      </section>
    </>
  )
}

// Legal pages: the body is the WordPress page's own content, edited in WP Admin.
// First load gets it inline in wpRest; client-side navigation fetches it.
export function WpContentPage({ route }) {
  const { pathname } = useLocation()
  const { wpRest, onWordPress } = useWPEdit()
  const key = routeKey(pathname)
  const inline = wpRest?.content?.path === key ? wpRest.content : null
  const [content, setContent] = useState(inline)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (inline) { setContent(inline); return }
    if (!onWordPress) return
    let cancelled = false
    setContent(null)
    fetch(`${wpRest?.root || '/wp-json/'}xo/v1/page-content?path=${encodeURIComponent(key)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
      .then((d) => { if (!cancelled) setContent(d) })
      .catch(() => { if (!cancelled) setFailed(true) })
    return () => { cancelled = true }
  }, [key, inline, onWordPress, wpRest])

  return (
    <>
      <section className="page-hero dark">
        <div className="wrap">
          <div className="k mono">Legal</div>
          <h1>{content?.title || route.title}</h1>
        </div>
      </section>
      <section className="sec">
        <div className="wrap">
          {content?.html
            ? <div className="wp-content" dangerouslySetInnerHTML={{ __html: content.html }} />
            : <p className="wp-content-note">{failed || !onWordPress ? 'This page is managed in WordPress.' : 'Loading…'}</p>}
        </div>
      </section>
    </>
  )
}

export function NotFound() {
  return (
    <>
      <PageHero slug="404" kicker="404" title="That page isn't here" intro="The link may be old or mistyped." />
      <section className="sec">
        <div className="wrap not-found">
          <SmartLink className="btn" href="/">Back to the homepage</SmartLink>
          <SmartLink className="btn ghost-dark" href="/contact">Get a free quote</SmartLink>
        </div>
      </section>
    </>
  )
}

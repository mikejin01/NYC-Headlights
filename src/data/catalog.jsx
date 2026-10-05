// Catalog data for the sections. Text here is the code DEFAULT only — every
// string is rendered through getText() with the key built from each item's id,
// so live edits in WordPress override it (see src/content/WPEditProvider.jsx).

export const services = [
  {
    id: 'oem',
    title: 'OEM Replacement',
    icon: 'oem',
    copy: 'Factory-direct optics for all major makes and models — authenticated, certified assemblies backed by a full warranty.',
    tags: ['OEM', 'Certified', 'Full Warranty'],
  },
  {
    id: 'restore',
    title: 'Restoration & Refurbish',
    icon: 'restore',
    copy: 'Lens restoration, moisture removal, wiring repair and ballast diagnostics — bringing foggy, failing headlights back to factory-clear.',
    tags: ['Lens Restoration', 'Moisture Removal', 'Wiring', 'Ballast'],
  },
  {
    id: 'upgrade',
    title: 'Aftermarket Upgrades',
    icon: 'upgrade',
    copy: 'Performance LED and laser conversions, projector retrofits and custom DRL installs — brighter, sharper output, cleanly integrated.',
    tags: ['LED', 'Laser', 'Retrofit', 'Custom DRL'],
  },
  {
    id: 'wholesale',
    title: 'Wholesale & Recycling',
    icon: 'wholesale',
    copy: 'We buy used headlight assemblies and recycle cores — wholesale supply and trade pricing for shops across the city.',
    tags: ['Wholesale', 'Core Buy-Back', 'Recycling'],
  },
]

export const ICON_PROPS = { viewBox: '0 0 48 48', fill: 'none', stroke: 'currentColor', strokeWidth: 2.1, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const icons = {
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
// service/product line; tiles link to the matching page.
export const categories = [
  { id: 'oem', name: 'OEM Assemblies', icon: 'oem', href: '/oem-headlights' },
  { id: 'led', name: 'LED Upgrades', icon: 'upgrade', href: '/services' },
  { id: 'laser', name: 'Laser Systems', icon: 'laser', href: '/services' },
  { id: 'projector', name: 'Projector Retrofit', icon: 'projector', href: '/services' },
  { id: 'restore', name: 'Restoration', icon: 'restore', href: '/services' },
  { id: 'trade', name: 'Trade & Wholesale', icon: 'wholesale', href: '/services#trade' },
]

// Featured ready-to-ship OEM headlights (vehicles mirror nycheadlights.com),
// paired with our in-shop assembly photos.
export const featured = [
  { id: 'f1', make: 'Toyota', model: '2024–2025 Highlander', img: 'g1.jpg' },
  { id: 'f2', make: 'BMW', model: '2022–2025 X4 / X5', img: 'g4.jpg' },
  { id: 'f3', make: 'Mercedes-Benz', model: '2016–2019 GLC', img: 'g6.jpg' },
  { id: 'f4', make: 'Lexus', model: '2023–2025 RX 350', img: 'g5.jpg' },
]

// Shop OEM headlights by vehicle — real manufacturer logos + copy from the live site.
export const brands = [
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
export const regions = [
  { key: 'manhattan', name: 'Manhattan', label: 'MAN', lx: 250, ly: 195, d: 'M243.9,205.0L244.0,204.9L244.1,205.0L244.2,205.1L243.7,206.4L243.6,206.5L243.4,206.4L243.3,206.3L243.3,206.2ZM251.6,200.1L251.7,201.9L251.6,202.1L250.9,203.8L248.5,204.5L247.6,206.4L247.2,206.8L246.1,207.7L245.7,207.4L245.6,207.3L245.5,206.7L245.8,205.9L246.1,205.6L246.3,204.8L246.0,204.1L245.5,203.8L246.6,197.7L247.1,196.8L247.9,195.1L248.6,193.5L249.2,192.2L253.0,184.4L254.1,182.3L254.5,181.3L256.3,182.2L256.7,181.7L257.1,182.1L257.1,182.5L256.6,192.5L256.8,193.2L256.2,193.8L255.0,195.0L254.3,194.7L254.0,195.3L254.1,195.6L254.3,195.7L254.2,195.9L253.8,196.3L253.5,196.6L252.4,198.3L252.1,199.1L251.7,199.4Z' },
  { key: 'brooklyn', name: 'Brooklyn', label: 'BK', lx: 254, ly: 214, d: 'M260.9,205.6L261.1,207.4L262.2,209.7L261.7,210.9L262.7,219.5L254.0,222.4L253.4,222.0L252.9,221.4L252.0,221.5L248.8,221.8L247.8,221.8L247.1,221.5L246.8,221.3L246.7,220.8L247.2,220.1L247.3,220.0L247.8,219.2L247.6,218.5L246.9,217.9L244.7,217.4L244.1,216.3L243.8,214.8L244.2,213.2L244.4,212.7L244.8,212.0L246.2,210.3L245.9,207.8L245.7,207.4L246.1,207.7L247.2,206.8L247.6,206.4L248.5,204.5L250.9,203.8L251.6,202.1L251.7,201.9L251.6,200.1L251.8,200.2L252.4,199.9L253.2,200.1L254.1,201.1L254.9,201.4L255.4,202.4L255.7,203.8L256.6,204.6L257.4,205.6L258.1,207.3L258.8,207.1L260.4,205.8Z' },
  { key: 'queens', name: 'Queens', label: 'QNS', lx: 267, ly: 205, d: 'M260.9,205.6L260.4,205.8L258.8,207.1L258.1,207.3L257.4,205.6L256.6,204.6L255.7,203.8L255.4,202.4L254.9,201.4L254.1,201.1L253.2,200.1L252.4,199.9L251.8,200.2L251.6,200.1L251.7,199.4L252.1,199.1L252.4,198.3L253.5,196.6L253.8,196.3L254.2,195.9L254.3,195.7L254.1,195.6L254.0,195.3L254.3,194.7L255.0,195.0L256.2,193.8L256.8,193.2L256.6,192.5L257.8,193.0L258.6,193.3L258.7,193.3L258.8,193.7L259.3,193.8L260.7,193.7L261.1,192.8L261.5,192.4L264.6,191.6L266.6,191.4L268.3,192.0L269.0,191.9L269.5,192.7L270.0,192.6L270.7,191.9L272.9,194.6L277.3,198.2L277.4,198.9L277.4,199.4L272.1,219.8L272.2,219.2L270.1,219.2L267.5,219.8L267.0,220.0L264.3,220.9L259.9,223.1L254.4,225.1L254.4,223.8L254.6,223.1L254.3,222.5L254.0,222.4L262.7,219.5L261.7,210.9L262.2,209.7L261.1,207.4Z' },
  { key: 'bronx', name: 'The Bronx', label: 'BX', lx: 262, ly: 186, d: 'M270.3,184.3L270.5,184.2L271.0,184.6L271.1,185.0L271.0,186.2L270.6,186.2L270.3,185.8L270.2,184.9ZM269.0,191.9L268.3,192.0L266.6,191.4L264.6,191.6L261.5,192.4L261.1,192.8L260.7,193.7L259.3,193.8L258.8,193.7L258.7,193.3L258.6,193.3L257.8,193.0L256.6,192.5L257.1,182.5L257.1,182.1L256.7,181.7L256.3,182.2L254.5,181.3L254.5,181.3L255.1,179.6L255.9,177.3L256.0,176.7L265.3,180.3L265.3,180.3L265.3,180.3L265.4,180.2L265.4,180.2L267.0,180.7L267.2,180.8L269.3,181.5L269.1,181.8L269.1,183.0L268.7,184.4L268.8,185.0L269.1,185.3L269.4,185.9L269.4,186.2L269.4,186.5L269.5,187.0L269.4,187.1L269.2,187.2L269.1,187.1L268.8,186.6L268.5,186.0L268.7,185.3L268.4,184.8L268.3,184.8L267.9,185.2L267.7,185.8L267.0,185.6L266.4,185.9L266.1,187.5L266.1,188.0L266.5,188.7L267.2,189.6L267.9,190.0Z' },
  { key: 'statenisland', name: 'Staten Island', label: 'S.I.', lx: 233, ly: 221, d: 'M233.7,226.4L233.3,226.5L232.1,227.5L230.4,228.4L230.0,228.3L228.3,229.4L227.2,229.7L226.3,230.6L225.0,230.8L223.7,231.4L223.3,231.4L222.9,230.6L222.8,229.9L223.1,229.1L224.1,228.2L224.2,226.9L223.6,225.3L225.4,223.8L226.6,223.8L227.2,223.1L227.9,219.4L228.6,218.4L228.7,217.8L228.7,215.9L228.2,215.8L228.1,215.5L228.2,213.9L229.3,212.5L230.2,212.1L230.8,212.1L231.2,212.5L232.9,212.9L236.1,212.5L239.4,211.7L240.5,211.7L241.1,212.6L241.3,214.9L242.0,216.4L242.7,217.5L242.1,218.8L241.2,220.0L239.0,222.3L237.0,224.9L236.9,224.8L236.0,225.4L234.4,227.0L234.2,226.6Z' },
]

export const areas = regions.map((r) => ({ key: r.key, name: r.name }))

// FAQ — questions & answers lifted verbatim from nycheadlights.com/faq.
export const faqs = [
  { id: 1, q: 'Can foggy headlights be repaired or do they need replacement?', a: 'Foggy headlights can often be restored if the damage is on the surface. However, if there is internal damage, moisture intrusion, or structural issues, replacement may be necessary.' },
  { id: 2, q: 'Can you help me find the correct OEM headlight?', a: "Yes. We match headlights based on your vehicle's year, make, model, trim, and lighting type to ensure proper fitment." },
  { id: 3, q: 'What does OEM mean for headlights?', a: "OEM stands for Original Equipment Manufacturer. These headlights are designed to match your vehicle's original factory specifications for fit and performance." },
  { id: 4, q: 'Are OEM headlights better than aftermarket?', a: "OEM headlights typically provide better fitment, alignment, and compatibility with your vehicle's electrical system compared to aftermarket options." },
  { id: 5, q: 'What are aftermarket headlight upgrades?', a: 'Aftermarket upgrades include LED conversions, projector retrofits, and custom lighting enhancements designed to improve visibility and appearance.' },
  { id: 6, q: 'Do LED upgrades improve visibility?', a: 'Yes. High-quality LED upgrades can significantly improve brightness, clarity, and nighttime visibility.' },
  { id: 7, q: 'Can you fix moisture inside a headlight?', a: 'Yes. We can remove moisture, reseal the housing, and prevent future condensation issues depending on the condition of the headlight.' },
  { id: 8, q: 'How long does headlight repair take?', a: 'Most headlight repairs can be completed within a few hours. More complex issues involving wiring or internal components may take longer.' },
  { id: 9, q: 'How much does headlight replacement cost?', a: 'Pricing varies by vehicle and headlight type, with OEM options typically costing more than aftermarket alternatives.' },
  { id: 10, q: 'Do you service luxury vehicles?', a: 'Yes. We work on a wide range of vehicles including BMW, Mercedes-Benz, Audi, Lexus, and more.' },
  { id: 11, q: 'Do you offer same-day service?', a: 'Many services can be completed the same day depending on availability and the complexity of the job.' },
]

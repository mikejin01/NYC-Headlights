import { useState, useEffect, useCallback } from 'react'

const BASE = import.meta.env.BASE_URL

const PHONE = '(718) 961-1112'
const PHONE_DOT = '718.961.1112'
const PHONE_TEL = 'tel:+17189611112'
const EMAIL = 'info@spacesign.com'

const heroSlides = [
  { img: 'space-sign-hero-1.png', label: 'Space Sign — Custom Storefront Signage' },
  { img: 'space-sign-hero-2.png', label: 'Space Sign — Illuminated Channel Letters' },
  { img: 'space-sign-hero-3.png', label: 'Space Sign — Storefront Installation' },
  { img: 'space-sign-hero-4.png', label: 'Space Sign — Custom Sign Fabrication' },
]

const services = [
  {
    title: 'Channel & 3D Letters',
    icon: 'channel',
    copy: 'Dimensional, illuminated letters built in-house — front-lit, halo back-lit and front-&-back-lit — plus precision-cut 3D letters.',
    tags: ['Front-Lit', 'Halo', '3D Letters', 'Push-Thru'],
  },
  {
    title: 'LED, Neon & Lightbox',
    icon: 'neon',
    copy: 'Energy-efficient LED neon and illuminated lightbox signs — bright, even and built to outlast traditional neon, day and night.',
    tags: ['LED Neon', 'Lightbox', 'Illuminated'],
  },
  {
    title: 'Blade, Carved & Awnings',
    icon: 'blade',
    copy: 'Projecting blade & carved signs, freestanding pylons, custom awnings & vestibules, plus interior signage and printed graphics.',
    tags: ['Blade', 'Carved', 'Pylon', 'Awnings', 'Interior'],
  },
  {
    title: 'Permits & Violations',
    icon: 'permit',
    copy: 'As a NYC Licensed Sign Hanger (#215) we pull DOB permits and clear DOB & ECB violations — work only a licensed hanger can do.',
    tags: ['DOB Permits', 'ECB Violations', 'Licensed #215'],
  },
]

const ICON_PROPS = { viewBox: '0 0 48 48', fill: 'none', stroke: 'currentColor', strokeWidth: 2.1, strokeLinecap: 'round', strokeLinejoin: 'round' }

const icons = {
  // Bold illuminated channel letter "A" with side depth + glow bulbs
  channel: (
    <svg {...ICON_PROPS} aria-hidden="true">
      <path d="M12 36 L23 11 L34 36" />
      <path d="M16.6 26 H29.4" />
      <path d="M34 36 L37.5 36 M23 11 L25 13.5" className="ic-dot" />
      <circle cx="18.7" cy="24" r="1.4" className="ic-dot" />
      <circle cx="27.3" cy="24" r="1.4" className="ic-dot" />
    </svg>
  ),
  // Illuminated bulb with rays
  neon: (
    <svg {...ICON_PROPS} aria-hidden="true">
      <path d="M24 9 a9 9 0 0 1 5.5 16.1 c-1.3 1-1.9 2.3-2 3.9 h-7 c-.1-1.6-.7-2.9-2-3.9 A9 9 0 0 1 24 9 Z" />
      <path d="M20.5 33 h7" />
      <path d="M21.5 37 h5" />
      <path d="M24 3.5 V6" className="ic-dot" />
      <path d="M37 11 l-1.8 1.8" className="ic-dot" />
      <path d="M11 11 l1.8 1.8" className="ic-dot" />
    </svg>
  ),
  // Projecting blade / hanging sign on a wall post
  blade: (
    <svg {...ICON_PROPS} aria-hidden="true">
      <path d="M13 7 V41" />
      <path d="M13 15 H21" />
      <rect x="19" y="18" width="20" height="13" rx="1.5" />
      <path d="M24 15 V18" className="ic-dot" />
      <path d="M34 15 V18" className="ic-dot" />
      <path d="M29 21.5 V27.5" />
    </svg>
  ),
  // Storefront awning with scalloped valance and stripes
  awning: (
    <svg {...ICON_PROPS} aria-hidden="true">
      <path d="M9 25 L13 15 H35 L39 25 Z" />
      <path d="M9 25 q3 5 6 0 q3 5 6 0 q3 5 6 0 q3 5 6 0" />
      <path d="M19 15 L17.5 25" className="ic-dot" />
      <path d="M28.5 15 L30.5 25" className="ic-dot" />
      <path d="M13 39 V29 M35 39 V29" />
    </svg>
  ),
  // Display panel on a stand (interior / print)
  interior: (
    <svg {...ICON_PROPS} aria-hidden="true">
      <rect x="11" y="9" width="26" height="19" rx="1.6" />
      <path d="M16 16 H32" className="ic-dot" />
      <path d="M16 21 H27" className="ic-dot" />
      <path d="M24 28 V35" />
      <path d="M17 39 L24 35 L31 39" />
    </svg>
  ),
  // Permit document with approval check seal
  permit: (
    <svg {...ICON_PROPS} aria-hidden="true">
      <path d="M14 7 H28 L34 13 V35 H14 Z" />
      <path d="M28 7 V13 H34" />
      <path d="M19 19 H29" className="ic-dot" />
      <path d="M19 24 H29" className="ic-dot" />
      <path d="M19 29 H24" className="ic-dot" />
      <circle cx="31" cy="35" r="7" />
      <path d="M28 35 l2.2 2.2 L34.5 32.5" />
    </svg>
  ),
}

const work = [
  { img: 'pizza-channel-letters.jpg', name: 'Pizza Hut', type: 'Channel Letters', cls: 'big' },
  { img: 'nightlife-blade.jpg', name: 'Sports & Nightlife', type: 'Blade Sign', cls: 'tall' },
  { img: 'panini-channel-letters.jpg', name: 'Panini', type: 'Channel Letters', cls: 'third' },
  { img: 'bareburger.jpg', name: 'Bareburger', type: 'Channel Letters', cls: 'third' },
  { img: 'flowers-carved.jpg', name: 'Glen Maid Flower Bar', type: 'Carved Sign', cls: 'third' },
  { img: 'subway-neon.jpg', name: 'Subway', type: 'LED / Neon', cls: 'third' },
  { img: 'vision-optical.jpg', name: 'Vision Optical', type: 'Storefront', cls: 'third' },
  { img: 'illuminated-lightbox.jpg', name: 'Smoke Shop', type: 'Lightbox Sign', cls: 'third' },
]

const clients = [
  { file: 'shinhan-bank', name: 'Shinhan Bank' },
  { file: 'key-food', name: 'Key Food' },
  { file: 'mitsuwa', name: 'Mitsuwa Marketplace' },
  { file: 'gong-cha', name: 'Gong cha' },
  { file: 'food-bazaar', name: 'Food Bazaar Supermarket' },
  { file: 'deal-automotive', name: 'Deal Automotive Sales' },
  { file: 'daiso', name: 'Daiso' },
  { file: 'noah-bank', name: 'Noah Bank' },
  { file: 'taco-bell', name: 'Taco Bell' },
  { file: 'lash-forever', name: 'Lash Forever' },
  { file: 'kumon', name: 'Kumon' },
  { file: 'feel-beauty', name: 'Feel Beauty' },
  { file: 'bareburger', name: 'Bareburger' },
  { file: 'ny-radio-korea', name: 'NY Radio Korea' },
  { file: 'subway', name: 'Subway' },
  { file: 'new-millennium-bank', name: 'New Millennium Bank' },
  { file: 'european-wax-center', name: 'European Wax Center' },
  { file: 'tgi-fridays', name: 'TGI Fridays' },
  { file: 'dashing-diva', name: 'Dashing Diva' },
  { file: 'teso', name: 'TESO' },
]

// Coverage map — geographic shapes derived from US Census 1:500k county
// boundaries (5 NYC counties; Nassau+Suffolk unioned into Long Island; NJ &
// CT counties unioned into state outlines), projected (Mercator) into the
// 560×460 viewBox. lx/ly = on-map label position; showLabel hides the tiny
// borough labels (their names live in the side list).
const regions = [
  { key: 'manhattan', name: 'Manhattan', label: 'MAN', lx: 252, ly: 194, showLabel: false, d: 'M243.9,205.0L244.0,204.9L244.1,205.0L244.2,205.1L243.7,206.4L243.6,206.5L243.4,206.4L243.3,206.3L243.3,206.2ZM251.6,200.1L251.7,201.9L251.6,202.1L250.9,203.8L248.5,204.5L247.6,206.4L247.2,206.8L246.1,207.7L245.7,207.4L245.6,207.3L245.5,206.7L245.8,205.9L246.1,205.6L246.3,204.8L246.0,204.1L245.5,203.8L246.6,197.7L247.1,196.8L247.9,195.1L248.6,193.5L249.2,192.2L253.0,184.4L254.1,182.3L254.5,181.3L256.3,182.2L256.7,181.7L257.1,182.1L257.1,182.5L256.6,192.5L256.8,193.2L256.2,193.8L255.0,195.0L254.3,194.7L254.0,195.3L254.1,195.6L254.3,195.7L254.2,195.9L253.8,196.3L253.5,196.6L252.4,198.3L252.1,199.1L251.7,199.4Z' },
  { key: 'brooklyn', name: 'Brooklyn', label: 'BK', lx: 254, ly: 213, showLabel: false, d: 'M260.9,205.6L261.1,207.4L262.2,209.7L261.7,210.9L262.7,219.5L254.0,222.4L253.4,222.0L252.9,221.4L252.0,221.5L248.8,221.8L247.8,221.8L247.1,221.5L246.8,221.3L246.7,220.8L247.2,220.1L247.3,220.0L247.8,219.2L247.6,218.5L246.9,217.9L244.7,217.4L244.1,216.3L243.8,214.8L244.2,213.2L244.4,212.7L244.8,212.0L246.2,210.3L245.9,207.8L245.7,207.4L246.1,207.7L247.2,206.8L247.6,206.4L248.5,204.5L250.9,203.8L251.6,202.1L251.7,201.9L251.6,200.1L251.8,200.2L252.4,199.9L253.2,200.1L254.1,201.1L254.9,201.4L255.4,202.4L255.7,203.8L256.6,204.6L257.4,205.6L258.1,207.3L258.8,207.1L260.4,205.8Z' },
  { key: 'queens', name: 'Queens', label: 'QNS', lx: 266, ly: 205, showLabel: false, d: 'M260.9,205.6L260.4,205.8L258.8,207.1L258.1,207.3L257.4,205.6L256.6,204.6L255.7,203.8L255.4,202.4L254.9,201.4L254.1,201.1L253.2,200.1L252.4,199.9L251.8,200.2L251.6,200.1L251.7,199.4L252.1,199.1L252.4,198.3L253.5,196.6L253.8,196.3L254.2,195.9L254.3,195.7L254.1,195.6L254.0,195.3L254.3,194.7L255.0,195.0L256.2,193.8L256.8,193.2L256.6,192.5L257.8,193.0L258.6,193.3L258.7,193.3L258.8,193.7L259.3,193.8L260.7,193.7L261.1,192.8L261.5,192.4L264.6,191.6L266.6,191.4L268.3,192.0L269.0,191.9L269.5,192.7L270.0,192.6L270.7,191.9L272.9,194.6L277.3,198.2L277.4,198.9L277.4,199.4L272.1,219.8L272.2,219.2L270.1,219.2L267.5,219.8L267.0,220.0L264.3,220.9L259.9,223.1L254.4,225.1L254.4,223.8L254.6,223.1L254.3,222.5L254.0,222.4L262.7,219.5L261.7,210.9L262.2,209.7L261.1,207.4Z' },
  { key: 'bronx', name: 'The Bronx', label: 'BX', lx: 262, ly: 185, showLabel: false, d: 'M270.3,184.3L270.5,184.2L271.0,184.6L271.1,185.0L271.0,186.2L270.6,186.2L270.3,185.8L270.2,184.9ZM269.0,191.9L268.3,192.0L266.6,191.4L264.6,191.6L261.5,192.4L261.1,192.8L260.7,193.7L259.3,193.8L258.8,193.7L258.7,193.3L258.6,193.3L257.8,193.0L256.6,192.5L257.1,182.5L257.1,182.1L256.7,181.7L256.3,182.2L254.5,181.3L254.5,181.3L255.1,179.6L255.9,177.3L256.0,176.7L265.3,180.3L265.3,180.3L265.3,180.3L265.4,180.2L265.4,180.2L267.0,180.7L267.2,180.8L269.3,181.5L269.1,181.8L269.1,183.0L268.7,184.4L268.8,185.0L269.1,185.3L269.4,185.9L269.4,186.2L269.4,186.5L269.5,187.0L269.4,187.1L269.2,187.2L269.1,187.1L268.8,186.6L268.5,186.0L268.7,185.3L268.4,184.8L268.3,184.8L267.9,185.2L267.7,185.8L267.0,185.6L266.4,185.9L266.1,187.5L266.1,188.0L266.5,188.7L267.2,189.6L267.9,190.0Z' },
  { key: 'statenisland', name: 'Staten Island', label: 'S.I.', lx: 233, ly: 220, showLabel: false, d: 'M233.7,226.4L233.3,226.5L232.1,227.5L230.4,228.4L230.0,228.3L228.3,229.4L227.2,229.7L226.3,230.6L225.0,230.8L223.7,231.4L223.3,231.4L222.9,230.6L222.8,229.9L223.1,229.1L224.1,228.2L224.2,226.9L223.6,225.3L225.4,223.8L226.6,223.8L227.2,223.1L227.9,219.4L228.6,218.4L228.7,217.8L228.7,215.9L228.2,215.8L228.1,215.5L228.2,213.9L229.3,212.5L230.2,212.1L230.8,212.1L231.2,212.5L232.9,212.9L236.1,212.5L239.4,211.7L240.5,211.7L241.1,212.6L241.3,214.9L242.0,216.4L242.7,217.5L242.1,218.8L241.2,220.0L239.0,222.3L237.0,224.9L236.9,224.8L236.0,225.4L234.4,227.0L234.2,226.6Z' },
  { key: 'longisland', name: 'Long Island', label: 'LONG ISLAND', lx: 360, ly: 190, showLabel: true, d: 'M270.7,191.9L270.8,191.9L272.2,189.3L272.1,188.5L274.7,185.1L274.9,184.6L274.5,183.5L274.6,183.4L276.1,182.9L279.9,184.6L280.4,184.4L281.8,183.7L282.0,181.8L283.3,180.0L284.0,179.2L284.7,179.1L285.6,179.3L287.1,178.6L287.8,178.1L290.3,177.0L290.7,177.0L292.4,177.9L295.3,177.2L295.7,177.3L297.2,176.6L297.5,176.0L297.5,176.0L298.0,173.5L298.6,173.0L298.7,173.0L299.1,173.4L299.3,173.5L299.7,173.7L300.7,174.1L301.0,174.1L301.4,174.2L302.6,174.4L303.3,174.5L303.4,174.5L304.1,175.1L304.1,175.3L304.2,176.2L306.4,176.4L306.7,175.7L306.7,173.5L306.9,172.0L307.0,171.8L307.7,171.8L309.5,174.1L310.4,174.9L311.7,175.5L312.4,175.7L312.5,175.5L313.8,175.2L317.3,175.8L317.3,175.8L323.8,178.3L331.7,175.2L332.0,174.4L332.1,171.7L332.5,170.4L335.5,169.6L338.3,169.5L342.1,170.9L342.4,170.6L346.8,170.3L350.8,170.4L354.9,170.9L357.4,170.8L363.5,169.9L368.6,170.5L370.0,169.2L374.5,167.9L376.9,167.3L379.3,167.6L382.3,167.2L387.2,166.3L389.1,164.7L389.6,164.0L390.7,163.4L393.5,161.1L397.8,159.2L399.4,157.2L401.0,154.7L403.7,154.5L405.7,153.4L409.7,148.5L412.0,148.0L413.1,147.6L416.1,145.6L417.3,145.3L417.9,145.7L418.4,145.9L420.6,144.9L421.3,145.2L421.4,145.6L419.8,148.1L418.7,149.2L415.2,151.3L415.3,148.7L414.6,148.0L414.0,147.9L413.5,148.1L412.6,148.7L411.8,150.3L411.8,152.0L413.6,154.4L415.5,155.4L417.2,155.5L417.6,156.0L416.9,157.1L417.9,159.3L419.1,160.5L421.0,160.1L422.2,160.2L423.4,160.7L424.9,161.8L426.0,161.7L426.7,161.3L427.1,161.0L427.6,160.0L428.8,159.0L429.0,159.0L429.6,159.2L431.3,160.8L431.5,161.9L431.3,162.9L433.3,166.0L434.1,166.8L434.7,167.1L435.4,167.1L436.6,166.4L436.9,165.5L437.0,165.1L437.3,164.8L438.7,164.8L439.1,165.4L439.2,165.3L439.4,165.3L439.7,165.1L439.9,164.7L439.7,163.9L439.7,163.3L440.1,163.0L441.3,163.3L443.3,162.3L444.9,160.8L448.0,159.8L448.6,158.9L448.7,158.2L448.6,157.6L448.8,156.7L450.9,155.9L452.7,155.5L454.7,155.4L455.1,155.9L455.7,156.1L457.6,156.2L458.1,155.9L458.8,156.4L458.9,156.8L457.2,159.2L454.3,160.7L451.1,161.5L441.9,166.0L433.5,169.6L405.8,183.4L398.5,186.5L388.3,190.3L371.4,196.3L370.7,196.8L370.3,196.7L369.2,197.0L359.8,200.7L353.9,203.3L345.1,207.7L341.0,209.4L332.1,212.1L325.9,214.0L322.8,214.7L320.6,215.2L320.3,215.2L316.2,215.3L315.9,215.1L315.0,213.3L311.8,214.0L307.8,215.7L304.7,216.7L302.0,217.5L291.0,220.1L288.9,219.7L286.3,219.6L282.7,220.2L277.4,220.1L272.1,220.0L272.1,219.8L277.4,199.4L277.4,198.9L277.3,198.2L272.9,194.6ZM430.7,153.2L430.9,152.8L431.8,152.4L432.2,151.9L432.3,151.0L436.5,152.7L436.8,153.7L436.2,158.4L435.4,158.9L435.2,158.8L435.2,156.1L434.6,154.7L434.3,154.4L432.9,153.8L431.1,153.9L430.8,153.7ZM441.2,133.3L441.3,132.6L441.9,131.6L442.5,130.6L442.9,130.2L444.1,130.2L445.7,129.2L446.7,129.4L449.4,128.7L450.3,128.5L452.0,128.1L451.2,129.3L450.1,129.9L448.5,130.6L446.9,131.4L445.3,132.5L444.5,132.9Z' },
  { key: 'newjersey', name: 'New Jersey', label: 'NEW JERSEY', lx: 165, ly: 250, showLabel: true, d: 'M94.5,342.8L97.7,339.5L97.7,339.4L99.4,335.7L99.4,335.6L99.9,334.1L102.8,329.9L102.9,329.3L103.4,328.3L103.7,327.4L103.7,327.4L105.4,324.4L106.2,323.5L106.4,323.2L108.6,321.6L108.7,320.8L111.1,318.9L112.7,317.8L119.4,314.7L122.9,314.7L126.4,313.8L128.8,312.6L128.8,312.6L131.3,310.6L134.4,307.5L136.4,305.4L141.1,299.6L142.5,297.9L144.0,296.5L148.1,292.7L152.0,289.1L152.1,289.1L159.4,285.5L165.5,282.4L175.1,278.0L176.7,276.5L176.7,276.5L176.9,275.6L176.9,274.8L173.3,269.5L172.1,267.8L163.3,258.8L155.6,251.5L147.1,243.4L146.0,243.1L143.8,241.5L143.5,240.9L142.6,236.7L143.1,228.4L143.1,227.6L142.9,226.2L142.8,225.5L139.7,222.2L138,221.5L136.2,221.1L135.0,221.5L130.8,219.4L130.8,219.1L130.2,216.9L129.8,215.6L129.5,206.1L130.2,198.3L132.7,194.9L133.4,194.8L134.8,195.3L136.3,195.4L138.9,193.2L144.3,184.2L144.5,183.5L144.4,182.7L138.0,172.1L137.7,171.0L137.7,170.9L137.7,170.1L137.7,170.1L136.6,170.0L136.2,169.4L136.7,167.1L138.8,165.4L140.6,164.4L142.7,163.5L144.4,162.4L145.9,161.5L147.0,160.4L151.4,155.8L152.7,154.5L152.8,153.8L152.8,153.7L152.6,153.4L152.1,152.4L157.1,147.9L161.1,142.4L162.6,138.7L162.9,136.6L162.6,136.1L163.2,134.4L165.4,129.7L166.3,128.4L169.6,124.3L173.0,122.0L179.6,119.2L202.9,133.6L209.4,137.8L212.0,139.4L224.9,147.3L227.0,148.5L238.4,155.0L238.9,155.3L243.9,158.3L243.9,158.3L256.6,165.8L257.5,166.3L258.4,166.3L256.0,176.7L255.9,177.3L255.1,179.6L254.5,181.3L254.5,181.3L254.1,182.3L253.0,184.4L249.2,192.2L248.6,193.5L247.9,195.1L247.1,196.8L246.6,197.7L245.5,203.8L244.2,203.6L242.9,205.6L241.1,207.0L239.8,208.4L239.1,210.2L239.4,211.0L238.7,211.5L233.8,212.6L232.1,212.3L230.1,212.0L229.6,212.0L229.3,212.3L228.1,214.0L227.6,218.7L227.4,221.1L226.8,223.1L226.5,223.5L225.2,223.3L223.5,224.5L223.2,225.5L223.7,228.2L221.6,231.0L221.4,231.6L221.1,232.4L221.6,234.6L222.2,235.5L224.7,236.4L225.8,237.0L225.9,237.0L226.0,237.1L227.3,237.7L227.7,238.6L227.6,238.9L227.4,239.0L227.6,239.3L228.1,238.8L228.9,238.6L229.1,238.3L229.5,237.7L230.8,236.7L230.7,236.8L230.7,237.5L230.6,237.7L230.7,237.8L231.2,237.3L231.5,237.6L231.6,237.8L231.8,237.6L231.9,237.6L232.4,237.8L232.8,237.7L232.9,237.7L233.0,237.7L233.9,237.4L234.2,237.0L234.3,236.8L234.6,236.7L234.8,236.8L235.1,237.0L235.4,237.3L235.7,237.5L235.9,237.6L236.5,237.9L239.3,238.9L240.5,239.5L242.2,240.9L243.2,241.4L247.3,242.4L248.1,242.5L248.4,241.4L248.8,238.3L247.4,235.5L246.2,234.5L246.2,234.3L246.6,234.0L247.3,234.1L248.4,235.0L250.1,238.7L250.2,242.8L250.8,247.5L250.8,250.6L250.2,256.9L249.8,259.4L248.6,264.8L246.4,273.9L245.0,279.6L244.6,282.2L244.8,282.4L244.9,282.5L244.7,282.6L244.1,284.9L242.2,295.2L241.6,298.1L240.4,306.8L239.0,321.1L238.4,325.2L238.4,325.8L238.2,326.2L238.0,326.7L236.8,328.7L234.0,335.2L229.2,343.4L224.3,352.4L223.4,353.3L220.7,357.6L219.3,358.4L217.3,358.6L217.2,359.4L217.1,360.2L217.6,361.5L218.0,361.6L218.2,362.1L218.0,363.1L215.0,368.1L211.8,371.9L207.9,375.0L207.9,375.5L207.8,376.6L207.3,377.1L202.7,379.2L196.6,383.1L194.7,384.9L193.7,385.7L193.5,386.5L192.8,387.6L190.8,388.6L189.1,390.1L187.5,391.9L185.3,394.9L184.3,396.1L183.8,397.8L181.9,400.2L177.7,407.8L177.6,408.1L177.7,408.4L178.6,409.3L178.5,409.9L175.3,413.5L171.3,420.0L170.6,422.9L169.9,424.0L168.4,424.7L167.3,425.6L164.2,428.7L162.9,430.5L162.8,430.4L162.3,430.1L161.1,430.3L158.7,431.6L157.4,431.9L156.1,432L153.1,431.7L152.8,431.4L152.3,430.5L153.9,422.8L154.5,421.0L155.6,418.5L159.0,411.9L159.6,410.4L160.1,408.6L160.8,404.7L160.6,402.8L158.9,400.8L157.9,400.4L153.2,398.8L151.9,398.6L149.7,398.7L147.0,398.4L146.7,398.3L146.8,397.7L147.2,397.3L147.2,397.0L146.9,396.3L146.0,395.6L145.4,395.6L144.8,396.1L144.4,395.9L143.4,395.9L141.0,396.6L139.6,396.1L139.0,396.1L138.3,396.6L137.0,398.9L136.1,400.2L135.8,400.1L133.2,397.4L133.3,395.5L132.8,393.2L132.1,392.2L129.3,389.6L128.6,389.6L125.8,388.2L125.5,387.7L125.6,387.4L125.5,386.7L124.8,384.9L122.8,384.4L121.7,385.0L121.5,385.9L121.1,386.2L119.4,384.7L118.5,383.5L117.4,380.8L117.3,379.9L116.7,379.1L115.9,378.7L114.6,378.8L113.6,379.6L111.2,377.5L110.7,376.8L110.7,375.8L110.2,374.8L109.5,374.5L108.0,373.9L107.0,373.2L106.0,371.9L103.8,367.2L102.7,367.3L102.0,367.0L99.8,365.4L99.5,364.6L96.8,364.4L96.1,363.2L96.0,362.0L96.1,359.8L97.6,359.6L97.7,359.4L98.9,351.4L99.2,350.8L99.1,349.5L97.8,348.7L97.3,348.2L96.9,347.9L96.7,347.5L96.4,347.4L96.4,347.4L96.0,347.2L95.9,347.1L94.8,345.9Z' },
  { key: 'connecticut', name: 'Connecticut', label: 'CONNECTICUT', lx: 380, ly: 80, showLabel: true, d: 'M274.7,152.8L283.4,147.5L284.2,147.1L285.9,146.0L295.7,140.1L296.2,139.8L298.9,138.2L292.1,127.4L292.8,118.1L292.9,116.7L293.5,109.2L293.5,109.0L293.5,108.3L293.6,106.9L293.6,106.7L293.6,106.4L293.6,106.3L293.6,106.2L293.8,103.7L293.8,103.6L293.8,103.6L293.8,103.4L293.8,103.3L293.8,103.2L294.2,97.0L295.1,85.2L295.4,78.6L296.2,66.5L296.7,57.9L296.7,57.8L298.4,28L317.4,28.4L317.5,28.4L323.6,28.6L323.8,28.6L333.8,29.0L341.1,29.3L345.5,29.4L359.8,29.6L359.8,29.6L364.7,29.7L364.4,34.9L368.5,34.3L369.3,34.2L369.4,33.6L370.2,31.8L370.2,31.8L370.4,29.8L374.5,29.7L376.3,29.7L394.7,30.0L405.7,30.2L425.2,30.5L431.4,30.6L431.4,30.6L434.7,30.7L438.9,31.0L464.4,31.5L464.5,33.5L464.8,44.0L464.9,47.2L465.0,55.6L465.0,55.7L465.2,59.9L465.2,60.1L465.5,71.0L465.5,71.0L465.5,82.1L465.5,87.8L465.5,87.8L464.7,111.4L464.7,111.5L462.7,111.1L460.6,112.1L460.3,112.4L460.2,112.9L460.3,114.3L461.2,115.7L461.4,117.5L461.4,120.9L461.3,121.4L460.6,122.2L458.6,123.8L457.8,122.7L456.0,122.0L453.0,122.6L452.5,122.2L452.3,122.2L451.1,121.8L450.1,121.8L449.0,122.9L447.6,123.6L446.8,122.8L446.5,122.9L445.9,124.1L442.6,124.6L436.5,124.2L435.5,124.9L435.0,125.9L433.8,126.9L431.6,126.9L428.9,125.4L427.7,124.5L427.3,123.8L426.7,123.6L426.0,123.7L425.0,124.7L424.8,125.0L424.7,126.9L423.8,127.9L422.6,126.9L421.6,126.7L420.4,126.8L420.0,127.0L420.1,127.5L420.1,128.1L419.1,129.0L413.5,129.7L412.5,129.6L411.9,129.0L411.2,129.4L410.5,129.7L410.5,130.7L406.7,131.8L405.5,129.6L404.8,129.6L400.3,129.5L398.3,130.7L397.0,130.6L395.6,131.2L394.9,132.0L393.7,131.8L393.5,131.3L392.7,131.4L392.3,131.7L392.0,132.5L391.9,132.6L391.0,133.2L390.9,133.3L388.6,131.0L388.6,131.0L388.6,130.9L387.4,130.5L387.2,130.5L387.1,130.5L387.0,130.6L386.9,130.6L386.7,130.7L386.6,130.7L385.9,130.9L385.0,130.7L384.7,130.6L384.0,130.4L384.0,130.4L384.0,130.5L382.6,130.8L381.7,131.1L381.6,131.1L381.5,131.1L380.7,131.2L380.4,131.2L380.4,131.2L380.4,131.2L379.6,130.8L379.6,130.8L379.1,130.9L378.7,131.1L378.6,131.1L378.4,131.3L377.4,132.3L377.3,133.0L377.3,133.2L376.9,133.6L376.9,133.7L376.8,133.8L376.5,133.9L376.4,134.0L376.3,134.0L375.7,134.0L375.3,134.0L375.2,134.0L375.0,134.0L375.0,134.0L375.0,134.0L374.9,134.0L374.8,134.0L374.5,133.4L374.8,133.2L374.7,132.8L373.7,132.1L372.7,132.7L370.5,131.1L370.2,131.1L367.4,131.4L364.2,133.0L364.1,132.8L363.4,132.4L361.4,132.4L361.1,132.6L360.7,133.6L360.0,133.9L358.0,134.3L356.7,134.1L356.1,133.9L355.8,133.7L355.7,133.5L355.9,133.0L355.9,132.9L356.7,132.5L356.7,132.5L356.8,132.0L356.6,131.5L355.9,130.1L355.4,129.1L355.4,129.0L354.6,129.1L354.5,129.1L354.2,129.4L354.2,130.5L354.2,130.6L354.2,130.8L353.1,131.9L352.9,132.0L352.7,132.2L350.6,132.9L350.3,133.0L350.2,133.1L350.1,133.1L348.0,135.2L347.8,135.4L347.7,135.5L346.6,136.9L346.0,137.9L345.6,138.5L345.0,139.1L345.0,139.2L344.9,139.3L344.4,139.3L344.4,139.3L344.4,139.3L344.4,139.3L344.4,139.2L344.4,139.0L344.2,138.9L343.9,138.9L341.9,138.6L341.4,138.5L341.0,138.8L340.5,139.0L338.7,140.5L338.6,140.6L337.4,141.9L337.3,142.0L337.3,142.0L336.1,143.4L336.0,143.5L336.0,143.5L335.7,143.9L335.5,145.1L335.5,145.5L335.7,145.9L335.4,146.3L333.6,146.8L330.2,145.3L329.6,145.0L329.6,144.4L328.9,144.2L326.4,145.3L323.9,147.4L323.2,147.2L322.0,149.5L320.6,150.6L318.1,149.3L317.2,149.6L315.7,150.8L313.8,151.6L309.7,152.4L307.8,154.5L307.0,154.7L305.7,156.4L303.6,158.6L302.0,158.5L300.3,159.3L299.4,161.3L297.8,159.7L295.5,160.9L295.5,162.1L294.9,163.5L294.3,163.8L294.1,163.1L294.2,162.2L293.9,161.9L293.7,161.8L292.1,162.8L291.1,163.8L290.5,164.6L290.3,165.8L288.9,165.9L288.8,164.6L287.7,163.9L286.9,164.0L283.0,165.7L282.3,166.6L281.7,167.9L281.9,164.5L281.9,164.3L280.4,162.1L279.5,160.5L278.7,159.4L278.0,158.2Z' },
]

const areas = regions.map((r) => ({ key: r.key, name: r.name }))

const steps = [
  { s: '/01', h: 'Design & Survey', p: 'Concept, renderings and an on-site survey to confirm fit, power and NYC code.' },
  { s: '/02', h: 'Permits', p: 'As a licensed hanger we prepare drawings and pull all required DOB sign permits.' },
  { s: '/03', h: 'Fabrication', p: 'Built under one roof in our College Point factory — quality-checked before it ships.' },
  { s: '/04', h: 'Install & Maintain', p: 'Our crews set, wire and inspect — then keep your sign lit with ongoing service.' },
]

export default function App() {
  const [slide, setSlide] = useState(0)
  const [activeArea, setActiveArea] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)
  const go = useCallback((n) => setSlide((s) => (n + heroSlides.length) % heroSlides.length), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const onField = useCallback((e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }, [])

  const onQuoteSubmit = useCallback((e) => {
    e.preventDefault()
    const subject = `Quote request — ${form.name || 'Storefront sign'}`
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      '',
      'Project details:',
      form.message,
    ].join('\n')
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }, [form])

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 5500)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      <header>
        <div className="wrap nav">
          <a className="nav-logo" href="#" onClick={closeMenu}><img src={`${BASE}assets/logo-black.png`} alt="SPACE SIGN" /></a>
          <nav className="nav-links">
            <a href="#work">Work</a>
            <a href="#services">Services</a>
            <a href="#clients">Clients</a>
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
          <a href="#work" onClick={closeMenu}>Work</a>
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#clients" onClick={closeMenu}>Clients</a>
          <a href="#areas" onClick={closeMenu}>Service Areas</a>
          <a href="#process" onClick={closeMenu}>Process</a>
          <a className="nav-phone" href={PHONE_TEL} onClick={closeMenu}>{PHONE}</a>
          <a className="btn" href="#quote" onClick={closeMenu}>Get a free quote</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          {heroSlides.map((sl, i) => (
            <div
              key={sl.img}
              className={`hero-slide img${i === slide ? ' active' : ''}`}
              style={{ backgroundImage: `url(${BASE}assets/work/${sl.img})` }}
              role="img"
              aria-label={sl.label}
              aria-hidden={i === slide ? undefined : true}
            />
          ))}
        </div>

        <button className="hero-arrow prev" aria-label="Previous slide" onClick={() => go(slide - 1)}>‹</button>
        <button className="hero-arrow next" aria-label="Next slide" onClick={() => go(slide + 1)}>›</button>

        <div className="hero-content">
          <div className="wrap hero-grid">
            <div className="hero-main">
              <div className="hero-kicker mono">NYC Licensed Sign Hanger #215 · Est. 1987</div>
              <h1>We make brands<br /><em>impossible</em> to miss.</h1>
              <div className="hero-row">
                <p>Space Sign is a full-concierge sign company in Queens, NY — sales, design, fabrication and installation under one roof, serving storefronts across the Tri-State area since 1987.</p>
              </div>
              <div className="hero-dots" role="tablist" aria-label="Hero slides">
                {heroSlides.map((sl, i) => (
                  <button
                    key={sl.img}
                    className={`hero-dot${i === slide ? ' active' : ''}`}
                    aria-label={`Show slide ${i + 1}`}
                    aria-selected={i === slide}
                    role="tab"
                    onClick={() => go(i)}
                  />
                ))}
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
                <textarea name="message" value={form.message} onChange={onField} placeholder="Tell us about your project*" rows={4} required />
              </div>
              <button className="btn qc-submit" type="submit">
                {sent ? 'Thank you — opening your email…' : 'Request my free quote'}
              </button>
              <p className="qc-fine mono">Free quotes across the Tri-State · usually within one business day</p>
            </form>
          </div>
        </div>
      </section>

      {/* LICENSE BANNER */}
      <section className="license">
        <div className="wrap">
          <p className="license-line">
            Space Sign is a <span className="nyc">NYC</span> Licensed Sign Hanger <span className="lic">(#215)</span>
          </p>
          <p className="license-sub">We also help with violation removals for DOB &amp; ECB sign violations.</p>
        </div>
      </section>

      {/* TRUST */}
      <div className="trust dark">
        <div><div className="n"><em>37</em>+</div><div className="l">Years in business · since 1987</div></div>
        <div><div className="n">#215</div><div className="l">NYC Licensed Sign Hanger</div></div>
        <div><div className="n">4.9<em>★</em></div><div className="l">Average customer rating</div></div>
        <div><div className="n">NY·NJ·CT</div><div className="l">Tri-State service area</div></div>
      </div>

      {/* SERVICES */}
      <section className="sec" id="services">
        <div className="wrap">
          <div className="sec-head">
            <div><div className="k mono">01 / Services</div><h2>What we build</h2></div>
            <p>One roof for the whole job — the design you approve is the sign we fabricate, permit and install.</p>
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

      {/* WORK */}
      <section className="sec dark" id="work">
        <div className="wrap">
          <div className="sec-head">
            <div><div className="k mono">02 / Selected Work</div><h2>From the shop floor</h2></div>
            <p>A cross-section of recent storefront, illuminated and interior programs across NYC.</p>
          </div>
          <div className="work">
            {work.map((w) => (
              <div className={`cell ${w.cls}`} key={w.img}>
                <div className="img" style={{ backgroundImage: `url(${BASE}assets/work/${w.img})` }} />
                <div className="cap"><b>{w.name}</b><span className="mono">{w.type}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENTS */}
      <section className="sec" id="clients">
        <div className="wrap">
          <div className="sec-head">
            <div><div className="k mono">03 / Our Clients</div><h2>Brands we've lit up</h2></div>
            <p>From national chains to neighborhood storefronts across the Tri-State — a few of the businesses we've built signage for.</p>
          </div>
          <div className="clients">
            {clients.map((c) => (
              <div className="client" key={c.file}>
                <img src={`${BASE}assets/clients/${c.file}.png`} alt={c.name} loading="lazy" />
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
            <p>Based in College Point, Queens, with field crews serving the five boroughs and the wider Tri-State region — from East Long Island to New Jersey.</p>
          </div>
          <div className="areas">
            <div className="area-map">
              <svg viewBox="0 0 560 460" role="img" aria-label="Space Sign Tri-State service area map">
                <text className="map-water" x="415" y="140" textAnchor="middle">L.I. SOUND</text>
                <text className="map-water" x="345" y="300" textAnchor="middle">ATLANTIC OCEAN</text>
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
                {regions.filter((r) => r.showLabel).map((r) => (
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
                {/* College Point HQ marker */}
                <line className="shop-lead" x1="263.6" y1="194.3" x2="300" y2="252" />
                <circle className="shop-ring" cx="263.6" cy="194.3" r="5">
                  <animate attributeName="r" values="5;20" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.85;0" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle className="shop-dot" cx="263.6" cy="194.3" r="5" />
                <text className="shop-label" x="306" y="250">OUR SHOP</text>
                <text className="shop-sub" x="306" y="262">College Point, Queens</text>
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
            <div><div className="k mono">05 / Process</div><h2>Four steps, one team</h2></div>
            <p>Full-concierge service — we handle sales, design, permitting, manufacture and installation in-house.</p>
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
      <section className="cta" id="quote">
        <div className="cta-in">
          <h2>Ready to <em>light up</em><br />your storefront?</h2>
          <p>Tell us the basics and we'll come back with a budget range and timeline. Free quotes across the Tri-State area — usually within one business day.</p>
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
              <img src={`${BASE}assets/logo-white.png`} alt="SPACE SIGN" />
              <p className="mono" style={{ marginTop: 16, color: 'var(--mute)' }}>Design · Build · Install · Permit</p>
            </div>
            <div className="foot-cols">
              <div className="foot-col"><h5 className="mono">Studio</h5><a href="#work">Work</a><a href="#services">Services</a><a href="#process">Process</a><a href="#areas">Service Areas</a></div>
              <div className="foot-col"><h5 className="mono">Services</h5><a href="#services">Channel Letters</a><a href="#services">LED Neon &amp; Lightbox</a><a href="#services">Awnings &amp; Vestibules</a><a href="#services">Permits &amp; Violations</a></div>
              <div className="foot-col">
                <h5 className="mono">Contact</h5>
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                <a href={PHONE_TEL}>{PHONE}</a>
                <a href="https://maps.google.com/?q=15-25+132nd+Street+College+Point+NY+11356" target="_blank" rel="noreferrer">15-25 132nd St, College Point, NY 11356</a>
              </div>
            </div>
          </div>
          <div className="foot-bottom"><span>© 2026 Space Sign. NYC Licensed Sign Hanger #215 · Fax (718) 961-5577.</span><span>Design · Build · Install</span></div>
        </div>
      </footer>
    </>
  )
}

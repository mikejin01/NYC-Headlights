import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useWPEdit } from './WPEditProvider'

const isInternal = (href) => href.startsWith('/') && !href.startsWith('//')

// WordPress permalinks end in "/"; linking to the canonical form avoids a 301
// on every crawled link. "/faq" -> "/faq/", "/services#trade" -> "/services/#trade".
export const withSlash = (href) => href.replace(/^([^?#]*?[^/?#.])(?=[?#]|$)/, '$1/')

// Plain link that uses the router for internal paths ("/faq", "/#trade").
export function SmartLink({ href, children, ...rest }) {
  if (isInternal(href)) return <Link to={withSlash(href)} {...rest}>{children}</Link>
  const external = /^https?:/.test(href)
  return <a href={href} {...rest} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>{children}</a>
}

// <LinkEdit urlKey="home_cta_primary_url" defaultHref="/contact">label</LinkEdit>
// In edit mode a click opens a URL popover instead of navigating (playbook §4.2).
export function LinkEdit({ urlKey, defaultHref, className, children, ...rest }) {
  const { isEditing, getText, getRaw, updateDraft } = useWPEdit()
  const href = getText(urlKey, defaultHref)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  if (!isEditing) return <SmartLink href={href} className={className} {...rest}>{children}</SmartLink>

  return (
    <span className="xo-link-edit">
      <a
        href={href}
        className={className}
        {...rest}
        onClick={(e) => { e.preventDefault(); setValue(getRaw(urlKey, defaultHref)); setOpen(true) }}
      >
        {children}
      </a>
      {open && (
        <span className="xo-link-pop" onClick={(e) => e.stopPropagation()}>
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { updateDraft(urlKey, value.trim()); setOpen(false) } }}
            placeholder="https://… | /page | tel:… | mailto:…"
          />
          <button type="button" onClick={() => { updateDraft(urlKey, value.trim()); setOpen(false) }}>✓</button>
          <button type="button" onClick={() => setOpen(false)}>✕</button>
        </span>
      )}
    </span>
  )
}

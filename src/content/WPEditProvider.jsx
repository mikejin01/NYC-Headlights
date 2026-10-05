import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import liveData from '../data/liveData.json'

// Content layer (playbook §1.2.4 / §4.1). Every user-visible string and image is
// read through getText(key, default). Resolution order, highest wins:
//   1. draft[key]                    unsaved edits in this session
//   2. routeOverrides[route][key]    page_* keys, saved per route
//   3. routeOverrides['*'][key]      every other key, saved site-wide
//   4. pageData[key]                 global_* keys (X.O. Admin options)
//   5. liveData.json[key]            local mirror of live edits (make pull-content)
//   6. the default passed in code
//
// Key conventions (the server's save handler sanitizes by suffix/prefix):
//   global_*  -> X.O. Admin option          page_*  -> scoped to the current route
//   *_html    -> limited inline HTML        *_url / *_img -> sanitized as a URL

const Ctx = createContext(null)

const wp = () => (typeof window !== 'undefined' ? window.wpRest : undefined)

// The theme's index.php marks the mount node; anything else (vite dev, the
// static /staging/ build, GitHub Pages) is a plain SPA with no WordPress behind it.
const onWordPress = () => !!(wp() || document.getElementById('root')?.dataset.wp)

const looksLoggedIn = () =>
  !!(wp()?.isLoggedIn ||
    document.body.classList.contains('logged-in') ||
    document.body.classList.contains('admin-bar') ||
    document.getElementById('wpadminbar'))

export const routeKey = (pathname) => pathname.replace(/\/+$/, '') || '/'

const DEFAULT_BUSINESS = {
  global_business_name: 'NYC Headlights',
  global_contact_phone: '(929) 409-9330',
  global_contact_email: 'jerry@nycheadlights.com',
  global_contact_hours: 'Mon–Sat 9AM–7PM · Sun by appointment',
  global_city_state: 'New York, NY',
}

export function WPEditProvider({ children }) {
  const { pathname } = useLocation()
  const route = routeKey(pathname)

  const [boot, setBoot] = useState(() => wp() || null)
  const [overrides, setOverrides] = useState(() => wp()?.routeOverrides || {})
  const [loggedIn, setLoggedIn] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState({})
  const [status, setStatus] = useState(null) // { kind: 'ok'|'error'|'saving', text }

  // Optimization plugins sometimes strip the inline wpRest payload; fall back to
  // the public bootstrap endpoint, and to core's rest-nonce ajax for the nonce.
  useEffect(() => {
    setLoggedIn(looksLoggedIn())
    if (wp() || !onWordPress()) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/wp-json/xo/v1/bootstrap?path=${encodeURIComponent(route)}`, { credentials: 'same-origin' })
        if (!res.ok) return
        const data = await res.json()
        if (looksLoggedIn()) {
          const n = await fetch('/wp-admin/admin-ajax.php?action=rest-nonce', { credentials: 'same-origin' })
          if (n.ok) data.nonce = (await n.text()).trim()
          data.isLoggedIn = true
        }
        if (cancelled) return
        window.wpRest = data
        setBoot(data)
        setOverrides(data.routeOverrides || {})
        setLoggedIn(looksLoggedIn())
      } catch { /* static fallback: defaults stay in place */ }
    })()
    return () => { cancelled = true }
    // Only on first mount — later navigation is client-side.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pageData = boot?.pageData || {}

  const getRaw = useCallback((key, fallback) => {
    if (key in draft) return draft[key]
    const scoped = key.startsWith('page_') ? overrides[route]?.[key] : overrides['*']?.[key]
    return scoped ?? pageData[key] ?? liveData[key] ?? fallback
  }, [draft, overrides, route, pageData])

  const business = useMemo(() => {
    const pick = (k) => pageData[k] || liveData[k] || DEFAULT_BUSINESS[k]
    const phone = pick('global_contact_phone')
    const digits = phone.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '')
    return {
      name: pick('global_business_name'),
      phone,
      phoneDot: digits.length === 10 ? `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}` : phone,
      phoneTel: `tel:+1${digits}`,
      email: pick('global_contact_email'),
      hours: pick('global_contact_hours'),
      cityState: pick('global_city_state'),
    }
  }, [pageData])

  // Placeholders resolve client-side so edit mode can show the raw {{TOKEN}}.
  const resolve = useCallback((text) => {
    if (typeof text !== 'string' || !text.includes('{{')) return text
    return text
      .replaceAll('{{PHONE}}', business.phone)
      .replaceAll('{{EMAIL}}', business.email)
      .replaceAll('{{BUSINESS_NAME}}', business.name)
      .replaceAll('{{CITY_STATE}}', business.cityState)
  }, [business])

  const getText = useCallback((key, fallback) => resolve(getRaw(key, fallback)), [getRaw, resolve])

  const updateDraft = useCallback((key, value) => {
    setDraft((d) => ({ ...d, [key]: value }))
  }, [])

  const cancelChanges = useCallback(() => {
    setDraft({})
    setIsEditing(false)
    setStatus(null)
  }, [])

  const saveChanges = useCallback(async () => {
    if (!Object.keys(draft).length) { setIsEditing(false); return }
    const w = wp()
    if (!w?.root || !w?.nonce) {
      setStatus({ kind: 'error', text: 'Not connected to WordPress — reload the page and try again.' })
      return
    }
    setStatus({ kind: 'saving', text: 'Saving…' })
    try {
      const res = await fetch(`${w.root}xo/v1/save-page-data`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': w.nonce },
        body: JSON.stringify({ postId: w.postId || 0, route, pageData: draft }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.success) throw new Error(json.message || `HTTP ${res.status}`)
      if (json.routeOverrides) setOverrides(json.routeOverrides)
      if (json.pageData) setBoot((b) => ({ ...(b || {}), pageData: { ...(b?.pageData || {}), ...json.pageData } }))
      setDraft({})
      setIsEditing(false)
      setStatus(json.cache?.ok === false
        ? { kind: 'error', text: `Saved, but cache purge failed: ${json.cache.error}. Visitors may see the old copy briefly.` }
        : { kind: 'ok', text: 'Saved.' })
    } catch (e) {
      setStatus({ kind: 'error', text: `Save failed: ${e.message}` })
    }
  }, [draft, route])

  const value = useMemo(() => ({
    onWordPress: onWordPress(), isLoggedIn: loggedIn, isEditing, setIsEditing,
    draft, getRaw, getText, resolve, updateDraft, saveChanges, cancelChanges,
    status, setStatus, business, wpRest: boot,
  }), [loggedIn, isEditing, draft, getRaw, getText, resolve, updateDraft, saveChanges, cancelChanges, status, business, boot])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useWPEdit() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useWPEdit must be used inside <WPEditProvider>')
  return ctx
}

export const useBusiness = () => useWPEdit().business

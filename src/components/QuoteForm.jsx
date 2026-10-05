import { useCallback, useState } from 'react'
import { T } from '../content/InlineEdit'
import { useBusiness, useWPEdit } from '../content/WPEditProvider'

const EMPTY = { name: '', email: '', phone: '', message: '', company: '' }

// Free-quote form. On WordPress it posts to the Leads endpoint (playbook Part 3),
// which saves a lead_submission and emails the X.O. Admin address. Off WordPress
// (vite dev, static staging) there is no backend, so it falls back to mailto.
export function QuoteForm() {
  const { onWordPress, wpRest, isEditing } = useWPEdit()
  const { phoneTel, phoneDot, email } = useBusiness()
  const [form, setForm] = useState(EMPTY)
  const [state, setState] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')

  const onField = useCallback((e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }, [])

  const onSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (isEditing) return
    if (!onWordPress) {
      const subject = `Quote request — ${form.name || 'Headlight service'}`
      const body = [`Name: ${form.name}`, `Email: ${form.email}`, `Phone: ${form.phone}`, '', 'Vehicle & details:', form.message].join('\n')
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      setState('sent')
      return
    }
    setState('sending')
    setError('')
    try {
      const res = await fetch(`${wpRest?.root || '/wp-json/'}xo/v1/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, page: window.location.pathname }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.success) throw new Error(json.message || 'Something went wrong.')
      setForm(EMPTY)
      setState('sent')
    } catch (err) {
      setError(err.message)
      setState('error')
    }
  }, [form, email, onWordPress, wpRest, isEditing])

  return (
    <form className="quote-card" onSubmit={onSubmit}>
      <div className="qc-top">
        <T k="site_quote_kicker" className="qc-kicker mono">Call us today</T>
        <a className="qc-phone" href={phoneTel}>{phoneDot}</a>
      </div>
      <div className="qc-div" />
      <T k="site_quote_title" as="h2" className="qc-h">Get a free quote</T>
      {state === 'sent' ? (
        <p className="qc-sent" role="status">
          <T k="site_quote_thanks" multiline>Thanks — your request is in. We'll get back to you with a price and timeline, usually the same day.</T>
        </p>
      ) : (
        <>
          <div className="qc-fields">
            <input name="name" value={form.name} onChange={onField} placeholder="Name*" autoComplete="name" required />
            <input name="email" type="email" value={form.email} onChange={onField} placeholder="E-mail address*" autoComplete="email" required />
            <input name="phone" type="tel" value={form.phone} onChange={onField} placeholder="Contact number*" autoComplete="tel" required />
            <textarea name="message" value={form.message} onChange={onField} placeholder="Year, make, model & the issue*" rows={4} required />
            {/* Honeypot: only bots fill this. */}
            <input name="company" value={form.company} onChange={onField} tabIndex={-1} autoComplete="off" aria-hidden="true" className="qc-hp" />
          </div>
          <button className="btn qc-submit" type="submit" disabled={state === 'sending'}>
            {state === 'sending' ? 'Sending…' : <T k="site_quote_button">Request my free quote</T>}
          </button>
          {state === 'error' && <p className="qc-error" role="alert">{error} Please call {phoneDot} instead.</p>}
        </>
      )}
      <T k="site_quote_fine" as="p" className="qc-fine mono">Free quotes across all five boroughs · usually the same day</T>
    </form>
  )
}

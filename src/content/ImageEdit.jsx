import { useState } from 'react'
import { useWPEdit } from './WPEditProvider'

// Opens the WordPress Media Library (needs wp_enqueue_media() for editors on the
// front end); falls back to a URL field when window.wp.media is unavailable.
function usePicker(k, onPicked) {
  const { updateDraft } = useWPEdit()
  const [manual, setManual] = useState(false)
  const open = (e) => {
    e?.preventDefault(); e?.stopPropagation()
    const media = window.wp?.media
    if (!media) { setManual(true); return }
    const frame = media({ title: 'Replace image', button: { text: 'Use this image' }, multiple: false, library: { type: 'image' } })
    frame.on('select', () => {
      const att = frame.state().get('selection').first().toJSON()
      // Root-relative so the value survives domain/protocol changes.
      const url = att.url.replace(/^https?:\/\/[^/]+/, '')
      updateDraft(k, url)
      onPicked?.(att)
    })
    frame.open()
  }
  return { open, manual, setManual }
}

function ManualUrl({ k, current, onDone }) {
  const { updateDraft } = useWPEdit()
  const [v, setV] = useState(current)
  return (
    <span className="xo-img-manual" onClick={(e) => e.stopPropagation()}>
      <input value={v} onChange={(e) => setV(e.target.value)} placeholder="/wp-content/uploads/…" />
      <button type="button" onClick={() => { updateDraft(k, v.trim()); onDone() }}>Apply</button>
      <button type="button" onClick={onDone}>✕</button>
    </span>
  )
}

// <Img k="brand_bmw_img" src={default} alt="…" /> — an <img> whose wrapper takes
// the image's own layout slot as a positioned box (playbook §4.1a), so the
// overlay always sits on the image, never on some distant ancestor.
export function Img({ k, src, alt = '', className, ...rest }) {
  const { isEditing, getText, getRaw, updateDraft } = useWPEdit()
  const altKey = `${k}_alt`
  const resolvedSrc = getText(k, src)
  const resolvedAlt = getText(altKey, alt)
  const { open, manual, setManual } = usePicker(k)

  if (!isEditing) return <img src={resolvedSrc} alt={resolvedAlt} className={className} {...rest} />

  return (
    <span className={`xo-img-wrap${manual ? ' xo-img-wrap--open' : ''}`}>
      <img src={resolvedSrc} alt={resolvedAlt} className={className} {...rest} />
      <span className="xo-img-overlay">
        <button type="button" onClick={open}>Replace image</button>
        <input
          defaultValue={getRaw(altKey, alt)}
          placeholder="Alt text (describe the image)"
          onClick={(e) => e.stopPropagation()}
          onBlur={(e) => updateDraft(altKey, e.target.value.trim())}
        />
        {manual && <ManualUrl k={k} current={getRaw(k, src)} onDone={() => setManual(false)} />}
      </span>
    </span>
  )
}

// Background-image element (product photos). The element itself is the box the
// overlay covers; edit mode only adds position:relative to it, which does not
// move a static, in-flow block.
export function BgImg({ k, src, as: Tag = 'div', className = '', style, children, ...rest }) {
  const { isEditing, getText, getRaw } = useWPEdit()
  const url = getText(k, src)
  const { open, manual, setManual } = usePicker(k)
  const bg = { ...style, backgroundImage: `url(${url})` }
  if (!isEditing) return <Tag className={className} style={bg} {...rest}>{children}</Tag>
  return (
    <Tag className={`${className} xo-img-wrap${manual ? ' xo-img-wrap--open' : ''}`} style={bg} {...rest}>
      {children}
      <span className="xo-img-overlay">
        <button type="button" onClick={open}>Replace image</button>
        {manual && <ManualUrl k={k} current={getRaw(k, src)} onDone={() => setManual(false)} />}
      </span>
    </Tag>
  )
}

// Section backgrounds (hero, CTA) sit underneath their content, so a full-cover
// overlay would block editing the text on top. Instead: a chip in its own
// positioned anchor, placed explicitly as a direct child of the section.
export function useImageValue(k, src) {
  return useWPEdit().getText(k, src)
}

export function BgChip({ k, src, label = 'Replace background' }) {
  const { isEditing, getRaw } = useWPEdit()
  const { open, manual, setManual } = usePicker(k)
  if (!isEditing) return null
  return (
    <span className="xo-chip-anchor">
      <button type="button" className="xo-chip" onClick={open}>{label}</button>
      {manual && <ManualUrl k={k} current={getRaw(k, src)} onDone={() => setManual(false)} />}
    </span>
  )
}

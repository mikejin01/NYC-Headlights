import { useLayoutEffect, useRef } from 'react'
import { useWPEdit } from './WPEditProvider'

// <T k="home_hero_kicker">Default text</T>
// Renders getText(k, children). In edit mode it becomes contentEditable and
// writes to the draft on blur. Keys ending in _html keep inline markup
// (<br>, <em>, <strong>); everything else is plain text.
export function T({ k, children, as: Tag = 'span', multiline = false, className, ...rest }) {
  const { isEditing, getText, getRaw, updateDraft } = useWPEdit()
  const ref = useRef(null)
  const html = k.endsWith('_html')
  const fallback = typeof children === 'string' ? children : String(children ?? '')

  // Uncontrolled while editing: seed the DOM once per edit session so React
  // re-renders never fight the caret.
  useLayoutEffect(() => {
    if (!isEditing || !ref.current) return
    const raw = getRaw(k, fallback)
    if (html) ref.current.innerHTML = raw
    else ref.current.innerText = raw
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, k])

  if (!isEditing) {
    const value = getText(k, fallback)
    return html
      ? <Tag className={className} {...rest} dangerouslySetInnerHTML={{ __html: value }} />
      : <Tag className={className} {...rest}>{value}</Tag>
  }

  return (
    <Tag
      {...rest}
      ref={ref}
      className={`${className ? className + ' ' : ''}xo-editable`}
      contentEditable
      suppressContentEditableWarning
      spellCheck
      data-xo-key={k}
      onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !multiline && !e.shiftKey) { e.preventDefault(); e.currentTarget.blur() }
      }}
      onBlur={(e) => {
        const el = e.currentTarget
        const value = html ? el.innerHTML.trim() : el.innerText.trim()
        // Focusing without typing must not create an override.
        // (_html is compared after a DOM round-trip: the browser rewrites "<br />" etc.)
        let before = String(getRaw(k, fallback)).trim()
        if (html) { const t = document.createElement('div'); t.innerHTML = before; before = t.innerHTML.trim() }
        if (value !== before) updateDraft(k, value)
      }}
    />
  )
}

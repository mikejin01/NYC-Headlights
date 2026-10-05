import { useWPEdit } from './WPEditProvider'

export function EditToolbar() {
  const { onWordPress, isLoggedIn, isEditing, setIsEditing, draft, saveChanges, cancelChanges, status, setStatus } = useWPEdit()
  if (!onWordPress || !isLoggedIn) return null
  const n = Object.keys(draft).length

  return (
    <div className="xo-toolbar" role="region" aria-label="Page editing">
      {status && (
        <span className={`xo-toolbar-status xo-toolbar-status--${status.kind}`} onClick={() => setStatus(null)}>
          {status.text}
        </span>
      )}
      {!isEditing ? (
        <button type="button" className="xo-tb-btn" onClick={() => { setStatus(null); setIsEditing(true) }}>Edit page</button>
      ) : (
        <>
          <span className="xo-toolbar-count">{n ? `${n} unsaved change${n > 1 ? 's' : ''}` : 'Editing'}</span>
          <button type="button" className="xo-tb-btn xo-tb-btn--primary" onClick={saveChanges} disabled={status?.kind === 'saving'}>Save</button>
          <button type="button" className="xo-tb-btn" onClick={cancelChanges}>Cancel</button>
        </>
      )}
    </div>
  )
}

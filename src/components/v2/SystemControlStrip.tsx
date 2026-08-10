// "How the system is engineered" — a plain grid+rules strip (no card
// chrome), sitting directly under the main-page workflow it describes.
// System 01 V4 correction, 2026-08-09. Generic on project.
// systemControlStrip/builtWithLabel; renders nothing for any project
// without them (i.e. every project except System 01 today).
export function SystemControlStrip({
  items,
  builtWith,
}: {
  items?: { eyebrow: string; title: string; detail?: string }[]
  builtWith?: string
}) {
  if ((!items || items.length === 0) && !builtWith) return null

  return (
    <div className="v2-systemControlStrip">
      {items && items.length > 0 && (
        <>
          <span className="v2-chapter-workflowLabel">SYSTEM CONTROL</span>
          <ul className="v2-systemControlStrip-grid">
            {items.map((item) => (
              <li key={item.eyebrow} className="v2-systemControlStrip-item">
                <span className="v2-systemControlStrip-eyebrow">{item.eyebrow}</span>
                <strong className="v2-systemControlStrip-title">{item.title}</strong>
                {item.detail && <span className="v2-systemControlStrip-detail">{item.detail}</span>}
              </li>
            ))}
          </ul>
        </>
      )}
      {builtWith && (
        <p className="v2-systemControlStrip-implementation">
          <span className="v2-chapter-metaLine-label">Implementation</span>
          {builtWith}
        </p>
      )}
    </div>
  )
}

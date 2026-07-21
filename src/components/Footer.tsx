import type { PageContent } from '../data/types'

export function Footer({ footer }: { footer: PageContent['footer'] }) {
  return (
    <div className="wrap">
      <footer>
        <span className="mono">{footer.left}</span>
        <span className="mono">{footer.right}</span>
      </footer>
    </div>
  )
}

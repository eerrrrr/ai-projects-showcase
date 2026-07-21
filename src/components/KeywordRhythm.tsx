import { Fragment } from 'react'

// Swiss-style keyword row for the hero — replaces the old vertical
// "Core thinking" bullet list. Same ideas, denser, no bullets.
export function KeywordRhythm({ words }: { words: string[] }) {
  return (
    <div className="keyword-rhythm mono">
      {words.map((word, i) => (
        <Fragment key={word}>
          <span className="keyword">{word}</span>
          {i < words.length - 1 && <span className="keyword-sep">/</span>}
        </Fragment>
      ))}
    </div>
  )
}

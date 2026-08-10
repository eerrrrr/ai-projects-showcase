// "Decision model" — the four-layer control sequence (data integrity ->
// job fit -> human decision -> authorization), each with its own real
// state vocabulary. Generic on project.systemLogicConcepts.
export function SystemLogicConcepts({ concepts }: { concepts?: { eyebrow: string; question: string; states: string }[] }) {
  if (!concepts || concepts.length === 0) return null
  return (
    <ol className="v2-systemLogicConcepts">
      {concepts.map((concept) => (
        <li key={concept.eyebrow} className="v2-systemLogicConcept">
          <span className="v2-systemLogicConcept-eyebrow">{concept.eyebrow}</span>
          <span className="v2-systemLogicConcept-question">{concept.question}</span>
          <span className="v2-systemLogicConcept-states">{concept.states}</span>
        </li>
      ))}
    </ol>
  )
}

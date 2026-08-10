// "Implementation" section — concrete building-block list (n8n, Code
// nodes, Wait form, etc), generic on project.implementationDetails.
export function ImplementationList({ items }: { items?: { title: string; body: string }[] }) {
  if (!items || items.length === 0) return null
  return (
    <ul className="v2-implementationList">
      {items.map((item) => (
        <li key={item.title} className="v2-implementationList-item">
          <strong className="v2-implementationList-title">{item.title}</strong>
          <span className="v2-implementationList-body">{item.body}</span>
        </li>
      ))}
    </ul>
  )
}

// Simple textual flow diagrams (main / test / failure paths) for the
// detail page's "How the system is controlled" section — arrows between
// short labels, not another instance of the interactive WorkflowDiagram
// component (the detail page deliberately doesn't repeat the main
// page's diagram). Generic on project.architectureFlow; renders nothing
// if a project has none.
export function ArchitectureFlow({ flow }: { flow?: { main: string[]; test: string[]; failure: string[] } }) {
  if (!flow) return null
  return (
    <div className="v2-architectureFlow">
      <ol className="v2-architectureFlow-chain v2-architectureFlow-chain--main">
        {flow.main.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <div className="v2-architectureFlow-branches">
        <div className="v2-architectureFlow-branch">
          <span className="v2-architectureFlow-branchLabel">TEST PATH</span>
          <ol className="v2-architectureFlow-chain">
            {flow.test.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
        <div className="v2-architectureFlow-branch">
          <span className="v2-architectureFlow-branchLabel">FAILURE PATH</span>
          <ol className="v2-architectureFlow-chain">
            {flow.failure.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}

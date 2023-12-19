

export function BugPreview({bug}) {

    return <article>
        <h4>{bug.title}</h4>
        <h1>🐛</h1>
        <p>Description</p> <span>{bug.description}</span>
        <p>Severity: <span>{bug.severity}</span></p>
    </article>
}
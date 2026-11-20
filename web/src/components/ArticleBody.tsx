import type { Block } from "@/data/library";

export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="article">
      {blocks.map((b, i) => {
        switch (b.t) {
          case "p":
            return <p key={i}>{b.text}</p>;
          case "h":
            return <h2 key={i}>{b.text}</h2>;
          case "list":
            return (
              <ul key={i}>
                {b.items.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            );
          case "steps":
            return (
              <ol key={i} className="steps">
                {b.items.map((x) => (
                  <li key={x.title}>
                    <strong>{x.title}.</strong> {x.text}
                  </li>
                ))}
              </ol>
            );
          case "table":
            return (
              <div key={i} className="table-scroll">
                <table className="data">
                  <thead>
                    <tr>{b.head.map((h) => <th key={h}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, ri) => (
                      <tr key={ri}>{r.map((c, ci) => (ci === 0 ? <td key={ci}><strong>{c}</strong></td> : <td key={ci}>{c}</td>))}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "callout":
            return (
              <div key={i} className={`callout ${b.tone === "red" ? "red" : ""}`}>
                <p>
                  {b.title && <strong>{b.title} </strong>}
                  {b.text}
                </p>
              </div>
            );
          case "credit":
            return (
              <aside key={i} className="credit">
                <p className="label blue">Credit</p>
                <p>{b.text}</p>
                <a href="https://optimizemenutrition.com" target="_blank" rel="noopener">Learn more from EC at OptimizeMe Nutrition</a>
              </aside>
            );
          case "cards":
            return (
              <div key={i} className={`grid ${b.items.length === 3 ? "three" : "two"}`}>
                {b.items.map((c) => (
                  <div key={c.title} className="card">
                    <p className="label blue">{c.title}</p>
                    <p className="small" style={{ marginBottom: 0 }}>{c.text}</p>
                  </div>
                ))}
              </div>
            );
        }
      })}
    </div>
  );
}

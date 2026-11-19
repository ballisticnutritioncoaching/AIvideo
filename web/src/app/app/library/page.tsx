import Link from "next/link";
import { LIBRARY } from "@/data/library";

const GROUPS = ["Start here", "Training", "Nutrition"] as const;

export default function LibraryPage() {
  return (
    <div className="wrap narrow page">
      <p className="label">Library</p>
      <h1>Everything in the guide</h1>
      <p className="muted">How the program works, how to read it, and the nutrition that does most of the work.</p>
      {GROUPS.map((g) => (
        <section key={g} className="lib-group">
          <h2 className="display block-title">{g}</h2>
          <ul className="lib-list">
            {LIBRARY.filter((a) => a.group === g).map((a) => (
              <li key={a.slug}>
                <Link href={`/app/library/${a.slug}`}>
                  <strong>{a.title}</strong>
                  <span className="small muted">{a.dek}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

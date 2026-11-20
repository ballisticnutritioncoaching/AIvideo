import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/ArticleBody";
import { ExerciseSearch } from "@/components/ExerciseSearch";
import { GroceryList } from "@/components/GroceryList";
import { getArticle, LIBRARY } from "@/data/library";

export function generateStaticParams() {
  return LIBRARY.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const i = LIBRARY.indexOf(a);
  const next = LIBRARY[i + 1];
  return (
    <div className="wrap narrow page">
      <Link href="/app/library" className="back">← Library</Link>
      <p className="label">{a.group}</p>
      <h1>{a.title}</h1>
      <p className="lede">{a.dek}</p>
      {a.interactive === "grocery" && <GroceryList />}
      {a.interactive === "swaps" && <ExerciseSearch />}
      <ArticleBody blocks={a.body} />
      {next && (
        <Link href={`/app/library/${next.slug}`} className="card next-article">
          <span className="label muted">Next</span>
          <strong>{next.title} →</strong>
        </Link>
      )}
    </div>
  );
}

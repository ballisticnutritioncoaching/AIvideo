/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Logo } from "@/components/Brand";
import { PROGRAM } from "@/data/program";
import { CONFIG } from "@/lib/config";

const INSIDE = [
  { t: "Today's session, ready to go", d: "Open the app and your next workout is waiting: sets, reps, tempo and rest for this exact week." },
  { t: "81 exercise demos", d: "Tap any exercise to watch a short demo before you train it." },
  { t: "Log every set", d: "Write down your weights, see what you lifted last week, and let the rest timer run itself." },
  { t: "3 gym versions", d: "Functional fitness gym, commercial gym or a minimalist home setup. Same plan, your equipment." },
  { t: "Macro calculator", d: "Our 5-step method turns your weight and goal into calories and protein in about a minute." },
  { t: "Stupid simple nutrition", d: "EC Synkowski's 800 grams and Lazy Macros, plus a grocery list, component prep and takeout orders that work." },
];

const FAQ = [
  { q: "How long are the workouts?", a: "About an hour, 4 days a week. Short on time? The app shows you exactly what to cut." },
  { q: "What if I miss a day?", a: "Never miss twice. Pick up with the next session on your list. Don't double up, and don't restart the week. The app keeps your place for you." },
  { q: "I train at home with a few dumbbells. Will this work?", a: "Yes. The minimalist home version needs a few pairs of dumbbells, bands, a doorway pull-up bar and a weight vest or backpack. No bench." },
  { q: "I had a baby recently. Is this safe?", a: "Get cleared by your provider first. If you're working with a pelvic floor PT, follow their lead. This program is general education, not medical advice." },
  { q: "Is it a subscription?", a: `No. It's $${CONFIG.priceUsd}, one time, and the program is yours.` },
];

export default function Home() {
  return (
    <div className="landing">
      <header className="hero">
        <div className="wrap">
          <nav className="row between hero-nav">
            <Logo light />
            <div className="row" style={{ gap: 20 }}>
              <Link href="/login" className="hero-login">Log in</Link>
              <Link href="/checkout" className="hero-login">Get the program</Link>
            </div>
          </nav>
          <div className="hero-body">
            <p className="label hero-label">3 gym versions · 4 days a week · about an hour a day</p>
            <h1 className="display hero-title">
              The Ballistic<br />12-week <span>program</span>
            </h1>
            <p className="hero-sub">
              Strength, conditioning and stupid simple nutrition for parents who are done starting over every Monday.
            </p>
            <div className="row">
              <Link href="/checkout" className="btn primary">Start for ${CONFIG.priceUsd}</Link>
              <a href="#inside" className="btn hero-ghost">See what&apos;s inside</a>
            </div>
          </div>
        </div>
        <img src="/brand/bp-mark-white.svg" alt="" className="hero-watermark" />
      </header>

      <section className="wrap section">
        <div className="intro">
          <p className="label">You know what to do</p>
          <h2>Life with little kids keeps getting in the way.</h2>
          <p>
            The no sleep, the no time, the kids&apos; leftover mac and cheese at 8pm. Those aren&apos;t problems we read
            about. They&apos;re our week. So everything in this program is built for your worst week, because the best
            weeks take care of themselves.
          </p>
        </div>
      </section>

      <section id="inside" className="section tint-band">
        <div className="wrap">
          <p className="label">What you get</p>
          <h2>A coach-built program that lives on your phone.</h2>
          <div className="grid three inside-grid">
            {INSIDE.map((x) => (
              <div key={x.t} className="card">
                <h3>{x.t}</h3>
                <p className="small" style={{ marginBottom: 0 }}>{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap section">
        <div className="grid two how">
          <div>
            <p className="label">How it works</p>
            <h2>12 weeks. 3 blocks. 4 days a week.</h2>
            <p>
              Each block runs 4 weeks. Your main lifts drop reps and add weight week to week, then the exercises change
              for the next block. No deloads, because life with little kids hands you one anyway.
            </p>
            <p className="small muted">A week that works for a lot of parents: Monday, Tuesday, Thursday, Saturday. Move it around nap times, shifts and practices however you need to.</p>
          </div>
          <div className="table-scroll">
            <table className="data">
              <thead><tr><th>Day</th><th>Session</th><th>Effort</th></tr></thead>
              <tbody>
                <tr><td><strong>Day 1</strong></td><td>Full-body strength</td><td>1-2 RIR</td></tr>
                <tr><td><strong>Day 2</strong></td><td>Conditioning</td><td>RPE 6-7</td></tr>
                <tr><td><strong>Day 3</strong></td><td>Full-body strength</td><td>1-2 RIR</td></tr>
                <tr><td><strong>Day 4</strong></td><td>Weighted walk, 45-60 min</td><td>RPE 5-6</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="wrap section">
        <p className="label">Pick your version</p>
        <h2>Same structure. Your equipment.</h2>
        <div className="grid three">
          {PROGRAM.map((v) => (
            <div key={v.id} className="card version-card static">
              <span className="label blue">{v.name}</span>
              <span className="small">{v.summary}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section tint-band">
        <div className="wrap grid two about">
          <div>
            <p className="label">Who we are</p>
            <h2>We coach parents as parents.</h2>
            <p>
              We&apos;re Derrick and Ash Ball, two former gym coaches raising three kids under five. Almost everything
              we used to believe about training didn&apos;t survive a toddler and a newborn. Six-day weeks, 90-minute
              sessions, high intensity everything. So we changed how we train, how we eat and how we coach.
            </p>
            <p>12 weeks. 4 days a week. Real food. No hacks. We train to outlast our kids in tag, and that&apos;s exactly what this program is for.</p>
          </div>
          <img src="/brand/love-the-process-performance-blue.webp" alt="Love the process, more than the prize" className="about-badge" />
        </div>
      </section>

      <section className="wrap section narrow">
        <p className="label">Questions</p>
        <h2>Straight answers</h2>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <div className="wrap center stack">
          <img src="/brand/one-effort-per-day-white.webp" alt="" className="final-badge" />
          <h2>Start this week. Not next Monday.</h2>
          <p>${CONFIG.priceUsd}, one time. 12 weeks of training and nutrition, built for real parent life.</p>
          <div><Link href="/checkout" className="btn primary">Get the program</Link></div>
        </div>
      </section>

      <footer className="wrap footer small muted">
        <p>
          This program is general education, not medical advice. Talk to your provider before you start a new exercise
          or nutrition plan, especially if you&apos;re pregnant, postpartum, breastfeeding or managing a medical
          condition.
        </p>
        <p>© {new Date().getFullYear()} Ballistic Performance</p>
      </footer>
    </div>
  );
}

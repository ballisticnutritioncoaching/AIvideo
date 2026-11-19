"use client";

import Link from "next/link";
import { CoachCard } from "@/components/CoachCard";
import { Milestone } from "@/components/Milestone";
import {
  blockForWeek,
  completedCount,
  dayEffort,
  dayLength,
  dayTitle,
  DAYS,
  getVersion,
  isDone,
  nextSession,
  pendingMilestone,
  suggestedDate,
  TOTAL_SESSIONS,
  weekStreak,
} from "@/lib/program";
import { useAppState } from "@/lib/store";

const fmt = (d: Date) => d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });

export default function Today() {
  const s = useAppState()!;
  const profile = s.profile!;
  const version = getVersion(profile.version);
  const next = nextSession(s);
  const done = completedCount(s);
  const streak = weekStreak(s);
  const milestone = pendingMilestone(s);
  const first = s.account?.name.split(" ")[0];

  if (!next) {
    return (
      <div className="wrap narrow stack page">
        <p className="label">12 of 12 weeks</p>
        <h1>You finished 12 weeks.</h1>
        <p>
          First, be proud of that. You trained 4 days a week for 3 months with a family, a job and everything else on
          your plate.
        </p>
        <p>
          Here&apos;s the problem. Programs end. Week 13 shows up, there&apos;s no plan, and that&apos;s usually where
          the old pattern sneaks back in.
        </p>
        <CoachCard />
        {milestone && <Milestone week={milestone} />}
      </div>
    );
  }

  const block = blockForWeek(version, next.week);
  const date = suggestedDate(profile.startDate, profile.days, next.index);
  const pct = Math.round((done / TOTAL_SESSIONS) * 100);

  return (
    <div className="wrap page">
      <div className="today-grid">
        <section className="stack">
          <div>
            <p className="label">
              {version.short} · Block {block.block} · Week {next.week}
            </p>
            <h1>{first ? `Ready when you are, ${first}.` : "Ready when you are."}</h1>
          </div>

          <Link href={`/app/session/${next.week}/${next.day}`} className="next-card">
            <div className="row between">
              <span className="pill">Up next</span>
              {date && <span className="small next-date">Planned for {fmt(date)}</span>}
            </div>
            <p className="display next-day">Day {next.day}</p>
            <h2>{dayTitle(version, next.day)}</h2>
            <p className="next-meta">
              {dayEffort(version, next.day)} · {dayLength(next.day)}
            </p>
            <span className="btn primary block">Start session</span>
          </Link>

          <div className="card">
            <div className="row between">
              <p className="label blue" style={{ margin: 0 }}>Week {next.week}</p>
              <Link href="/app/program" className="small">Full program</Link>
            </div>
            <ol className="week-strip">
              {DAYS.map((d) => {
                const isNext = d === next.day;
                const finished = isDone(s, next.week, d);
                return (
                  <li key={d}>
                    <Link
                      href={`/app/session/${next.week}/${d}`}
                      className={`day-chip ${finished ? "done" : ""} ${isNext ? "next" : ""}`}
                    >
                      <span className="day-chip-n">{finished ? "✓" : d}</span>
                      <span className="day-chip-t">{dayTitle(version, d)}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="callout">
            <p>
              <strong>Missed a day?</strong> Never miss twice. Pick up with the next session on your list. Don&apos;t
              double up, and don&apos;t restart the week.
            </p>
          </div>
        </section>

        <aside className="stack">
          <div className="card stats">
            <div>
              <p className="stat">{done}<span>/{TOTAL_SESSIONS}</span></p>
              <p className="small muted">sessions done</p>
            </div>
            <div>
              <p className="stat">{streak}</p>
              <p className="small muted">{streak === 1 ? "week" : "weeks"} in a row with both lifts</p>
            </div>
            <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Program progress">
              <span style={{ width: `${pct}%` }} />
            </div>
          </div>
          <CoachCard />
        </aside>
      </div>
      {milestone && <Milestone week={milestone} />}
    </div>
  );
}

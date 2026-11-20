import { CONFIG } from "@/lib/config";

/** The quiet, always-there coaching invite. Wording follows Brand Manual 4.0: real price, both timelines, no hype. */
export function CoachCard({ compact = false }: { compact?: boolean }) {
  return (
    <aside className="card tint coach-card">
      <p className="label blue">Want a coach?</p>
      <h3>You don&apos;t need more information. You need someone who notices when the week goes sideways.</h3>
      {!compact && (
        <p className="small">
          {CONFIG.coachingName} is our 1:1 nutrition and training coaching for parents of little ones. One coach, a
          weekly video check-in and messaging 6 days a week.
        </p>
      )}
      <a className="btn small" href={CONFIG.bookingUrl} target="_blank" rel="noopener">
        Book a free call with Ash
      </a>
    </aside>
  );
}

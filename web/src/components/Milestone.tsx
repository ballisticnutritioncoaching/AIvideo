"use client";
/* eslint-disable @next/next/no-img-element */

import { CONFIG } from "@/lib/config";
import { update } from "@/lib/store";

const COPY: Record<number, { title: string; body: string; badge: string }> = {
  4: {
    title: "Block 1 done.",
    body: "Four weeks of showing up around naps, shifts and everything else. Next block, new exercises, same structure. Expect your weights to keep climbing.",
    badge: "/brand/train-ballistic-performance-blue.webp",
  },
  8: {
    title: "Two blocks down.",
    body: "Eight weeks in, this is starting to look like a routine. That's the whole point. One block left, and it's the strongest one.",
    badge: "/brand/love-the-process-performance-blue.webp",
  },
  12: {
    title: "You finished 12 weeks.",
    body: "Here's the thing. Programs end. Week 13 shows up, there's no plan, and that's usually where the old pattern sneaks back in. You don't need more information. You need someone who notices when the week goes sideways.",
    badge: "/brand/be-uncommon-performance-blue.webp",
  },
};

export function Milestone({ week }: { week: number }) {
  const c = COPY[week];
  if (!c) return null;
  const close = () => update((s) => ({ ...s, seenMilestones: [...s.seenMilestones, week] }));
  return (
    <div className="modal-back" role="dialog" aria-modal="true" aria-labelledby="ms-title">
      <div className="modal">
        <img src={c.badge} alt="" className="modal-badge" />
        <p className="label">Week {week} of 12</p>
        <h2 id="ms-title">{c.title}</h2>
        <p>{c.body}</p>
        <div className="card tint">
          <p className="small" style={{ marginBottom: 12 }}>
            Want a coach who&apos;s a parent too? {CONFIG.coachingName} is 1:1 coaching with one coach, a weekly video
            check-in and messaging 6 days a week. In your first 16 weeks, you&apos;ll build a routine that holds up when
            parent life gets messy. Many clients who stay with it lose 10-20 lbs over 6-9 months.
          </p>
          <a className="btn primary block" href={CONFIG.bookingUrl} target="_blank" rel="noopener" onClick={close}>
            Book a free discovery call
          </a>
        </div>
        <button type="button" className="btn ghost block" onClick={close}>
          {week === 12 ? "Close" : `Keep going to week ${week + 1}`}
        </button>
      </div>
    </div>
  );
}

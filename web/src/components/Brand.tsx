/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

/** Full BALLISTIC PERFORMANCE wordmark (traced to SVG from the supplied artwork). */
export function Logo({ light = false, href = "/" }: { light?: boolean; href?: string }) {
  return (
    <Link href={href} className="logo" aria-label="Ballistic Performance home">
      <img
        src={light ? "/brand/wordmark-white.svg" : "/brand/wordmark-performance-blue.svg"}
        alt="Ballistic Performance"
        width={2000}
        height={363}
      />
    </Link>
  );
}

export function Mark({ size = 28, light = false }: { size?: number; light?: boolean }) {
  return (
    <img
      src={light ? "/brand/bp-mark-white.svg" : "/brand/bp-mark-performance-blue.svg"}
      alt=""
      width={size}
      height={Math.round(size * 0.726)}
    />
  );
}

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

/** BP mark plus name. Swap in the full BALLISTIC PERFORMANCE wordmark file when it's supplied. */
export function Logo({ light = false, href = "/" }: { light?: boolean; href?: string }) {
  return (
    <Link href={href} className={`logo ${light ? "light" : ""}`} aria-label="Ballistic Performance home">
      <img src={light ? "/brand/bp-mark-white.svg" : "/brand/bp-mark-performance-blue.svg"} alt="" width={34} height={25} />
      <span className="logo-text">
        <span>Ballistic</span>
        <span>Performance</span>
      </span>
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

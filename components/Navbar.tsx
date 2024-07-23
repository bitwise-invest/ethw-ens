import Link from "next/link";

export function Navbar() {
  return (
    <nav>
      <div className="flex flex-wrap items-center justify-between">
        <Link
          href="/"
          className="self-center text-xl font-semibold whitespace-nowrap"
        >
          ETHW ENS
        </Link>
      </div>
    </nav>
  );
}

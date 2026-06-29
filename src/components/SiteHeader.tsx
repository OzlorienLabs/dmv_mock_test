import Link from "next/link";
import { AccountMenu } from "./AccountMenu";

export function SiteHeader() {
  return (
    <header className="border-b-4 border-ca-gold bg-ca-blue text-white">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded bg-ca-gold text-ca-blue"
          >
            DL
          </span>
          <span className="text-base leading-tight sm:text-lg">
            Driver License Test Practice
          </span>
        </Link>
        <AccountMenu />
      </div>
    </header>
  );
}

import { NextResponse } from "next/server";
import { assetLinks } from "@/lib/android";

// Served at /.well-known/assetlinks.json. Read env at request time so the
// signing fingerprints can be set/rotated via env without a code change.
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(assetLinks(), {
    headers: { "content-type": "application/json" },
  });
}

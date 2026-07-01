import type { Metadata } from "next";
import { Suspense } from "react";
import ReviewContent from "./ReviewContent";

export const metadata: Metadata = {
  title: "Test Review",
  // Renders a user's own last-attempt answers — private, not for indexing.
  robots: { index: false, follow: false },
};

export default function ReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-ca-muted">
          Loading review…
        </div>
      }
    >
      <ReviewContent />
    </Suspense>
  );
}

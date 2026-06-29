import { Suspense } from "react";
import ReviewContent from "./ReviewContent";

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

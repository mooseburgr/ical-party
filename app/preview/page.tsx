import { Suspense } from "react";
import CalendarPreview from "@/app/preview/CalendarPreview";

export default function CalendarPreviewPage() {
  return (
    <Suspense>
      <CalendarPreview />
    </Suspense>
  );
}

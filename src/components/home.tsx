"use client";

import { Suspense } from "react";
import HomeContent from "./homeContent";

export default function HomePage() {
  console.log("Rendering HomePage");
  return (

    <Suspense fallback={<div className="p-6">Loading jobs...</div>}>
      <HomeContent />
    </Suspense>
  );
}

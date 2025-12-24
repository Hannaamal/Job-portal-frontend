"use client";

import JobSearchBar from "./JobSearch";
import JobFilterRow from "./JobFilter";

interface Props {
  showFilters?: boolean; // 🔥 allows admin control
}

export default function JobSearchSection({ showFilters = true }: Props) {
  return (
    <section className="py-6">
      <JobSearchBar />
      {showFilters && <JobFilterRow />}
    </section>
  );
}

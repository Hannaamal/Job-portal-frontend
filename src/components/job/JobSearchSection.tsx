"use client";

import JobSearchBar from "./JobSearch";
import JobFilterRow from "./JobFilter";
import { useState } from "react";

interface Props {
  showFilters?: boolean; // 🔥 allows admin control
}

export default function JobSearchSection({ showFilters = true }: Props) {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
  }
  return (
    <section className="py-6">
      <JobSearchBar
        keyword={keyword}
        location={location}
        onKeywordChange={setKeyword}
        onLocationChange={setLocation}
        onSearch={handleSearch}
      />
      {showFilters && <JobFilterRow />}
    </section>
  );
}

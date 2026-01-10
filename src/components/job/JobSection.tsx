"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import JobSearchBar from "./JobSearch";
import JobFilterBar from "./JobFilter";

export default function JobSearchSection() {
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const [filters, setFilters] = useState([
    { label: "Remote", value: "remote" },
    { label: "Job type", value: "jobType" },
    { label: "Education level", value: "education" },
    { label: "Industry", value: "industry" },
  ]);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (keyword) params.append("keyword", keyword);
    if (location) params.append("location", location);

    router.push(`/jobs?${params.toString()}`);
  };

  const removeFilter = (value: string) => {
    setFilters((prev) => prev.filter((f) => f.value !== value));
  };

  return (
    <div className="py-10">

      <JobSearchBar
        keyword={keyword}
        location={location}
        onKeywordChange={setKeyword}
        onLocationChange={setLocation}
        onSearch={handleSearch}
      />

      <JobFilterBar/>
    </div>
  );
}

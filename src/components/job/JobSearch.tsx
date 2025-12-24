"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JobSearchBar() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (location) params.append("location", location);
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <div className="bg-white shadow-lg rounded-full px-6 py-3 flex items-center gap-4 max-w-5xl mx-auto">
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Job title, skills, or keywords"
        className="flex-1 outline-none"
      />

      <div className="w-px h-8 bg-gray-300" />

      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location"
        className="w-48 outline-none"
      />

      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium"
      >
        Find jobs
      </button>
    </div>
  );
}

"use client";

import { useRouter, usePathname } from "next/navigation";

interface SearchBarProps {
  keyword: string;
  location: string;
  onKeywordChange: React.Dispatch<React.SetStateAction<string>>;
  onLocationChange: React.Dispatch<React.SetStateAction<string>>;
  onSearch: () => void;
}

export default function JobSearchBar({
  keyword,
  location,
  onKeywordChange,
  onLocationChange,
  onSearch,
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (keyword.trim()) params.set("keyword", keyword.trim());
    if (location.trim()) params.set("location", location.trim());

    router.push(`${pathname}?${params.toString()}`);
    onSearch(); // optional if parent needs it
  };

  return (
    <div className="bg-white shadow-lg rounded-full px-6 py-3 flex items-center gap-4 max-w-5xl mx-auto">
      <input
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        placeholder="Job title, skills, or category"
        className="flex-1 outline-none"
      />

      <div className="w-px h-8 bg-gray-300" />

      <input
        value={location}
        onChange={(e) => onLocationChange(e.target.value)}
        placeholder="Location"
        className="w-48 outline-none"
      />

      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-6 py-2 rounded-full"
      >
        Find jobs
      </button>
    </div>
  );
}

"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

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
  const [showKeywordSuggestions, setShowKeywordSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [keywordSuggestions, setKeywordSuggestions] = useState<string[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);

  // Fetch suggestions from backend
  useEffect(() => {
    const fetchKeywordSuggestions = async () => {
      if (keyword.trim().length > 2) {
        try {
          const response = await fetch(`/api/jobs/search-suggestions?query=${encodeURIComponent(keyword)}`);
          if (response.ok) {
            const data = await response.json();
            // Filter popular job titles based on query
            const filteredJobs = data.popularJobTitles?.filter((title: string) => 
              title.toLowerCase().includes(keyword.toLowerCase())
            ) || [];
            setKeywordSuggestions(filteredJobs.slice(0, 8));
          }
        } catch (error) {
          console.error('Error fetching job suggestions:', error);
        }
      } else {
        setKeywordSuggestions([]);
      }
    };

    const fetchLocationSuggestions = async () => {
      if (location.trim().length > 2) {
        try {
          const response = await fetch(`/api/jobs/search-suggestions?query=${encodeURIComponent(location)}`);
          if (response.ok) {
            const data = await response.json();
            // Filter popular locations based on query
            const filteredLocations = data.popularLocations?.filter((loc: string) => 
              loc.toLowerCase().includes(location.toLowerCase())
            ) || [];
            setLocationSuggestions(filteredLocations.slice(0, 8));
          }
        } catch (error) {
          console.error('Error fetching location suggestions:', error);
        }
      } else {
        setLocationSuggestions([]);
      }
    };

    fetchKeywordSuggestions();
    fetchLocationSuggestions();
  }, [keyword, location]);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (keyword.trim()) params.set("keyword", keyword.trim());
    if (location.trim()) params.set("location", location.trim());

    router.push(`${pathname}?${params.toString()}`);
    onSearch(); // optional if parent needs it
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleKeywordSelect = (suggestion: string) => {
    onKeywordChange(suggestion);
    setShowKeywordSuggestions(false);
  };

  const handleLocationSelect = (suggestion: string) => {
    onLocationChange(suggestion);
    setShowLocationSuggestions(false);
  };

  return (
    <div className="bg-white shadow-lg rounded-full px-6 py-3 flex items-center gap-4 max-w-5xl mx-auto relative">
      <div className="relative flex-1">
        <input
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowKeywordSuggestions(true)}
          onBlur={() => setTimeout(() => setShowKeywordSuggestions(false), 200)}
          placeholder="Job title, skills, or category"
          className="w-full outline-none cursor"
        />
        {showKeywordSuggestions && keywordSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 max-h-48 overflow-y-auto">
            {keywordSuggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleKeywordSelect(suggestion)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-px h-8 bg-gray-300" />

      <div className="relative w-48">
        <input
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowLocationSuggestions(true)}
          onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
          placeholder="Location"
          className="w-full outline-none cursor"
        />
        {showLocationSuggestions && locationSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 max-h-48 overflow-y-auto">
            {locationSuggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleLocationSelect(suggestion)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-6 py-2 rounded-full  cursor-pointer hover:bg-blue-700 transition"
      >
        Find jobs
      </button>
    </div>
  );
}

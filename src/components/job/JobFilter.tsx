"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchJobs } from "@/redux/jobs/jobsSlice";
import type { AppDispatch } from "@/redux/store";

interface FilterItem {
  label: string;
  paramKey: string;
  options: string[]; // ✅ required
}

export default function JobFilterRow() {
  const dispatch = useDispatch<AppDispatch>();

  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string }>(
    {}
  );
  const [remoteOnly, setRemoteOnly] = useState(false);

  const filterOptions: FilterItem[] = [
    {
      label: "Job Type",
      paramKey: "jobType",
      options: ["Full-time", "Part-time", "Internship", "Contract"],
    },
    {
      label: "Experience",
      paramKey: "experience",
      options: ["Fresher", "1-3", "3-5", "5+"],
    },
    {
      label: "Salary",
      paramKey: "salary",
      options: ["20000-50000", "50000-100000", "100000-200000", "200000+"],
    },
  ];

  useEffect(() => {
    const filterPayload: { [key: string]: string | number } = {
      ...activeFilters,
    };

    /* Salary logic */
    if (activeFilters.salary) {
      const value = activeFilters.salary;

      if (value.endsWith("+")) {
        // ✅ "200000+" → salary >= 200000
        const min = Number(value.replace("+", ""));
        filterPayload.salaryMin = min;
      } else {
        // ✅ "20000-50000"
        const [min, max] = value.split("-");
        filterPayload.salaryMin = Number(min);
        filterPayload.salaryMax = Number(max);
      }

      delete filterPayload.salary;
    }

    /* ✅ Remote = location === "Remote" */
    if (remoteOnly) {
      filterPayload.location = "Remote";
    }

    dispatch(fetchJobs(filterPayload));
  }, [activeFilters, remoteOnly, dispatch]);

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((prev) => {
      const updated = { ...prev };
      if (!value) delete updated[key];
      else updated[key] = value;
      return updated;
    });
  };

  return (
    <div className="flex flex-wrap items-end justify-center gap-6 mt-6">
      {/* FILTER DROPDOWNS */}
      {filterOptions.map((filter) => (
        <div key={filter.paramKey} className="flex flex-col w-40">
          <label className="text-gray-600 text-sm font-medium mb-1">
            {filter.label}
          </label>
          <select
            value={activeFilters[filter.paramKey] || ""}
            onChange={(e) =>
              handleFilterChange(filter.paramKey, e.target.value)
            }
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">All</option>

            {filter.options.map((option) => (
              <option key={option} value={option}>
                {filter.label === "Salary"
                  ? option.endsWith("+")
                    ? `₹${Number(option.replace("+", "")) / 1000}k+`
                    : (() => {
                        const [min, max] = option.split("-");
                        return `₹${Number(min) / 1000}k - ₹${
                          Number(max) / 1000
                        }k`;
                      })()
                  : option}
              </option>
            ))}
          </select>
        </div>
      ))}

      {/* 🔹 REMOTE TOGGLE */}
      <div className="flex flex-col items-center">
        <label className="text-gray-600 text-sm font-medium mb-2">
          Remote Only
        </label>

        <button
          onClick={() => setRemoteOnly((prev) => !prev)}
          className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
            remoteOnly ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${
              remoteOnly ? "translate-x-6" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
}

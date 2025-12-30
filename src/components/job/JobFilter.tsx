"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs } from "@/redux/jobs/jobsSlice";
import type { AppDispatch, RootState } from "@/redux/store";

interface FilterItem {
  label: string;
  paramKey: string;
  options?: string[];
}

export default function JobFilterRow() {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs } = useSelector((state: RootState) => state.jobs);

  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string }>({});

  const filterOptions: FilterItem[] = [
    { label: "Job Type", paramKey: "jobType", options: ["Full-time", "Part-time", "Internship", "Contract"] },
    { label: "Remote", paramKey: "remote", options: ["true", "false"] },
    { label: "Experience", paramKey: "experience", options: ["Fresher", "1-3", "3-5", "5+"] },
    { label: "Salary", paramKey: "salary", options: ["20000-50000", "50000-100000", "100000-200000", "200000+"] },
  ];

  useEffect(() => {
    const filterPayload: { [key: string]: string | number } = { ...activeFilters };
    if (activeFilters.salary) {
      const [min, max] = activeFilters.salary.split("-");
      filterPayload.salaryMin = Number(min);
      if (max !== "+") filterPayload.salaryMax = Number(max);
      delete filterPayload.salary;
    }
    dispatch(fetchJobs(filterPayload));
  }, [activeFilters, dispatch]);

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev };
      if (!value) delete newFilters[key];
      else newFilters[key] = value;
      return newFilters;
    });
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-6">
      {filterOptions.map((filter) => (
        <div key={filter.paramKey} className="flex flex-col w-40">
          <label className="text-gray-600 text-sm font-medium mb-1">{filter.label}</label>
          <select
            value={activeFilters[filter.paramKey] || ""}
            onChange={(e) => handleFilterChange(filter.paramKey, e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:shadow-md"
          >
            <option value="">All</option>
            {filter.options?.map((option) => {
              if (filter.label === "Salary") {
                if (option.endsWith("+")) {
                  const num = Number(option.replace("+", ""));
                  return (
                    <option key={option} value={option}>
                      ₹{num / 1000}k+
                    </option>
                  );
                } else {
                  const [minStr, maxStr] = option.split("-");
                  const min = Number(minStr);
                  const max = Number(maxStr);
                  return (
                    <option key={option} value={option}>
                      ₹{min / 1000}k - ₹{max / 1000}k
                    </option>
                  );
                }
              }
              return (
                <option key={option} value={option}>
                  {option}
                </option>
              );
            })}
          </select>
        </div>
      ))}
    </div>
  );
}

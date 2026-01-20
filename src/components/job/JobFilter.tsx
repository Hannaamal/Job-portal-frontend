"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchJobs } from "@/redux/jobs/jobsSlice";
import type { AppDispatch } from "@/redux/store";
import { Calendar, Filter, DollarSign, User, Briefcase, MapPin } from "lucide-react";

interface FilterItem {
  label: string;
  paramKey: string;
  options: string[]; // ✅ required
  icon?: React.ReactNode;
}

export default function JobFilterRow() {
  const dispatch = useDispatch<AppDispatch>();

  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string }>(
    {}
  );
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [dateFilter, setDateFilter] = useState<string>("");

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
    {
      label: "Date Posted",
      paramKey: "datePosted",
      options: ["Today", "Last 3 days", "Last 7 days", "Last 30 days"],
   
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

    /* Date Posted logic */
    if (activeFilters.datePosted) {
      const today = new Date();
      const value = activeFilters.datePosted;
      
      let daysBack = 1; // Default to today
      
      switch (value) {
        case "Today":
          daysBack = 1;
          break;
        case "Last 3 days":
          daysBack = 3;
          break;
        case "Last 7 days":
          daysBack = 7;
          break;
        case "Last 30 days":
          daysBack = 30;
          break;
      }
      
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - daysBack);
      
      filterPayload.postedAfter = startDate.toISOString();
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
      {filterOptions.map((filter) => {
        const isActive = activeFilters[filter.paramKey] && activeFilters[filter.paramKey] !== "";
        const isSelected = activeFilters[filter.paramKey];
        
        return (
          <div key={filter.paramKey} className="flex flex-col w-48">
            <div className="relative group">
              <select
                value={activeFilters[filter.paramKey] || ""}
                onChange={(e) =>
                  handleFilterChange(filter.paramKey, e.target.value)
                }
                className={`appearance-none w-full transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-lg shadow-blue-100/50 ring-1 ring-blue-100"
                    : "bg-white border-gray-200 hover:border-gray-300"
                } rounded-xl px-4 py-3 text-sm font-medium ${
                  isActive
                    ? "text-blue-700"
                    : "text-gray-700"
                } group-hover:shadow-md focus:outline-none focus:ring-2 focus:border-transparent cursor-pointer`}
              >
                <option value="">All {filter.label}</option>

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
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className={`w-4 h-4 transition-colors duration-200 ${
                  isActive ? "text-blue-400" : "text-gray-400 group-hover:text-gray-600"
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {/* Active indicator badge */}
              {isActive && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
              
              {/* Selected value badge */}
              {isSelected && isSelected !== "" && (
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs px-2 py-1 rounded-full shadow-lg font-medium transform translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  {isSelected}
                </div>
              )}
            </div>
          </div>
        );
      })}

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
            className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300  cursor-pointer ${
              remoteOnly ? "translate-x-6" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
}

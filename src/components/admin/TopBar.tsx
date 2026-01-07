"use client";

import { Bell, Search, Plus } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import PostJobSlideOver from "./PostJobSlideOver";

interface Company {
  _id: string;
  name: string;
}

export default function TopBar({
  value,
  onSearch,
}: {
  value: string;
  onSearch: (value: string) => void;
}) {
  const input = value;
  const [companies, setCompanies] = useState<Company[]>([]);
  const [openList, setOpenList] = useState(false);
  const [isSlideOpen, setSlideOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  /* ---------------- FETCH COMPANIES ONCE ---------------- */
  useEffect(() => {
    api.get("/api/company/view").then((res) => {
      setCompanies(res.data);
    });
  }, []);

  /* ---------------- CLOSE DROPDOWN ON OUTSIDE CLICK ---------------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpenList(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Good Morning!</h1>
          <p className="text-gray-500 text-sm">Here’s what’s happening today</p>
        </div>

        <div className="flex items-center gap-4">
          {/* SEARCH BOX */}
          <div className="relative w-64" ref={boxRef}>
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search company"
              value={input}
              onFocus={() => setOpenList(true)}
              onChange={(e) => {
                const val = e.target.value;
                onSearch(val); // ✅ parent state updated
                if (val === "") {
                  setOpenList(false);
                }
              }}
              className="pl-10 pr-4 py-2 rounded-lg border text-sm w-full"
            />

            {/* DROPDOWN */}
            {openList && filteredCompanies.length > 0 && (
              <div className="absolute z-20 mt-1 w-full bg-white border rounded-lg shadow-md max-h-56 overflow-auto">
                {filteredCompanies.map((company) => (
                  <div
                    key={company._id}
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      onSearch(company.name); // parent updated
                      setOpenList(false);
                    }}
                  >
                    {company.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* POST JOB */}
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
            onClick={() => setSlideOpen(true)}
          >
            <Plus size={16} /> Post a Job
          </button>
        </div>
      </div>

      <PostJobSlideOver
        isOpen={isSlideOpen}
        onClose={() => setSlideOpen(false)}
      />
    </>
  );
}

"use client";

import { Bell, Search, Plus } from "lucide-react";
import { useState } from "react";
import PostJobSlideOver from "./PostJobSlideOver";

export default function TopBar() {
  const [isSlideOpen, setSlideOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Good Morning!</h1>
          <p className="text-gray-500 text-sm">
            Here’s what’s happening today
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
            <input
              placeholder="Search"
              className="pl-10 pr-4 py-2 rounded-lg border text-sm"
            />
          </div>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => setSlideOpen(true)}
          >
            <Plus size={16} /> Post a Job
          </button>

          <Bell className="text-gray-500 cursor-pointer" />
          <img
            src="https://i.pravatar.cc/40"
            className="w-9 h-9 rounded-full"
          />
        </div>
      </div>

      <PostJobSlideOver
        isOpen={isSlideOpen}
        onClose={() => setSlideOpen(false)}
      />
    </>
  );
}

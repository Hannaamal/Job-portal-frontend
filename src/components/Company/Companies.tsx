"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CompanyCard from "@/components/Company/CompanyCard";
import { fetchCompanies } from "@/redux/company/companySlice";
import { RootState, AppDispatch } from "@/redux/store";

const ITEMS_PER_PAGE = 6;

export default function CompaniesPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { companies = [], loading, error } = useSelector(
    (state: RootState) => state.company || {}
  );

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  if (loading)
    return <p className="p-6 text-center text-gray-500">Loading companies...</p>;

  if (error)
    return <p className="p-6 text-center text-red-500">{error}</p>;

  if (companies.length === 0)
    return <p className="p-6 text-center text-gray-500">No companies found.</p>;

  const totalPages = Math.ceil(companies.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCompanies = companies.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentCompanies.map((company) => (
          <CompanyCard key={company._id} company={company} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
          {/* Prev */}
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-blue-500 hover:text-white shadow"
            }`}
          >
            Prev
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg transition ${
                page === currentPage
                  ? "bg-blue-600 text-white shadow scale-105"
                  : "bg-white text-gray-700 hover:bg-blue-500 hover:text-white shadow"
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-blue-500 hover:text-white shadow"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

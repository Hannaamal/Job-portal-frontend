"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubscriptions } from "@/redux/company/companySlice";
import { RootState, AppDispatch } from "@/redux/store";
import SubscribeButton from "@/components/Company/SubscribeButton";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 6;

export default function SubscriptionsPage() {
  const dispatch = useDispatch<AppDispatch>();

  // Get subscriptions from Redux (renamed to avoid conflict)
  const { subscriptions: reduxSubscriptions, loading } = useSelector(
    (state: RootState) => state.company
  );

  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // Local state to manage immediate updates
  const [subscriptions, setSubscriptions] = useState(reduxSubscriptions);

  // Fetch subscriptions on mount
  useEffect(() => {
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  // Keep local state in sync with Redux
  useEffect(() => {
    setSubscriptions(reduxSubscriptions);
  }, [reduxSubscriptions]);

  // Remove company from local state after unsubscribe
  const handleUnsubscribe = (companyId: string) => {
    setSubscriptions((prev) =>
      prev.filter((sub) => sub.company._id !== companyId)
    );
  };

  if (loading) return <p className="p-6">Loading subscriptions...</p>;
  if (!subscriptions.length)
    return <p className="p-6 text-center">You have no active subscriptions.</p>;

  const totalPages = Math.ceil(subscriptions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCompanies = subscriptions.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-6">
      {currentCompanies.map((sub: any) => {
        const company = sub.company;
        return (
          <div
            key={company._id}
            onClick={() => router.push(`/companies/${company._id}`)}
            className="border rounded-xl p-4 shadow-md flex flex-col items-center text-center transition-all duration-300 cursor-pointer hover:shadow-lg"
          >
            {/* Company Logo */}
            <div className="w-24 h-24 mb-4">
              <img
                src={
                  company.logo && company.logo !== ""
                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${company.logo}`
                    : `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/logos/default-logo.png`
                }
                alt={company.name}
                className="w-full h-full object-cover rounded-full border-2 border-gray-200"
              />
            </div>

            {/* Company Info */}
            <h3 className="font-bold text-lg mb-1">{company.name}</h3>
            <p className="text-sm text-gray-500 mb-3">{company.location}</p>

            {/* Subscribe/Unsubscribe Button */}
            <div onClick={(e) => e.stopPropagation()} className="mt-3">
              <SubscribeButton
                companyId={company._id}
                initialSubscribed={true}
                onUnsubscribe={() => handleUnsubscribe(company._id)}
              />
            </div>
          </div>
        );
      })}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex justify-center items-center gap-2 flex-wrap">
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

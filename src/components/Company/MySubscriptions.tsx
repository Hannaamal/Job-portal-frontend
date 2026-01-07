"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubscriptions } from "@/redux/company/companySlice";
import { RootState, AppDispatch } from "@/redux/store";
import SubscribeButton from "@/components/Company/SubscribeButton";

export default function SubscriptionsPage() {
  const dispatch = useDispatch<AppDispatch>();

  // Get subscriptions from Redux (renamed to avoid conflict)
  const { subscriptions: reduxSubscriptions, loading } = useSelector(
    (state: RootState) => state.company
  );

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

  return (
    <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-6">
      {subscriptions.map((sub: any) => {
        const company = sub.company;
        return (
          <div
            key={company._id}
            className="border rounded-xl p-4 shadow-md flex flex-col items-center text-center transition-all duration-300"
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
            <SubscribeButton
              companyId={company._id}
              initialSubscribed={true} // all listed here are active subscriptions
              onUnsubscribe={() => handleUnsubscribe(company._id)} // remove card immediately
            />
          </div>
        );
      })}
    </div>
  );
}

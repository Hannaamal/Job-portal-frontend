"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanyById } from "@/redux/company/companySlice";
import { RootState, AppDispatch } from "@/redux/store";
import SubscribeButton from "@/components/Company/SubscribeButton"; // import your button

export default function CompanyProfilePage() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedCompany, loading } = useSelector(
    (state: RootState) => state.company
  );

  useEffect(() => {
    if (id) dispatch(fetchCompanyById(id as string));
  }, [id, dispatch]);

  if (loading || !selectedCompany) return <p>Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* Company Logo */}
          <img
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${selectedCompany.logo}`}
            alt={selectedCompany.name}
            className="w-24 h-24 object-cover rounded-full border"
          />
          <div>
            <h1 className="text-3xl font-bold">{selectedCompany.name}</h1>
            <p className="text-gray-500">{selectedCompany.location}</p>
          </div>
        </div>

        {/* Subscribe/Unsubscribe Button */}
        <SubscribeButton
          companyId={selectedCompany._id}
          initialSubscribed={selectedCompany.isSubscribed}
        />
      </div>

      {/* ABOUT */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold">About Company</h2>
        <p className="text-gray-700 mt-2">{selectedCompany.description}</p>
      </section>

      {/* JOBS */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">
          Jobs ({selectedCompany.jobs.length})
        </h2>

        {selectedCompany.jobs.length === 0 ? (
          <p>No jobs posted yet</p>
        ) : (
          <div className="space-y-4">
            {selectedCompany.jobs.map((job: any) => (
              <div key={job._id} className="border p-4 rounded hover:shadow">
                <h3 className="font-bold">{job.title}</h3>
                <p className="text-gray-600">{job.location}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

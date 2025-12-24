"use client";

import Link from "next/link";

export default function CompanyCard({ company }: any) {
  return (
    <div className="border rounded-xl bg-white p-4 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center">
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
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null; // Prevent infinite loop
        target.src = `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/logos/default_logo.jpg`;
      }}
        />
      </div>

      {/* Company Info */}
      <h3 className="font-bold text-lg mb-1">{company.name}</h3>
      <p className="text-sm text-gray-500 mb-3">{company.location}</p>

      {/* View Profile Button */}
      <Link
        href={`/companies/${company._id}`}
        className="mt-auto px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
      >
        More Details
      </Link>
    </div>
  );
}

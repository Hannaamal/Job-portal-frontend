"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CompanyCard from "@/components/Company/CompanyCard";
import { fetchCompanies } from "@/redux/company/companySlice";
import { RootState, AppDispatch } from "@/redux/store";

export default function CompaniesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { companies = [] } = useSelector(
    (state: RootState) => state.company || {}
  );

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  return (
     <div className="p-6 grid grid-cols-2 gap-6">
      {companies.map((company) => (
        <CompanyCard key={company._id} company={company} />
      ))}
    </div>
  );
}

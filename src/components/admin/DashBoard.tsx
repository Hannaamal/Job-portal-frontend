"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchDashboard } from "@/redux/admin/dashboardSlice";

import { Users, UserCheck, UserX, Briefcase } from "lucide-react";

import TopBar from "@/components/admin/TopBar";
import ApplicationsCard from "@/components/admin/ApplicationCard";
import ResourceStatusCard from "@/components/admin/ResourceStatusCard";
import InterviewsCard from "@/components/admin/InterviewCard";
import JobStatsChart from "@/components/admin/JobStatCard";
import StatCard from "@/components/admin/StatCard";

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const [company, setCompany] = useState<string>("");
  

  const { stats, applications, jobStats, loading, error } = useSelector(
    (state: RootState) => state.adminDashboard
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchDashboard(company));
    }, 500);

    return () => clearTimeout(timer);
  }, [company, dispatch]);

  if (loading) return <p className="text-center mt-10">Loading dashboard...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500">Error: {error}</p>;

  return (
    <div className="space-y-6 ">
      
      <TopBar value={company} onSearch={setCompany}  />

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Interviews"
          value={stats.interviews.toString()}
          percent="+20%"
          icon={<Users />}
        />
        <StatCard
          title="Shortlisted"
          value={stats.shortlisted.toString()}
          percent="+05%"
          icon={<UserCheck />}
        />
        <StatCard
          title="Hired"
          value={stats.hired.toString()}
          percent="-05%"
          icon={<UserX />}
        />
        <StatCard
          title="Jobs"
          value={stats.jobs.toString()}
          percent="+12%"
          icon={<Briefcase />}
        />
      </div>

      {/* MIDDLE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ApplicationsCard data={applications} />
        <InterviewsCard />
      </div>

      {/* JOB STATS */}
      <JobStatsChart data={jobStats} />
    </div>
  );
}

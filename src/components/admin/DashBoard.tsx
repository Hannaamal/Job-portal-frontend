"use client";

import {
  Users,
  UserCheck,
  UserX,
  Briefcase,
} from "lucide-react";

import TopBar from "@/components/admin/TopBar";

import ApplicationsCard from "@/components/admin/ApplicationCard";
import ResourceStatusCard from "@/components/admin/ResourceStatusCard";
import InterviewsCard from "@/components/admin/InterviewCard";
import JobStatsChart from "@/components/admin/JobStatCard";
import StatCard from "@/components/admin/StatCard";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <TopBar />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Interviews"
          value="256"
          percent="+20%"
          icon={<Users />}
        />
        <StatCard
          title="Shortlisted"
          value="20"
          percent="+05%"
          icon={<UserCheck />}
        />
        <StatCard
          title="Hired"
          value="06"
          percent="-05%"
          icon={<UserX />}
        />
        <StatCard
          title="Jobs"
          value="48"
          percent="+12%"
          icon={<Briefcase />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ApplicationsCard />
        <ResourceStatusCard />
        <InterviewsCard />
      </div>

      <JobStatsChart />
    </div>
  );
}

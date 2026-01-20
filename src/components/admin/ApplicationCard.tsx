

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface ApplicationCardProps {
  data?: {
    applicant: string;
    title: string;
    received: number;
    interviews: number;
    rejected: number;
  }[];
}

export default function ApplicationsCard({ data }: ApplicationCardProps) {
  const applications = data || [];

  const { stats, applications: appData, jobStats, loading, error } = useSelector(
    (state: RootState) => state.adminDashboard
  );

  // Compute totals
  const totalReceived = applications.reduce((sum, app) => sum + app.received, 0);
  const totalInterview = applications.reduce((sum, app) => sum + app.interviews, 0);
  const totalRejected = applications.reduce((sum, app) => sum + app.rejected, 0);

  // Latest 5 applications (for display)
  const latestApps = applications.slice(-5).reverse();

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg text-gray-900">Applications</h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {applications.length} total
        </span>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{totalReceived}</div>
          <div className="text-xs text-green-600 font-medium">Received</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-600">{totalRejected}</div>
          <div className="text-xs text-red-600 font-medium">Rejected</div>
        </div>
      </div>

      {/* Application List */}
      <div className="space-y-3">
        {latestApps.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-sm">No applications yet</p>
          </div>
        ) : (
          latestApps.map((app, idx) => (
            <div key={idx} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">{app.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {app.applicant && app.applicant !== "Unknown" && app.applicant !== "Applicant details not available"
                      ? app.applicant 
                      : "Applicant details not available"}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {applications.length > 5 && (
        <div className="text-center mt-3 text-sm text-gray-500 border-t pt-3">
          Showing latest 5 of {applications.length} applications
        </div>
      )}
    </div>
  );
}

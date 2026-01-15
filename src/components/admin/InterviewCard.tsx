"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Briefcase, Calendar, Clock, MapPin, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface InterviewData {
  _id: string;
  job: {
    _id: string;
    title?: string;
  } | string;
  company: {
    _id: string;
    name?: string;
  } | string;
  interviewMode: "Walk-in" | "Slot-based";
  medium: "Online" | "Onsite";
  interviewType: "HR" | "Technical" | "Managerial";
  meetingLink?: string;
  location?: string;
  date: string;
  timeRange?: {
    start: string;
    end: string;
  };
  instructions?: string;
}

function InterviewItem({ 
  interview 
}: { 
  interview: InterviewData; 
}) {
  const jobTitle = typeof interview.job === 'string' ? 'Unknown Job' : interview.job.title;
  const companyName = typeof interview.company === 'string' ? 'Unknown Company' : interview.company.name;
  const time = interview.timeRange ? `${interview.timeRange.start} - ${interview.timeRange.end}` : 'Time not specified';
  const date = new Date(interview.date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <div className="flex flex-col gap-3 mb-4 p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-gray-900 text-lg">{jobTitle}</h4>
          <p className="text-sm text-gray-600">{companyName}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex gap-2 text-xs text-gray-500">
            <span className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
              <Users size={12} />
              {interview.interviewType}
            </span>
          </div>
          <div className="flex gap-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {time}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span className="flex items-center gap-1">
          <Briefcase size={14} />
          {interview.medium}
        </span>
        {interview.location && (
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {interview.location}
          </span>
        )}
      </div>
      
      {interview.instructions && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <strong>Instructions:</strong> {interview.instructions}
        </div>
      )}
    </div>
  );
}

export default function InterviewsCard() {
  const router = useRouter();
  const { stats, loading: dashboardLoading } = useSelector((state: RootState) => state.adminDashboard);
  const { interviews } = useSelector((state: RootState) => state.adminInterviews);
  
  // Filter for upcoming interviews (date >= today) and sort by date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingInterviews = interviews
    .filter((interview) => {
      if (!interview.date) return false;
      const interviewDate = new Date(interview.date);
      if (isNaN(interviewDate.getTime())) return false;
      interviewDate.setHours(0, 0, 0, 0);
      return interviewDate >= today;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    })
    .slice(0, 3);

  const interviewCount = stats.interviews || 0;
  
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Upcoming Interviews</h3>
        <span className="text-sm text-gray-500">
          {interviewCount} total scheduled
        </span>
      </div>

      {dashboardLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : upcomingInterviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Calendar size={40} className="mx-auto mb-3 opacity-50" />
          <p className="text-lg">No upcoming interviews</p>
          <p className="text-sm text-gray-400 mt-1">Schedule interviews to see them here</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 border-b pb-2">
            <Calendar size={16} />
            <span>Sorted by date (earliest first)</span>
          </div>
          <div className="space-y-3">
            {upcomingInterviews.map((interview, index) => (
              <div key={interview._id} className="relative">
                {/* Date indicator */}
                <div className="absolute -top-2 -left-3 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                  #{index + 1}
                </div>
                <InterviewItem interview={interview} />
              </div>
            ))}
          </div>
          
          {interviewCount > 3 && (
            <div className="text-center text-sm text-gray-500 pt-2 border-t">
              <span className="bg-gray-100 px-2 py-1 rounded-full font-medium">
                +{interviewCount - 3} more interviews
              </span>
            </div>
          )}
        </div>
      )}

      <button 
        onClick={() => router.push('/admin/interview-scheduler')}
        className="w-full mt-4 py-2 rounded-lg border text-blue-600 hover:bg-blue-50 transition-colors font-medium"
      >
        View All Interviews
      </button>
    </div>
  );
}

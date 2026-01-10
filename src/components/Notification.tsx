"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markAsRead } from "@/redux/notificationSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { notifications, loading, error } = useSelector(
    (state: RootState) => state.notifications
  );

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleOpenJob = (notif: any) => {
    const jobId = notif.job?._id;

    if (!jobId) {
      console.error("No jobId in notification:", notif);
      return;
    }

    dispatch(markAsRead(notif._id));
    router.push(`/job/${jobId}`);
  };

  const handleMarkAsRead = (e: React.MouseEvent, notifId: string) => {
    e.stopPropagation();
    dispatch(markAsRead(notifId));
  };

  if (loading) return <p className="p-6">Loading notifications...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!notifications.length)
    return <p className="p-6 text-center">No notifications yet.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold mb-4">Notifications</h1>

      <div className="flex flex-col gap-3">
        {notifications.map((notif) => (
          <div
            key={notif._id}
            onClick={() => handleOpenJob(notif)}
            className={`cursor-pointer flex justify-between items-start p-4 border rounded-lg shadow-sm transition
              ${
                notif.isRead ? "bg-gray-50" : "bg-white border-blue-500"
              } hover:bg-gray-100`}
          >
            <div>
              <p className="text-gray-800 font-medium">
                {notif.message || `Update on job: ${notif.job?.title}`}
              </p>

              {notif.job && (
                <p className="text-sm text-gray-500 mt-1">
                  {typeof notif.job.company === "object"
                    ? notif.job.company.name
                    : "Company not disclosed"}{" "}
                  • {notif.job.location}
                </p>
              )}

              <p className="text-xs text-gray-400 mt-1">
                {new Date(notif.createdAt).toLocaleString()}
              </p>
            </div>

            {!notif.isRead && (
              <button
                onClick={(e) => handleMarkAsRead(e, notif._id)}
                className="ml-4 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                title="Mark as read"
              >
                <CheckIcon size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

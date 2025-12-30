"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markAsRead } from "@/redux/notificationSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { CheckIcon } from "lucide-react";

export default function NotificationsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, loading, error } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

   const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };


  if (loading) return <p className="p-6">Loading notifications...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!notifications.length) return <p className="p-6 text-center">No notifications yet.</p>;

   return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
      <div className="flex flex-col gap-3">
        {notifications.map((notif) => (
          <div
            key={notif._id}
            className={`flex justify-between items-start p-4 border rounded-lg shadow-sm transition 
              ${notif.isRead ? "bg-gray-50" : "bg-white border-blue-500"} hover:bg-gray-50`}
          >
            <div>
              <p className="text-gray-800">
                {notif.message ||
                  `Update on job: ${notif.job?.title} at ${notif.job?.company || ""}`}
              </p>
              {notif.job && (
                <p className="text-sm text-gray-500 mt-1">
                  {notif.job.company} - {notif.job.location}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {new Date(notif.createdAt).toLocaleString()}
              </p>
            </div>

            {!notif.isRead && (
              <button
                onClick={() => handleMarkAsRead(notif._id)}
                className="ml-4 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                title="Mark as read"
              >
                <CheckIcon fontSize="small" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

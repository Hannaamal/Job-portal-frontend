"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { scheduleInterviewThunk } from "@/redux/admin/interviewSlice";


type InterviewMode = "Walk-in" | "Slot-based";
type Medium = "Online" | "Onsite";
type InterviewType = "HR" | "Technical" | "Managerial";

interface FormState {
  interviewMode: InterviewMode;
  medium: Medium;
  interviewType: InterviewType;
  date: string;
  timeRange: {
    start: string;
    end: string;
  };
  meetingLink: string;
  location: string;
  instructions: string;
}

type Props = {
  jobId: string;
  onClose: () => void;
};

export default function ScheduleInterviewModal({ jobId, onClose }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector(
    (state: RootState) => state.adminInterviews
  );

  const [form, setForm] = useState<FormState>({
    interviewMode: "Walk-in",
    medium: "Online",
    interviewType: "HR",
    date: "",
    timeRange: {
      start: "",
      end: "",
    },
    meetingLink: "",
    location: "",
    instructions: "",
  });


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("timeRange.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        timeRange: {
          ...prev.timeRange,
          [key]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    await dispatch(
      scheduleInterviewThunk({
        jobId,
        data: form,
      })
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          Schedule Interview
        </h2>

        {/* Interview Mode */}
        <label className="block mb-3">
          <span className="text-sm font-medium">Interview Mode</span>
          <select
            name="interviewMode"
            value={form.interviewMode}
            onChange={handleChange}
            className="w-full mt-1 border rounded-lg p-2"
          >
            <option value="Walk-in">Walk-in</option>
            <option value="Slot-based">Slot-based</option>
          </select>
        </label>

        {/* Medium */}
        <label className="block mb-3">
          <span className="text-sm font-medium">Medium</span>
          <select
            name="medium"
            value={form.medium}
            onChange={handleChange}
            className="w-full mt-1 border rounded-lg p-2"
          >
            <option value="Online">Online</option>
            <option value="Onsite">Onsite</option>
          </select>
        </label>

        {/* Interview Type */}
        <label className="block mb-3">
          <span className="text-sm font-medium">Interview Type</span>
          <select
            name="interviewType"
            value={form.interviewType}
            onChange={handleChange}
            className="w-full mt-1 border rounded-lg p-2"
          >
            <option value="HR">HR</option>
            <option value="Technical">Technical</option>
            <option value="Managerial">Managerial</option>
          </select>
        </label>

        {/* Date */}
        <label className="block mb-3">
          <span className="text-sm font-medium">Date</span>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full mt-1 border rounded-lg p-2"
          />
        </label>

        {/* Time Range */}
        <div className="flex gap-3 mb-3">
          <label className="flex-1">
            <span className="text-sm font-medium">Start Time</span>
            <input
              type="time"
              name="timeRange.start"
              value={form.timeRange.start}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg p-2"
            />
          </label>

          <label className="flex-1">
            <span className="text-sm font-medium">End Time</span>
            <input
              type="time"
              name="timeRange.end"
              value={form.timeRange.end}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg p-2"
            />
          </label>
        </div>

        {/* Conditional Fields */}
        {form.medium === "Online" && (
          <label className="block mb-3">
            <span className="text-sm font-medium">Meeting Link</span>
            <input
              type="text"
              name="meetingLink"
              value={form.meetingLink}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg p-2"
              placeholder="https://meet.google.com/..."
            />
          </label>
        )}

        {form.medium === "Onsite" && (
          <label className="block mb-3">
            <span className="text-sm font-medium">Location</span>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg p-2"
              placeholder="Office address"
            />
          </label>
        )}

        {/* Instructions */}
        <label className="block mb-4">
          <span className="text-sm font-medium">Instructions</span>
          <textarea
            name="instructions"
            value={form.instructions}
            onChange={handleChange}
            className="w-full mt-1 border rounded-lg p-2"
            rows={3}
          />
        </label>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Scheduling..." : "Schedule"}
          </button>
        </div>
      </div>
    </div>
  );
}

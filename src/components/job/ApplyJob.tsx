"use client";

import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import type { AppDispatch, RootState } from "@/redux/store";
import { applyForJob } from "@/redux/jobs/jobApplicationSlice";

export default function ApplyJobPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { loading } = useSelector((state: RootState) => state.jobApplication);

  const [step, setStep] = useState(1);
  const [resume, setResume] = useState<File | null>(null);
  const [experience, setExperience] = useState("");
  const [success, setSuccess] = useState(false);

  const progressWidth = ["w-1/3", "w-2/3", "w-full"][step - 1];

  // 🚀 FINAL SUBMIT
  const handleSubmit = async () => {
    try {
      await dispatch(
        applyForJob({ jobId, resume: resume!, experience })
      ).unwrap();

      setSuccess(true);
    } catch (err: any) {
      alert(err || "Failed to apply");
    }
  };

  // ✅ SUCCESS SCREEN
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow text-center max-w-sm">
          <h2 className="text-xl font-semibold text-green-600">
            🎉 Job Applied Successfully
          </h2>
          <p className="text-gray-600 mt-2">
            Your application has been sent to the employer.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Browse Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl border p-6">
        {/* 🔵 Progress */}
        <div className="mb-6">
          <div className="h-1.5 bg-gray-200 rounded-full">
            <div
              className={`h-1.5 bg-blue-600 rounded-full ${progressWidth}`}
            />
          </div>
        </div>

        {/* STEP 1 — UPLOAD CV */}
        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold mb-1">Add your CV</h2>
            <p className="text-sm text-gray-500 mb-5">
              This will be shared with the employer
            </p>

            {!resume ? (
              <label
                className="flex flex-col items-center justify-center gap-2
                  border-2 border-dashed border-gray-300
                  rounded-xl h-40
                  cursor-pointer
                  hover:border-blue-500 hover:bg-blue-50
                  transition mb-5"
              >
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16v-8m0 0l-3 3m3-3l3 3M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1"
                  />
                </svg>

                <p className="text-sm font-medium text-gray-700">Upload CV</p>

                <p className="text-xs text-gray-400">
                  PDF, DOC, DOCX (Max 5MB)
                </p>

                <input
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResume(e.target.files?.[0] || null)}
                />
              </label>
            ) : (
              <div className="border rounded-lg p-4 mb-5 text-sm">
                ✔ {resume.name}
              </div>
            )}

            <button
              disabled={!resume}
              onClick={() => setStep(2)}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg disabled:bg-blue-300"
            >
              Continue
            </button>
          </>
        )}

        {/* STEP 2 — EXPERIENCE */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold mb-1">Add your experience</h2>
            <p className="text-sm text-gray-500 mb-5">
              Help the employer understand your background
            </p>

            <textarea
              rows={5}
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Frontend Developer at Hotzox Technologies..."
              className="w-full border rounded-lg p-3 mb-5 resize-none"
            />

            <button
              disabled={!experience}
              onClick={() => setStep(3)}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg disabled:bg-blue-300"
            >
              Continue
            </button>
          </>
        )}

        {/* STEP 3 — REVIEW */}
        {step === 3 && (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Review your application
            </h2>

            <div className="border rounded-lg p-4 text-sm mb-4">
              <p>
                <strong>Resume:</strong> {resume?.name}
              </p>
              <p className="mt-2">
                <strong>Experience:</strong>
                <br />
                {experience}
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2.5 rounded-lg"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </>
        )}

        {/* Save & Close */}
        <button
          onClick={() => router.back()}
          className="w-full mt-3 text-sm text-gray-500"
        >
          Save and close
        </button>
      </div>
    </div>
  );
}

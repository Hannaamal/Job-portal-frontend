"use client";

import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import type { AppDispatch, RootState } from "@/redux/store";
import { applyForJob } from "@/redux/jobs/jobApplicationSlice";
import { fetchMyProfile } from "@/redux/profileSlice";

export default function ApplyJobPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { loading } = useSelector((state: RootState) => state.jobApplication);
  const profile = useSelector((state: RootState) => state.profile.profile);

  const [step, setStep] = useState(1);
  const [resume, setResume] = useState<File | null>(null);
  const [useExistingResume, setUseExistingResume] = useState(false);
  const [experience, setExperience] = useState("");
  const [success, setSuccess] = useState(false);

  // Fetch profile on component mount
  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);

  const progressWidth = ["w-1/3", "w-2/3", "w-full"][step - 1];

  // 🚀 FINAL SUBMIT
  const handleSubmit = async () => {
    try {
      // Check if user has selected a resume (either uploaded file or existing)
      if (!resume && !useExistingResume) {
        alert("Please upload a resume file or select an existing resume to apply for this job.");
        return;
      }

      // Create FormData for the application
      const formData = new FormData();
      
      // Add resume - either uploaded file or existing resume URL
      if (resume) {
        // User uploaded a new file
        formData.append("resume", resume);
      } else if (useExistingResume && profile?.resume) {
        // User wants to use existing resume - add the URL
        formData.append("resumeUrl", profile.resume.url);
      }
      
      formData.append("experience", experience);

      await dispatch(
        applyForJob({ 
          jobId, 
          resume: resume || undefined, 
          resumeUrl: useExistingResume && profile?.resume ? profile.resume.url : undefined,
          experience 
        })
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

            {/* Show existing resume if available */}
            {profile?.resume && !resume && !useExistingResume && (
              <div className="border rounded-lg p-4 mb-4 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Existing Resume:</span>
                  <button
                    onClick={() => setUseExistingResume(true)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Use This Resume
                  </button>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>{profile.resume.url.split('/').pop()}</span>
                  <span className="text-xs text-gray-400">
                    (Uploaded: {new Date(profile.resume.uploadedAt).toLocaleDateString()})
                  </span>
                </div>
              </div>
            )}

            {/* Show selected resume */}
            {(resume || useExistingResume) && (
              <div className="border rounded-lg p-4 mb-4 bg-green-50 border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">
                    Selected Resume:
                  </span>
                  <button
                    onClick={() => {
                      setResume(null);
                      setUseExistingResume(false);
                    }}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Change
                  </button>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-700 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>
                    {resume 
                      ? resume.name 
                      : (profile?.resume ? profile.resume.url.split('/').pop() : 'Resume')
                    }
                  </span>
                </div>
              </div>
            )}

            {/* Upload new resume option */}
            {!resume && !useExistingResume && (
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

                <p className="text-sm font-medium text-gray-700">Upload New CV</p>

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
            )}

            {/* Resume selection message */}
            {(!resume && !useExistingResume) && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ Please upload a resume file or select an existing resume to continue
                </p>
              </div>
            )}

            <button
              disabled={(!resume && !useExistingResume)}
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
                <strong>Resume:</strong>{" "}
                {resume 
                  ? resume.name 
                  : (useExistingResume && profile?.resume 
                      ? profile.resume.url.split('/').pop() 
                      : "No resume selected")
                }
              </p>
              <p className="mt-2">
                <strong>Experience:</strong>
                <br />
                {experience}
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || (!resume && !useExistingResume)}
              className="w-full bg-green-600 text-white py-2.5 rounded-lg disabled:bg-green-300"
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
        close
        </button>
      </div>
    </div>
  );
}

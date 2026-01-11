"use client";

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyProfile,
  updateMyProfile,
  fetchSkills,
  selectProfile,
  selectSkills,
  selectUser,
} from "@/redux/profileSlice";
import { AppDispatch } from "@/redux/store";
import { calculateProfileCompletion } from "@/utils/profileCompletion";

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector(selectProfile);
  const skills = useSelector(selectSkills);

  console.log("RAW skills selector:", skills);
  console.log("Is array?", Array.isArray(skills));
  const user = useSelector(selectUser);
  const [form, setForm] = useState<any>({
    phone: "",
    location: "",
    title: "",
    experienceLevel: "",
    summary: "",
    skills: [],
    education: [],
    experience: [],
    avatar: "",
    resume: null,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [editingEducation, setEditingEducation] = useState<number | null>(null);
  const [editingExperience, setEditingExperience] = useState<number | null>(
    null
  );
  const completion = calculateProfileCompletion(profile);

  /* ================= LOAD ================= */
  useEffect(() => {
    dispatch(fetchMyProfile());
    dispatch(fetchSkills());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (form.avatar instanceof File) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [form.avatar]);

  useEffect(() => {
    if (!profile) return;
    setForm({
      phone: profile.phone || "",
      location: profile.location || "",
      title: profile.title || "",
      experienceLevel: profile.experienceLevel || "",
      summary: profile.summary || "",
      skills: Array.isArray(profile.skills)
        ? profile.skills.map((s: any) => (typeof s === "string" ? s : s._id))
        : [],
      education: profile.education || [],
      experience: profile.experience || [],
      avatar: profile.avatar || "",
      resume: profile.resume || null,
    });
  }, [profile]);

  const toggleSkill = (skillId: string) => {
    setForm((prev: any) => {
      const exists = prev.skills.includes(skillId);

      return {
        ...prev,
        skills: exists
          ? prev.skills.filter((id: string) => id !== skillId)
          : [...prev.skills, skillId],
      };
    });
  };

  const avatarPreview = useMemo(() => {
    // If we have a new file selected, use that
    if (form.avatar instanceof File) {
      return URL.createObjectURL(form.avatar);
    }
    // If we have an existing avatar from profile, use that
    if (profile?.avatar) {
      // If it's already a full URL, use it directly
      if (profile.avatar.startsWith('http')) {
        return profile.avatar;
      }
      // If it's a relative path, prepend the backend URL
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      return `${backendUrl}${profile.avatar}`;
    }
    // Fallback to form.avatar if it exists and is a URL
    if (form.avatar && form.avatar !== "") {
      // If it's already a full URL, use it directly
      if (form.avatar.startsWith('http')) {
        return form.avatar;
      }
      // If it's a relative path, prepend the backend URL
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      return `${backendUrl}${form.avatar}`;
    }
    return "/default-avatar.png";
  }, [form.avatar, profile?.avatar]);

  const handleSubmit = async () => {
    setUploading(true);
    setUploadError(null);
    
    const fd = new FormData();
    
    // Handle basic fields (only if they have actual values)
    if (form.phone && form.phone.trim()) fd.append("phone", form.phone.trim());
    if (form.location && form.location.trim()) fd.append("location", form.location.trim());
    if (form.title && form.title.trim()) fd.append("title", form.title.trim());
    if (form.experienceLevel && form.experienceLevel.trim()) fd.append("experienceLevel", form.experienceLevel.trim());
    if (form.summary && form.summary.trim()) fd.append("summary", form.summary.trim());
    
    // Handle skills (only if there are skills)
    if (Array.isArray(form.skills) && form.skills.length > 0) {
      fd.append("skills", JSON.stringify(form.skills));
    }
    
    // Handle education (only if there is education)
    if (Array.isArray(form.education) && form.education.length > 0) {
      fd.append("education", JSON.stringify(form.education));
    }
    
    // Handle experience (only if there is experience)
    if (Array.isArray(form.experience) && form.experience.length > 0) {
      fd.append("experience", JSON.stringify(form.experience));
    }
    
    // Handle avatar (only if it's a new file)
    if (form.avatar instanceof File) {
      fd.append("avatar", form.avatar);
    }
    
    // Handle resume (only if it's a new file)
    if (form.resume instanceof File) {
      fd.append("resume", form.resume);
    }
    
    console.log("FormData entries:");
    for (let [key, value] of fd.entries()) {
      console.log(key, value);
    }
    
    try {
      const result = await dispatch(updateMyProfile(fd)).unwrap();
      console.log("Profile updated successfully:", result);
      // Reset form avatar to the updated profile avatar
      setForm((prev: any) => ({
        ...prev,
        avatar: result.profile?.avatar || ""
      }));
    } catch (error: any) {
      console.error("Profile update failed:", error);
      setUploadError(error.message || "Failed to update profile. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              <img
                src={avatarPreview}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover shadow-lg cursor-pointer border-2 "
              />

              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setForm({ ...form, avatar: file });
                  }
                }}
              />
              <div className="absolute inset-0 rounded-full bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-0">
                <span className="text-white text-xs font-medium">
                  {form.avatar instanceof File ? "Change" : "Change"}
                </span>
              </div>
            </div>

            {/* User Info */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-800">
                  {user?.name}
                </h1>
                <span className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0" />
              </div>
              <p className="text-gray-600 mb-4">{user?.email}</p>

              {/* Progress */}
              <div className="mt-4 w-full max-w-sm">
                <div className="flex justify-between text-sm mb-1">
                  <span>Profile Completion</span>
                  <span>{completion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${completion}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t-2 border-gray-100 my-8"></div>

      {/* Basic Information */}
      <div className="bg-white p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <input
            type="text"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t-2 border-gray-100 my-8"></div>

      {/* Resume */}
      <div className="bg-white p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Resume (PDF only)</h2>
        {form.resume && (
          <div className="mb-4">
            {form.resume instanceof File ? (
              <p className="text-green-600">
                Resume file selected: {form.resume.name}
              </p>
            ) : form.resume.url ? (
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-800">Resume.pdf</p>
                    <a
                      href={form.resume.url}
                      target="_blank"
                      className="text-green-600 hover:text-green-700 text-sm"
                    >
                      View Resume
                    </a>
                  </div>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    id="resume-upload-new"
                    onChange={(e) => setForm({ ...form, resume: e.target.files?.[0] })}
                  />
                  <label
                    htmlFor="resume-upload-new"
                    className="cursor-pointer text-gray-600 hover:text-gray-800 text-sm"
                  >
                    Upload Another
                  </label>
                </div>
              </div>
            ) : null}
          </div>
        )}
        {!form.resume && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              id="resume-upload"
              onChange={(e) => setForm({ ...form, resume: e.target.files?.[0] })}
            />
            <label
              htmlFor="resume-upload"
              className="cursor-pointer text-gray-600 hover:text-gray-800"
            >
              <svg
                className="w-8 h-8 mx-auto mb-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span className="text-sm">Click to upload PDF resume</span>
            </label>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t-2 border-gray-100 my-8"></div>

      {/* Professional Details */}
      <div className="bg-white p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          Professional Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title
            </label>
            <input
              type="text"
              placeholder="e.g., Frontend Developer"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level
            </label>
            <select
              value={form.experienceLevel}
              onChange={(e) =>
                setForm({ ...form, experienceLevel: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Select experience level</option>
              <option value="Fresher">Fresher</option>
              <option value="1-3">1–3 years</option>
              <option value="3-5">3–5 years</option>
              <option value="5+">5+ years</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Summary
          </label>
          <textarea
            rows={4}
            placeholder="Tell us about your professional background and skills..."
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t-2 border-gray-100 my-8"></div>

      {/* Skills */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="font-semibold mb-4">Skills</h2>

        {/* Selected skills (top pills) */}
        {Array.isArray(form.skills) && form.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {skills
              .filter((s: any) => form.skills.includes(s._id))
              .map((skill: any) => (
                <span
                  key={skill._id}
                  onClick={() => toggleSkill(skill._id)}
                  className="cursor-pointer px-3 py-1 text-xs rounded-full
                    bg-gray-900 text-white hover:bg-gray-800 transition"
                >
                  {skill.name} ✕
                </span>
              ))}
          </div>
        )}

        {/* All skills */}
        {Array.isArray(skills) && skills.length === 0 ? (
          <p className="text-sm text-gray-500">Loading skills...</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {Array.isArray(skills) && skills.map((skill: any) => {
              const selected = Array.isArray(form.skills) && form.skills.includes(String(skill._id));
              return (
                <button
                  key={skill._id}
                  onClick={() => toggleSkill(skill._id)}
                  className={`px-3 py-1 rounded-full text-sm border transition ${
                    selected
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {skill.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Education */}
      <div className="bg-white p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-800">Education</h2>
          <button
            onClick={() =>
              setForm((prev: any) => ({
                ...prev,
                education: [
                  ...prev.education,
                  { degree: "", institution: "", year: "" },
                ],
              }))
            }
            className="bg-blue-600 text-white px-2 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            + Add
          </button>
        </div>

        {/* Show as cards when not editing */}
        {form.education.length === 0 ? (
          <p className="text-gray-500 italic">No education added yet</p>
        ) : (
          <div className="space-y-4">
            {form.education.map((edu: any, i: number) => (
              <div
                key={i}
                className={`bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-500 shadow-sm cursor-pointer transition-colors ${
                  editingEducation === i
                    ? "bg-gradient-to-r from-blue-100 to-indigo-100"
                    : "hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100"
                }`}
                onClick={() =>
                  setEditingEducation(editingEducation === i ? null : i)
                }
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {/* Read-only view */}
                    {editingEducation !== i && (
                      <div className="flex justify-between items-center">
                        {/* Left side */}
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {edu.degree || "Degree not specified"}
                          </p>
                          <p className="text-xs text-gray-600">
                            {edu.institution || "Institution not specified"}
                          </p>
                        </div>

                        {/* Right side */}
                        <div className="text-sm text-gray-700">
                          {edu.year || "Year"}
                        </div>
                      </div>
                    )}

                    {/* Editable fields (shown when clicked) */}
                    {editingEducation === i && (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Degree"
                          value={edu.degree}
                          onChange={(e) => {
                            const newEducation = [...form.education];
                            newEducation[i].degree = e.target.value;
                            setForm({ ...form, education: newEducation });
                          }}
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <input
                          type="text"
                          placeholder="Institution"
                          value={edu.institution}
                          onChange={(e) => {
                            const newEducation = [...form.education];
                            newEducation[i].institution = e.target.value;
                            setForm({ ...form, education: newEducation });
                          }}
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <input
                          type="number"
                          placeholder="Year"
                          value={edu.year}
                          onChange={(e) => {
                            const newEducation = [...form.education];
                            newEducation[i].year = e.target.value;
                            setForm({ ...form, education: newEducation });
                          }}
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newEducation = form.education.filter(
                        (_: any, index: number) => index !== i
                      );
                      setForm({ ...form, education: newEducation });
                      setEditingEducation(null);
                    }}
                    className="ml-2 text-red-500 hover:text-red-700 transition-colors text-sm"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t-2 border-gray-100 my-8"></div>

      {/* Experience */}
      <div className="bg-white p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-800">Experience</h2>
          <button
            onClick={() =>
              setForm((prev: any) => ({
                ...prev,
                experience: [
                  ...prev.experience,
                  {
                    company: "",
                    role: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                  },
                ],
              }))
            }
            className="bg-green-600 text-white px-2 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-md"
          >
            + Add
          </button>
        </div>

        {/* Show as cards when not editing */}
        {form.experience.length === 0 ? (
          <p className="text-gray-500 italic">No experience added yet</p>
        ) : (
          <div className="space-y-4">
            {form.experience.map((exp: any, i: number) => (
              <div
                key={i}
                className={`bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-500 shadow-sm cursor-pointer transition-colors ${
                  editingExperience === i
                    ? "bg-gradient-to-r from-green-100 to-emerald-100"
                    : "hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100"
                }`}
                onClick={() =>
                  setEditingExperience(editingExperience === i ? null : i)
                }
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {/* Read-only view */}
                    {editingExperience !== i && (
                      <div className="flex justify-between items-start">
                        {/* Left side */}
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {exp.role || "Role not specified"}
                          </p>
                          <p className="text-xs text-gray-600">
                            {exp.company || "Company not specified"}
                          </p>
                          {exp.description && (
                            <p className="text-xs text-gray-500 mt-1">
                              {exp.description}
                            </p>
                          )}
                        </div>

                        {/* Right side */}
                        <div className="text-xs text-gray-700 text-right">
                          <p>
                            {exp.startDate
                              ? new Date(exp.startDate).toLocaleDateString()
                              : "Start"}
                            {" - "}
                            {exp.endDate
                              ? new Date(exp.endDate).toLocaleDateString()
                              : "Present"}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Editable fields (shown when clicked) */}
                    {editingExperience === i && (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Company"
                          value={exp.company}
                          onChange={(e) => {
                            const newExperience = [...form.experience];
                            newExperience[i].company = e.target.value;
                            setForm({ ...form, experience: newExperience });
                          }}
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <input
                          type="text"
                          placeholder="Role"
                          value={exp.role}
                          onChange={(e) => {
                            const newExperience = [...form.experience];
                            newExperience[i].role = e.target.value;
                            setForm({ ...form, experience: newExperience });
                          }}
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="grid grid-cols-2 gap-2">
                        <input
                          type="date"
                          placeholder="Start Date"
                          value={exp.startDate}
                          onChange={(e) => {
                            const newExperience = [...form.experience];
                            newExperience[i] = { ...newExperience[i], startDate: e.target.value };
                            setForm({ ...form, experience: newExperience });
                          }}
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <input
                          type="date"
                          placeholder="End Date"
                          value={exp.endDate}
                          onChange={(e) => {
                            const newExperience = [...form.experience];
                            newExperience[i] = { ...newExperience[i], endDate: e.target.value };
                            setForm({ ...form, experience: newExperience });
                          }}
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          onClick={(e) => e.stopPropagation()}
                        />
                        </div>
                        <textarea
                          rows={2}
                          placeholder="Description"
                          value={exp.description}
                          onChange={(e) => {
                            const newExperience = [...form.experience];
                            newExperience[i].description = e.target.value;
                            setForm({ ...form, experience: newExperience });
                          }}
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newExperience = form.experience.filter(
                        (_: any, index: number) => index !== i
                      );
                      setForm({ ...form, experience: newExperience });
                      setEditingExperience(null);
                    }}
                    className="ml-2 text-red-500 hover:text-red-700 transition-colors text-sm"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={uploading}
          className={`px-6 py-2 rounded cursor-pointer transition-shadow shadow-md ${
            uploading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {uploading ? "Saving..." : "Save Profile"}
        </button>
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{uploadError}</p>
          <button
            onClick={() => setUploadError(null)}
            className="mt-2 text-red-500 hover:text-red-700 text-sm"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

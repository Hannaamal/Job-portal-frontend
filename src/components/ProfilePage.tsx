"use client";

import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyProfile,
  updateMyProfile,
  fetchSkills,
} from "@/redux/profileSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { calculateProfileCompletion } from "@/utils/profileCompletion";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { ProfileForm } from "@/types/profile";
import api from "@/lib/api";

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { user, profile, skills, loading } = useSelector(
    (state: RootState) => state.profile
  );

  const [form, setForm] = useState<ProfileForm>({
    skills: [],
    education: [],
    experience: [],
    avatar: null,
    resume: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    dispatch(fetchMyProfile());
    dispatch(fetchSkills());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setForm({
        ...profile,
        avatar: profile.avatar || "",
      });
    }
  }, [profile]);

  if (loading || !user) return <p className="p-6">Loading profile...</p>;

  const completion = calculateProfileCompletion(profile);

  /* ================= HANDLERS ================= */
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, avatar: e.target.files[0] });
    }
  };
  const handleAvatarSave = async () => {
    if (!(form.avatar instanceof File)) return;

    try {
      const formData = new FormData();
      formData.append("avatar", form.avatar);

      // Separate endpoint for avatar
      await api.put("/api/profile/me/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      router.refresh(); // refresh profile after upload
    } catch (err) {
      console.error("Avatar upload failed", err);
    }
  };

  const removeAvatar = () => setForm({ ...form, avatar: "" });

  const toggleSkill = (skillId: string) => {
    const exists = form.skills?.includes(skillId);
    setForm({
      ...form,
      skills: exists
        ? form.skills.filter((id: string) => id !== skillId)
        : [...(form.skills || []), skillId],
    });
  };

  const addEducation = () => {
    setForm({
      ...form,
      education: [
        ...(form.education || []),
        { degree: "", institution: "", year: "" },
      ],
    });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...form.education];
    updated[index][field] = value;
    setForm({ ...form, education: updated });
  };

  const deleteEducation = (index: number) => {
    const updated = form.education.filter((_: any, i: number) => i !== index);
    setForm({ ...form, education: updated });
  };

  const addExperience = () => {
    setForm({
      ...form,
      experience: [
        ...(form.experience || []),
        { company: "", role: "", description: "" },
      ],
    });
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const updated = [...form.experience];
    updated[index][field] = value;
    setForm({ ...form, experience: updated });
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      // ✅ SIMPLE FIELDS
      const simpleFields: (keyof ProfileForm)[] = [
        "phone",
        "location",
        "title",
        "summary",
        "experienceLevel",
      ];

      simpleFields.forEach((field) => {
        const value = form[field];

        if (typeof value === "string" && value.trim()) {
          formData.append(field, value);
        }
      });

      // ✅ ARRAYS (JSON)
      formData.append("skills", JSON.stringify(form.skills || []));

      formData.append(
        "education",
        JSON.stringify(
          (form.education || []).filter(
            (e: any) => e.degree || e.institution || e.year
          )
        )
      );

      formData.append(
        "experience",
        JSON.stringify(
          (form.experience || []).filter(
            (e: any) => e.company || e.role || e.description
          )
        )
      );

      // ✅ FILES (NO JSON.stringify)
      if (form.avatar instanceof File) {
        formData.append("avatar", form.avatar);
      }

      if (form.resume instanceof File) {
        formData.append("resume", form.resume);
      }

      await dispatch(updateMyProfile(formData)).unwrap();
      router.refresh();
    } catch (error) {
      console.error("Profile update failed", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* ================= HEADER ================= */}

      <div className="bg-white shadow rounded-lg p-6 flex items-center gap-6 relative">
        {/* Avatar */}
        <div className="relative w-24 h-24">
          {/* Avatar */}
          <div className="relative w-24 h-24">
            <img
              src={
                form.avatar
                  ? typeof form.avatar === "string"
                    ? form.avatar
                    : URL.createObjectURL(form.avatar)
                  : "/default-avatar.png"
              }
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border border-gray-300"
            />

            {/* Change Avatar */}
            <button
              type="button"
              onClick={handleAvatarClick}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center border-2 border-white hover:bg-green-700 transition"
              title="Change Profile Picture"
            >
              +
            </button>

            {/* Remove Avatar */}
            {form.avatar && (
              <button
                type="button"
                onClick={removeAvatar}
                className="absolute top-0 right-0 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center border-2 border-white hover:bg-red-700"
                title="Remove Profile Picture"
              >
                ×
              </button>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>

          {/* Profile Completion */}
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

      {/* ================= SAVE PROFILE BUTTON ================= */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-green-700 transition"
        >
          Save Profile
        </button>
      </div>

      {/* ================= BASIC INFO ================= */}
      <div className="bg-white shadow rounded-lg p-6 space-y-3">
        <h2 className="font-semibold">Basic Information</h2>
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone || ""}
          onChange={handleChange}
          className="input w-full cursor-text"
        />
        <input
          name="location"
          placeholder="Location"
          value={form.location || ""}
          onChange={handleChange}
          className="input w-full cursor-text"
        />
      </div>

      {/* resume */}

      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">
          Resume (PDF only)
        </label>

        {form.resume &&
          typeof form.resume === "object" &&
          "url" in form.resume && (
            <div className="mb-3 flex items-center gap-3">
              <a
                href={form.resume.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Resume
              </a>

              <span className="text-xs text-gray-500">
                Uploaded on{" "}
                {new Date(form.resume.uploadedAt).toLocaleDateString()}
              </span>
            </div>
          )}

        <input
          type="file"
          accept=".pdf"
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              resume: e.target.files?.[0] || null,
            }))
          }
          className="block w-full text-sm"
        />
      </div>

      {/* ================= PROFESSIONAL ================= */}
      <div className="bg-white shadow rounded-lg p-6 space-y-3">
        <h2 className="font-semibold">Professional Details</h2>
        <input
          name="title"
          placeholder="Job Title"
          value={form.title || ""}
          onChange={handleChange}
          className="input w-full cursor-text"
        />
        <select
          name="experienceLevel"
          value={form.experienceLevel || ""}
          onChange={handleChange}
          className="input w-full cursor-text"
        >
          <option value="">Experience Level</option>
          <option value="Fresher">Fresher</option>
          <option value="1-3">1–3 years</option>
          <option value="3-5">3–5 years</option>
          <option value="5+">5+ years</option>
        </select>
        <textarea
          name="summary"
          placeholder="Professional Summary"
          value={form.summary || ""}
          onChange={handleChange}
          className="input w-full h-28 cursor-text"
        />
      </div>

      {/* ================= SKILLS ================= */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="font-semibold mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill: any) => {
            const selected = form.skills?.includes(skill._id);
            return (
              <button
                key={skill._id}
                onClick={() => toggleSkill(skill._id)}
                className={`px-3 py-1 rounded-full text-sm border cursor-pointer ${
                  selected
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {skill.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= EDUCATION ================= */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="font-semibold mb-4">Education</h2>
        {form.education?.map((edu: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-3">
            <input
              placeholder="Degree"
              value={edu.degree || ""}
              onChange={(e) => updateEducation(index, "degree", e.target.value)}
              className="input cursor-text flex-1"
            />
            <input
              placeholder="Institution"
              value={edu.institution || ""}
              onChange={(e) =>
                updateEducation(index, "institution", e.target.value)
              }
              className="input cursor-text flex-1"
            />
            <input
              placeholder="Year"
              value={edu.year || ""}
              onChange={(e) => updateEducation(index, "year", e.target.value)}
              className="input cursor-text w-24"
            />
            <button
              onClick={() => deleteEducation(index)}
              className="text-red-600 cursor-pointer hover:text-red-800"
              title="Delete Education"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button
          onClick={addEducation}
          className="text-green-600 text-sm cursor-pointer"
        >
          + Add Education
        </button>
      </div>

      {/* ================= EXPERIENCE ================= */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="font-semibold mb-4">Experience</h2>
        {form.experience?.map((exp: any, index: number) => (
          <div key={index} className="space-y-2 mb-4">
            <input
              placeholder="Company"
              value={exp.company || ""}
              onChange={(e) =>
                updateExperience(index, "company", e.target.value)
              }
              className="input w-full"
            />
            <input
              placeholder="Role"
              value={exp.role || ""}
              onChange={(e) => updateExperience(index, "role", e.target.value)}
              className="input w-full"
            />
            <textarea
              placeholder="Description"
              value={exp.description || ""}
              onChange={(e) =>
                updateExperience(index, "description", e.target.value)
              }
              className="input w-full h-20"
            />
          </div>
        ))}
        <button
          onClick={addExperience}
          className="text-green-600 text-sm cursor-pointer"
        >
          + Add Experience
        </button>
      </div>

      {/* ================= SAVE ================= */}
      <button
        onClick={handleSave}
        className="bg-green-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-green-700 transition"
      >
        Save Profile
      </button>
    </div>
  );
}

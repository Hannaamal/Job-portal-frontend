"use client";

import { useEffect, useState } from "react";
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

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();

  const { user, profile, skills, loading } = useSelector(
    (state: RootState) => state.profile
  );
  const router = useRouter();


  const [form, setForm] = useState<any>({
    skills: [],
    education: [],
    experience: [],
  });

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    dispatch(fetchMyProfile());
    dispatch(fetchSkills());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setForm(profile);
    }
  }, [profile]);

  if (loading || !user) {
    return <p className="p-6">Loading profile...</p>;
  }

  const completion = calculateProfileCompletion(profile);

  /* ================= BASIC HANDLERS ================= */
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSave = async () => {
  try {
    await dispatch(updateMyProfile(form)).unwrap();
    router.push("/");
  } catch (error) {
    console.error("Profile update failed", error);
  }
};

  /* ================= SKILLS ================= */
  const toggleSkill = (skillId: string) => {
    const exists = form.skills?.includes(skillId);

    setForm({
      ...form,
      skills: exists
        ? form.skills.filter((id: string) => id !== skillId)
        : [...(form.skills || []), skillId],
    });
  };

  /* ================= EDUCATION ================= */
  const addEducation = () => {
    setForm({
      ...form,
      education: [
        ...(form.education || []),
        { degree: "", institution: "", year: "" },
      ],
    });
  };

  const updateEducation = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...form.education];
    updated[index][field] = value;
    setForm({ ...form, education: updated });
  };

  /* ================= EXPERIENCE ================= */
  const addExperience = () => {
    setForm({
      ...form,
      experience: [
        ...(form.experience || []),
        {
          company: "",
          role: "",
          description: "",
        },
      ],
    });
  };

  const updateExperience = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...form.experience];
    updated[index][field] = value;
    setForm({ ...form, experience: updated });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* ================= HEADER ================= */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-gray-500">{user.email}</p>

        {/* PROFILE COMPLETION */}
        <div className="mt-4">
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

      {/* ================= BASIC INFO ================= */}
      <div className="bg-white shadow rounded-lg p-6 space-y-3">
        <h2 className="font-semibold">Basic Information</h2>

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone || ""}
          onChange={handleChange}
          className="input w-full"
        />

        <input
          name="location"
          placeholder="Location"
          value={form.location || ""}
          onChange={handleChange}
          className="input w-full"
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
          className="input w-full"
        />

        <select
          name="experienceLevel"
          value={form.experienceLevel || ""}
          onChange={handleChange}
          className="input w-full"
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
          className="input w-full h-28"
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
                className={`px-3 py-1 rounded-full text-sm border
                  ${
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
          <div key={index} className="grid grid-cols-3 gap-3 mb-3">
            <input
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) =>
                updateEducation(index, "degree", e.target.value)
              }
              className="input"
            />
            <input
              placeholder="Institution"
              value={edu.institution}
              onChange={(e) =>
                updateEducation(index, "institution", e.target.value)
              }
              className="input"
            />
            <input
              placeholder="Year"
              value={edu.year}
              onChange={(e) =>
                updateEducation(index, "year", e.target.value)
              }
              className="input"
            />
          </div>
        ))}

        <button
          onClick={addEducation}
          className="text-green-600 text-sm"
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
              value={exp.company}
              onChange={(e) =>
                updateExperience(index, "company", e.target.value)
              }
              className="input w-full"
            />
            <input
              placeholder="Role"
              value={exp.role}
              onChange={(e) =>
                updateExperience(index, "role", e.target.value)
              }
              className="input w-full"
            />
            <textarea
              placeholder="Description"
              value={exp.description}
              onChange={(e) =>
                updateExperience(index, "description", e.target.value)
              }
              className="input w-full h-20"
            />
          </div>
        ))}

        <button
          onClick={addExperience}
          className="text-green-600 text-sm"
        >
          + Add Experience
        </button>
      </div>

      {/* ================= SAVE ================= */}
      <button
        onClick={handleSave}
        className="bg-green-600 text-white px-6 py-2 rounded-lg"
      >
        Save Profile
      </button>
    </div>
  );
}

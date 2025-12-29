"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "@/lib/api";

interface EditJobSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  job: any;
  onSave: (data: any) => void;
}

export default function EditJobSlideOver({
  isOpen,
  onClose,
  job,
  onSave,
}: EditJobSlideOverProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    isRemote: false,
    jobType: "",
    experienceLevel: "",
    salaryMin: "",
    salaryMax: "",
    requiredSkills: [] as string[],
    company: "",
    expiresAt: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [skills, setSkills] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);

  // Prefill form and fetch skills + companies
  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const [skillsRes, companiesRes] = await Promise.all([
          api.get("/api/skills"),
          api.get("/api/company/view"),
        ]);
        const allSkills = skillsRes.data.skills || skillsRes.data;
        const allCompanies = companiesRes.data.companies || companiesRes.data;
        setSkills(allSkills);
        setCompanies(allCompanies);

        if (job) {
          setForm({
            title: job.title || "",
            description: job.description || "",
            location: job.location || "",
            isRemote: job.isRemote || false,
            jobType: job.jobType || "",
            experienceLevel: job.experienceLevel || "",
            salaryMin: job.salaryRange?.min || "",
            salaryMax: job.salaryRange?.max || "",
            requiredSkills:
              job.requiredSkills
                ?.map((s: any) => s._id)
                .filter((id: string) => allSkills.some((sk) => sk._id === id)) ||
              [],
            company:
              allCompanies.find((c) => c._id === job.company?._id)?._id || "",
            expiresAt: job.expiresAt ? job.expiresAt.slice(0, 10) : "",
          });
        }
      } catch (err) {
        console.error("Failed to load data");
      }
    };

    fetchData();
  }, [isOpen, job]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleSkill = (skillId: string) => {
    setForm((prev) => {
      const exists = prev.requiredSkills.includes(skillId);
      return {
        ...prev,
        requiredSkills: exists
          ? prev.requiredSkills.filter((id) => id !== skillId)
          : [...prev.requiredSkills, skillId],
      };
    });
  };

  const isSkillSelected = (skillId: string) => form.requiredSkills.includes(skillId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        title: form.title,
        description: form.description,
        location: form.location,
        isRemote: form.isRemote,
        jobType: form.jobType,
        experienceLevel: form.experienceLevel,
        salaryRange: {
          min: Number(form.salaryMin),
          max: Number(form.salaryMax),
        },
        requiredSkills: form.requiredSkills,
        company: form.company,
        expiresAt: form.expiresAt || undefined,
      };

      await onSave(payload);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full max-w-md bg-white
      border-l border-gray-200
      transform transition-transform duration-300 z-50
      ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-base font-medium text-gray-900">Edit Job</h2>
          <p className="text-xs text-gray-500 mt-0.5">Update job details</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <X size={16} />
        </button>
      </div>
      <div className="h-px bg-gray-100" />

      {/* Content */}
      <div className="px-6 py-5 overflow-y-auto h-[calc(100%-72px)]">
        {error && (
          <div className="mb-4 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-sm">
          {/* Title */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Job title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Frontend Developer"
              className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the role"
              className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2"
              required
            />
          </div>

          {/* Location + Remote */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Bangalore"
                className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2"
              />
            </div>
            <label className="flex items-center gap-2 mt-6 text-xs text-gray-600">
              <input
                type="checkbox"
                name="isRemote"
                checked={form.isRemote}
                onChange={handleChange}
                className="rounded border-gray-300"
              />
              Remote
            </label>
          </div>

          {/* Job Type & Experience */}
          <div className="grid grid-cols-2 gap-3">
            <select
              name="jobType"
              value={form.jobType}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2"
            >
              <option value="">Select Job Type</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Internship</option>
              <option>Contract</option>
            </select>
            <select
              name="experienceLevel"
              value={form.experienceLevel}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2"
            >
              <option value="">Select Experience</option>
              <option>Fresher</option>
              <option>1-3</option>
              <option>3-5</option>
              <option>5+</option>
            </select>
          </div>

          {/* Salary */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              name="salaryMin"
              value={form.salaryMin}
              onChange={handleChange}
              placeholder="Min Salary"
              className="bg-gray-50 border border-gray-200 rounded-md px-3 py-2"
            />
            <input
              type="number"
              name="salaryMax"
              value={form.salaryMax}
              onChange={handleChange}
              placeholder="Max Salary"
              className="bg-gray-50 border border-gray-200 rounded-md px-3 py-2"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-xs text-gray-500 mb-2">Skills</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {skills
                .filter((s) => form.requiredSkills.includes(s._id))
                .map((skill) => (
                  <span
                    key={skill._id}
                    onClick={() => toggleSkill(skill._id)}
                    className="cursor-pointer px-3 py-1 text-xs rounded-full bg-gray-900 text-white"
                  >
                    {skill.name} ✕
                  </span>
                ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <button
                  key={skill._id}
                  type="button"
                  onClick={() => toggleSkill(skill._id)}
                  className={`px-3 py-1 rounded-full text-xs border ${
                    isSkillSelected(skill._id)
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {skill.name}
                </button>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Company</label>
            <select
              name="company"
              value={form.company}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2"
            >
              <option value="">Select Company</option>
              {companies.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Expiry */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Expiry Date</label>
            <input
              type="date"
              name="expiresAt"
              value={form.expiresAt}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gray-900 text-white py-2 rounded-md text-sm"
          >
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

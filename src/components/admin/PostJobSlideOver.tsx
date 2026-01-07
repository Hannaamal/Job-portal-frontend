"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "@/lib/api";
import { postJobSchema } from "@/validators/postJobValidator";

interface PostJobSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
}
const initialFormState = {
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
};

export default function PostJobSlideOver({
  isOpen,
  onClose,
}: PostJobSlideOverProps) {


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [skills, setSkills] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
  if (!isOpen) {
    setForm(initialFormState); // 🔥 reset form
    setError("");
    setLoading(false);
  }
}, [isOpen]);



  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const [skillsRes, companiesRes] = await Promise.all([
          api.get("/api/skills"),
          api.get("/api/company/view"),
        ]);

        setSkills(skillsRes.data.skills || skillsRes.data);
        setCompanies(companiesRes.data.companies || companiesRes.data);
      } catch (err) {
        console.error("Failed to load data");
      }
    };

    fetchData();
  }, [isOpen]);

  // ✅ Works for input + textarea + select
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
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

  const isSkillSelected = (skillId: string) =>
    form.requiredSkills.includes(skillId);

  const handleSkillChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map(
      (opt) => opt.value
    );

    setForm((prev) => ({
      ...prev,
      requiredSkills: selected,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await postJobSchema.validate(form, { abortEarly: false });

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

      const res = await api.post("/api/job/", payload);
      alert(res.data.message);
      onClose();
    } catch (err: any) {
      if (err.name === "ValidationError") {
        // ✅ Yup errors
        setError(err.errors.join(", "));
      } else {
        // ✅ API / server errors
        setError(err.response?.data?.message || "Something went wrong");
      }
    } finally {
      // ✅ ALWAYS runs
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
          <h2 className="text-base font-medium text-gray-900">Post new Job</h2>
          <p className="text-xs text-gray-500 mt-0.5">add a new job</p>
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
            <label className="block text-xs text-gray-500 mb-1">
              Job title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Frontend Developer"
              className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2
            focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the role and responsibilities"
              className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2
            focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Location + Remote */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">
                Location
              </label>
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
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Job type
              </label>
              <select
                name="jobType"
                value={form.jobType}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2"
              >
                <option value="">Select</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
                <option>Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Experience
              </label>
              <select
                name="experienceLevel"
                value={form.experienceLevel}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2"
              >
                <option value="">Select</option>
                <option>Fresher</option>
                <option>1-3</option>
                <option>3-5</option>
                <option>5+</option>
              </select>
            </div>
          </div>

          {/* Salary */}
          <div className="grid grid-cols-2 gap-3">
            <input
              name="salaryMin"
              type="number"
              value={form.salaryMin}
              onChange={handleChange}
              placeholder="Min salary"
              className="bg-gray-50 border border-gray-200 rounded-md px-3 py-2"
            />
            <input
              name="salaryMax"
              type="number"
              value={form.salaryMax}
              onChange={handleChange}
              placeholder="Max salary"
              className="bg-gray-50 border border-gray-200 rounded-md px-3 py-2"
            />
          </div>
          {/* Skills */}
          <div>
            <label className="block text-xs text-gray-500 mb-2">
              Required skills
            </label>

            {/* Selected skills */}
            {form.requiredSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {skills
                  .filter((s) => form.requiredSkills.includes(s._id))
                  .map((skill) => (
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

            {/* Available skills */}
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => {
                const selected = isSkillSelected(skill._id);

                return (
                  <button
                    key={skill._id}
                    type="button"
                    onClick={() => toggleSkill(skill._id)}
                    className={`px-3 py-1 rounded-full text-xs border transition
            ${
              selected
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
            }`}
                  >
                    {skill.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Company */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Company ID
            </label>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Company
              </label>

              <select
                name="company"
                value={form.company}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm"
                required
              >
                <option value="">Select company</option>
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Expiry */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Expiry date
            </label>
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
            className="w-full mt-2 bg-gray-900 text-white py-2 rounded-md text-sm
          hover:bg-gray-800 transition"
          >
            {loading ? "Posting…" : "Post job"}
          </button>
        </form>
      </div>
    </div>
  );
}

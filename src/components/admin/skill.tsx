"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "@/redux/admin/skillsSlice";
import { RootState, AppDispatch } from "@/redux/store";

export default function SkillsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { skills, loading } = useSelector((state: RootState) => state.skills);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchSkills());
  }, [dispatch]);

  const handleSubmit = () => {
    if (!name.trim()) return;

    if (editId) {
      dispatch(updateSkill({ id: editId, data: { name, category } }));
    } else {
      dispatch(createSkill({ name, category }));
    }

    setName("");
    setCategory("");
    setEditId(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Skills Management</h1>

      {/* Add / Edit */}
      <div className="flex gap-3">
        <input
          placeholder="Skill name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input flex-1"
        />
        <input
          placeholder="Category (optional)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input flex-1"
        />
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 rounded"
        >
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {skills.map((skill) => (
            <li
              key={skill._id}
              className="flex justify-between items-center bg-white p-3 rounded shadow"
            >
              <div>
                <p className="font-medium">{skill.name}</p>
                {skill.category && (
                  <p className="text-xs text-gray-500">{skill.category}</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditId(skill._id);
                    setName(skill.name);
                    setCategory(skill.category || "");
                  }}
                  className="text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => dispatch(deleteSkill(skill._id))}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

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
import { Pagination, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

export default function SkillsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { skills, loading } = useSelector((state: RootState) => state.skills);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjust per page

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

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

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      dispatch(deleteSkill(deleteId));
      setDeleteId(null);
    }
    setOpenDialog(false);
  };

  const cancelDelete = () => {
    setDeleteId(null);
    setOpenDialog(false);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSkills = skills.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(skills.length / itemsPerPage);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Skills Management</h1>

      {/* Add / Edit Form */}
      <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">
          {editId ? "Edit Skill" : "Add New Skill"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            placeholder="Skill name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="col-span-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none shadow-sm"
          />
          <input
            placeholder="Category (optional)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none shadow-sm"
          />
        </div>

        <button
          onClick={handleSubmit}
          className={`w-full md:w-auto bg-green-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-green-700 transition`}
        >
          {editId ? "Update Skill" : "Add Skill"}
        </button>
      </div>

      {/* Skills List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-500">Loading skills...</p>
        ) : skills.length === 0 ? (
          <p className="text-gray-500">No skills added yet.</p>
        ) : (
          <>
            <ul className="space-y-3">
              {currentSkills.map((skill) => (
                <li
                  key={skill._id}
                  className="flex justify-between items-center bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
                >
                  <div>
                    <p className="font-medium text-gray-800">{skill.name}</p>
                    {skill.category && (
                      <p className="text-sm text-gray-500">{skill.category}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditId(skill._id);
                        setName(skill.name);
                        setCategory(skill.category || "");
                      }}
                      className="px-4 py-1 rounded-lg font-medium border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteClick(skill._id)}
                      className="px-4 py-1 rounded-lg font-medium border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, page) => setCurrentPage(page)}
                  color="primary"
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this skill? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="inherit">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

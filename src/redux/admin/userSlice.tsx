import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api"; // axios instance

// 🔹 Fetch all users
export const fetchAdminUsers = createAsyncThunk(
  "adminUsers/fetchAll",
  async ({ page = 1, limit = 5 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/admin/users", { params: { page, limit } });
      return res.data; // should include { users, totalUsers }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch users");
    }
  }
);


// 🔹 Fetch single user + profile
export const fetchAdminUserProfile = createAsyncThunk(
  "adminUsers/fetchProfile",
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/admin/users/${userId}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const adminUserSlice = createSlice({
  name: "adminUsers",
  initialState: {
    users: [] as any[],
    selectedUser: null as any,
    loading: false,
    error: null as string | null,
    page: 1,
    totalUsers: 0,
    totalPages: 0,
  },
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // all users
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users; // fix here
        state.totalUsers = action.payload.totalUsers;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // single profile
      .addCase(fetchAdminUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchAdminUserProfile.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearSelectedUser } = adminUserSlice.actions;
export default adminUserSlice.reducer;

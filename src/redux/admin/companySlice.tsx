// redux/admin/companyAdminSlice.ts
import api from "@/lib/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface Company {
  _id: string;
  name: string;
  email: string;
  website: string;
  logo?: string;
}

interface Subscriber {
  _id: string;
  name: string;
  email: string;
}

interface CompanyAdminState {
  companies: Company[];
  subscribers: Subscriber[];
  subscriberCounts: Record<string, number>; // ✅ ADD THIS
  loading: boolean;
  error: string | null;
}

const initialState: CompanyAdminState = {
  companies: [],
  subscribers: [],
  subscriberCounts: {}, // ✅
  loading: false,
  error: null,
};

// Thunks
export const fetchCompanies = createAsyncThunk(
  "adminCompany/fetchCompanies",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/company/view");
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addCompany = createAsyncThunk(
  "adminCompany/addCompany",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/company/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateCompany = createAsyncThunk(
  "adminCompany/updateCompany",
  async (
    { id, formData }: { id: string; formData: FormData },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.put(`/api/company/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteCompany = createAsyncThunk(
  "adminCompany/deleteCompany",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.put(`/api/company/delete/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchSubscriberCount = createAsyncThunk(
  "adminCompany/fetchSubscriberCount",
  async (companyId: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/api/admin/company-subscriptions/${companyId}/subscribers`
      );

      return {
        companyId,
        count: data.totalSubscribers,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice
const companyAdminSlice = createSlice({
  name: "adminCompany",
  initialState,
  reducers: {
    clearSubscribers: (state) => {
      state.subscribers = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCompanies
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // addCompany
      .addCase(addCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCompany.fulfilled, (state, action) => {
        state.companies.push(action.payload.company);
      })

      .addCase(addCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // updateCompany
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = state.companies.map((c) =>
          c._id === action.payload._id ? action.payload : c
        );
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // deleteCompany
      .addCase(deleteCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = state.companies.filter(
          (c) => c._id !== action.payload
        );
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchSubscriberCount
      .addCase(fetchSubscriberCount.fulfilled, (state, action) => {
        const { companyId, count } = action.payload;
        state.subscriberCounts[companyId] = count;
      });
  },
});

export const { clearSubscribers } = companyAdminSlice.actions;

export default companyAdminSlice.reducer;

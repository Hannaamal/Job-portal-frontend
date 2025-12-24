import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

/* =========================
   ASYNC THUNKS
========================= */

// Fetch all companies
export const fetchCompanies = createAsyncThunk(
  "company/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/company/view");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch single company

export const fetchCompanyById = createAsyncThunk(
  "company/fetchById",
  async (companyId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/company/${companyId}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
export const updateCompany = createAsyncThunk(
  "company/update",
  async (
    { companyId, data }: { companyId: string; data: any },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put(`/api/company/update/${companyId}`, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch user subscriptions
export const fetchSubscriptions = createAsyncThunk(
  "company/fetchSubscriptions",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/company/subscriptions/my");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
//  Subscribe to company
export const subscribeCompany = createAsyncThunk(
  "company/subscribe",
  async (companyId: string, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/company/subscribe/${companyId}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to subscribe"
      );
    }
  }
);

// Unsubscribe from company
export const unsubscribeCompany = createAsyncThunk(
  "company/unsubscribe",
  async (companyId: string, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/company/unsubscribe/${companyId}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to unsubscribe"
      );
    }
  }
);

/* =========================
   SLICE
========================= */

interface CompanyState {
  companies: any[];
  selectedCompany: any | null;
  subscriptions: any[];
  loading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  companies: [],
  selectedCompany: null,
  subscriptions: [],
  loading: false,
  error: null,
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    clearSelectedCompany(state) {
      state.selectedCompany = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* FETCH ALL */
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* FETCH BY ID */
      .addCase(fetchCompanyById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCompany = action.payload;
      })
      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //update
      .addCase(updateCompany.fulfilled, (state, action) => {
        // Update selected company
        if (
          state.selectedCompany &&
          state.selectedCompany._id === action.payload._id
        ) {
          state.selectedCompany = action.payload;
        }

        // Also update the company in the companies list
        const index = state.companies.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) state.companies[index] = action.payload;
      })

      /* SUBSCRIPTIONS */
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      /* ===== SUBSCRIBE ===== */
      .addCase(subscribeCompany.fulfilled, (state) => {
        if (state.selectedCompany) {
          state.selectedCompany.isSubscribed = true;
        }
      })

      /* ===== UNSUBSCRIBE ===== */
      .addCase(unsubscribeCompany.fulfilled, (state) => {
        if (state.selectedCompany) {
          state.selectedCompany.isSubscribed = false;
        }
      });
  },
});

export const { clearSelectedCompany } = companySlice.actions;
export default companySlice.reducer;

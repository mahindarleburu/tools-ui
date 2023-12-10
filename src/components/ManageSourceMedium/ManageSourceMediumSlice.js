import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { GET, POST, PUT, SET_AUTH_TOKEN } from "../../utils/axiosInstance";
import {
  deleteSourceMediumUrl,
  getAllSourceMediumUrl,
  updateSourceMediumUrl,
  createSourceMediumUrl
} from "../../utils/urls";
import { getAuth } from "firebase/auth";

export const ManageAllSourceMedium = createAsyncThunk(
  "manage_source_medium/ManageAllSourceMedium",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await GET(getAllSourceMediumUrl, payload);
      if (response?.success === true) {
        toast.success(response?.data?.message);
        return response.data;
      } else {
        return rejectWithValue(response);
      }
    } catch (e) {
      console.log("Error", e.response.data);
      return rejectWithValue(e.response.data);
    }
  }
);

export const createSourceMedium = createAsyncThunk(
  "manage_source_medium/createSourceMedium",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await POST(createSourceMediumUrl, payload);
      if (response?.success === true) {
        toast.success(response?.message);
        const auth = getAuth();
        const user = auth.currentUser;
        dispatch(ManageAllSourceMedium({ user_id: user.uid }));
        return response.data;
      } else {
        return rejectWithValue(response);
      }
    } catch (e) {
      console.log("Error", e.response.data);
      return rejectWithValue(e.response.data);
    }
  }
);

export const updateSourceMedium = createAsyncThunk(
  "manage_source_medium/updateSourceMedium",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await PUT(updateSourceMediumUrl, payload);
      if (response?.success === true) {
        toast.success(response?.message);
        const auth = getAuth();
        const user = auth.currentUser;
        dispatch(ManageAllSourceMedium({ user_id: user.uid }));
        return response.data;
      } else {
        return rejectWithValue(response);
      }
    } catch (e) {
      console.log("Error", e.response.data);
      return rejectWithValue(e.response.data);
    }
  }
);

export const deleteSourceMedium = createAsyncThunk(
  "manage_source_medium/deleteSourceMedium",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await POST(deleteSourceMediumUrl, payload);
      if (response?.success === true) {
        toast.success("SourceMedium deleted success");
        const auth = getAuth();
        const user = auth.currentUser;
        dispatch(ManageAllSourceMedium({ user_id: user.uid }));
        return response.data;
      } else {
        return rejectWithValue(response);
      }
    } catch (e) {
      console.log("Error", e.response.data);
      return rejectWithValue(e.response.data);
    }
  }
);

export const ManageSourceMediumSlice = createSlice({
  name: "manage_source_medium",
  initialState: {
    name: "",
    display_name: "",
    created_at: "",
    updated_at: "",
    ManageSourceMedium: [],
    isFetching: false,
    isSuccess: false,
    isError: false,
    errors: {},
    errorMessage: "",
  },
  reducers: {
    clearState: (state) => {
      state.name = "";
      state.display_name = "";
      state.created_at = "";
      state.updated_at = "";
      state.ManageSourceMedium = [];
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = false;
      state.errors = {};
      state.errorMessage = "";
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(ManageAllSourceMedium.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.ManageSourceMedium = payload;
    });
    builder.addCase(ManageAllSourceMedium.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(ManageAllSourceMedium.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    });
    builder.addCase(createSourceMedium.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.name = payload.name;
      state.display_name = payload.display_name;
      state.created_at = payload.created_at;
      state.updated_at = payload.updated_at;
    });
    builder.addCase(createSourceMedium.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(createSourceMedium.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    });
    builder.addCase(updateSourceMedium.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.name = payload.name;
      state.display_name = payload.display_name;
      state.created_at = payload.created_at;
      state.updated_at = payload.updated_at;
    });
    builder.addCase(updateSourceMedium.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(updateSourceMedium.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    });
    builder.addCase(deleteSourceMedium.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.short_qr_code = payload.src;
    });
    builder.addCase(deleteSourceMedium.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(deleteSourceMedium.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    });
  },
});

export const { clearState } = ManageSourceMediumSlice.actions;

export const ManageSourceMediumSelector = (state) => state.manage_source_medium;

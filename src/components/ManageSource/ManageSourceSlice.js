import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { GET, POST, PUT, SET_AUTH_TOKEN } from "../../utils/axiosInstance";
import {
  deleteSourceUrl,
  getAllSourceUrl,
  updateSourceUrl,
  createSourceUrl
} from "../../utils/urls";
import { getAuth } from "firebase/auth";

export const listAllSource = createAsyncThunk(
  "source/listAllSource",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await GET(getAllSourceUrl, payload);
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

export const createSource = createAsyncThunk(
  "source/createSource",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await POST(createSourceUrl, payload);
      if (response?.success === true) {
        toast.success(response?.message);
        const auth = getAuth();
        const user = auth.currentUser;
        dispatch(listAllSource({ user_id: user.uid }));
        return response.data;
      } else {
        return rejectWithValue(response);
      }
    } catch (e) {
      console.log("Error", e.response.data);
      toast.error('something went wrong');
      return rejectWithValue(e.response.data);
    }
  }
);

export const updateSource = createAsyncThunk(
  "source/updateSource",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await PUT(updateSourceUrl, payload);
      if (response?.success === true) {
        toast.success(response?.message);
        const auth = getAuth();
        const user = auth.currentUser;
        dispatch(listAllSource({ user_id: user.uid }));
        return response.data;
      } else {
        return rejectWithValue(response);
      }
    } catch (e) {
      console.log("Error", e.response.data);
      toast.error('something went wrong');
      return rejectWithValue(e.response.data);
    }
  }
);

export const deleteSource = createAsyncThunk(
  "source/deleteSource",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await POST(deleteSourceUrl, payload);
      if (response?.success === true) {
        toast.success("Source deleted success");
        const auth = getAuth();
        const user = auth.currentUser;
        dispatch(listAllSource({ user_id: user.uid }));
        return response.data;
      } else {
        return rejectWithValue(response);
      }
    } catch (e) {
      console.log("Error", e.response.data);
      toast.error('something went wrong');
      return rejectWithValue(e.response.data);
    }
  }
);

export const listSourceSlice = createSlice({
  name: "source",
  initialState: {
    name: "",
    display_name: "",
    created_at: "",
    updated_at: "",
    listSource: [],
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
      state.listSource = [];
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = false;
      state.errors = {};
      state.errorMessage = "";
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listAllSource.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.listSource = payload;
    });
    builder.addCase(listAllSource.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(listAllSource.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    });
    builder.addCase(createSource.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.name = payload.name;
      state.display_name = payload.display_name;
      state.created_at = payload.created_at;
      state.updated_at = payload.updated_at;
    });
    builder.addCase(createSource.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(createSource.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    });
    builder.addCase(updateSource.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.name = payload.name;
      state.display_name = payload.display_name;
      state.created_at = payload.created_at;
      state.updated_at = payload.updated_at;
    });
    builder.addCase(updateSource.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(updateSource.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    });
    builder.addCase(deleteSource.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.short_qr_code = payload.src;
    });
    builder.addCase(deleteSource.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(deleteSource.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    });
  },
});

export const { clearState } = listSourceSlice.actions;

export const listSourceSelector = (state) => state.source;

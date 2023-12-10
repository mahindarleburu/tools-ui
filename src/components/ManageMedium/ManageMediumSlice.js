import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { GET, POST, PUT, SET_AUTH_TOKEN } from "../../utils/axiosInstance";
import {
  deleteMediumUrl,
  getAllMediumUrl,
  updateMediumUrl,
  createMediumUrl
} from "../../utils/urls";
import { getAuth } from "firebase/auth";

export const listAllMedium = createAsyncThunk(
  "medium/listAllMedium",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await GET(getAllMediumUrl, payload);
      if (response?.success === true) {
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

export const createMedium = createAsyncThunk(
  "medium/createMedium",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await POST(createMediumUrl, payload);
      if (response?.success === true) {
        toast.success(response?.message);
        const auth = getAuth();
        const user = auth.currentUser;
        dispatch(listAllMedium({ user_id: user.uid }));
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

export const updateMedium = createAsyncThunk(
  "medium/updateMedium",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await PUT(updateMediumUrl, payload);
      if (response?.success === true) {
        toast.success(response?.message);
        const auth = getAuth();
        const user = auth.currentUser;
        dispatch(listAllMedium({ user_id: user.uid }));
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

export const deleteMedium = createAsyncThunk(
  "medium/deleteMedium",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await POST(deleteMediumUrl, payload);
      if (response?.success === true) {
        toast.success("Medium deleted success");
        const auth = getAuth();
        const user = auth.currentUser;
        dispatch(listAllMedium({ user_id: user.uid }));
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

export const listMediumSlice = createSlice({
  name: "medium",
  initialState: {
    name: "",
    display_name: "",
    created_at: "",
    updated_at: "",
    listMedium: [],
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
      state.listMedium = [];
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = false;
      state.errors = {};
      state.errorMessage = "";
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listAllMedium.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.listMedium = payload;
    });
    builder.addCase(listAllMedium.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(listAllMedium.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    });
    builder.addCase(createMedium.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.name = payload.name;
      state.display_name = payload.display_name;
      state.created_at = payload.created_at;
      state.updated_at = payload.updated_at;
    });
    builder.addCase(createMedium.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(createMedium.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    });
    builder.addCase(updateMedium.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.name = payload.name;
      state.display_name = payload.display_name;
      state.created_at = payload.created_at;
      state.updated_at = payload.updated_at;
    });
    builder.addCase(updateMedium.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(updateMedium.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    });
    builder.addCase(deleteMedium.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.short_qr_code = payload.src;
    });
    builder.addCase(deleteMedium.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(deleteMedium.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    });
  },
});

export const { clearState } = listMediumSlice.actions;

export const listMediumSelector = (state) => state.medium;

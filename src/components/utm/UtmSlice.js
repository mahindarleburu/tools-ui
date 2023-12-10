import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { GET, POST, PUT, SET_AUTH_TOKEN } from "../../utils/axiosInstance";
import { createOneLinkUrl, createQrCodeUrl, getAllSourceWithMediumUrl, updateOnelinkUrl } from "../../utils/urls";
import { useDispatch } from "react-redux";
import { getAllSourceUrl } from "../../utils/urls";
import { getAllMediumBySourceIdUrl } from "../../utils/urls";
import { filterMedium } from "../../utils/function";


export const createOnelink = createAsyncThunk(
  "utms/createOnelink",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await POST(createOneLinkUrl, payload);
      if (response?.success === true) {
        toast.success("Successfully Created");
        // dispatch(createShortQrCode({ long_url: response?.data?.onelink }));
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

export const listAllSource = createAsyncThunk(
  "utms/listAllSource",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await GET(getAllSourceWithMediumUrl, payload);
      if (response?.success === true) {
        dispatch(listAllMediumBySourceName({sources:response?.data, source:payload}))
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

export const listAllMediumBySourceId = createAsyncThunk(
  "utms/listAllMediumBySourceId",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await GET(getAllMediumBySourceIdUrl + payload.id, payload);
      if (response?.success === true) {
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

export const editOnelink = createAsyncThunk(
  "editutms/editOnelink",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await PUT(updateOnelinkUrl, payload);
      if (response?.success === true) {
        toast.success("Onelink Successfully Updated");
        // dispatch(editShortQrcode({ long_url: response?.data?.onelink }));
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

export const utmSlice = createSlice({
  name: "utms",
  initialState: {
    onelink_code: "",
    long_url: "",
    onelink: "",
    user_id: "",
    created_at: "",
    updated_at: "",
    long_qr_code: "",
    short_qr_code: "",
    sources: [],
    mediums: [],
    isFetching: false,
    isSuccess: false,
    isError: false,
    errors: {},
    errorMessage: "",
  },
  reducers: {
    clearState: (state) => {
      state.onelink_code = "";
      state.long_url = "";
      state.onelink = "";
      state.user_id = "";
      state.created_at = "";
      state.updated_at = "";
      state.long_qr_code = "";
      state.short_qr_code = "";
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = false;
      state.errors = {};
      state.errorMessage = "";
      return state;
    },
    listAllMediumBySourceName: (state, action) => {
      const {sources, source} = action.payload
      const mediumValue = filterMedium(sources, source)
      state.mediums = mediumValue
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createOnelink.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.onelink_code = payload.onelink_code;
      state.long_url = payload.long_url;
      state.onelink = payload.onelink;
      state.user_id = payload.user_id;
      state.created_at = payload.created_at;
      state.updated_at = payload.updated_at;
      state.short_qr_code = payload.src;
    });
    builder.addCase(createOnelink.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(createOnelink.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    });
    builder.addCase(listAllSource.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.sources = payload;
    });
    builder.addCase(listAllSource.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(listAllSource.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    });
    builder.addCase(listAllMediumBySourceId.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.mediums = payload.utm_medium;
    });
    builder.addCase(listAllMediumBySourceId.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(listAllMediumBySourceId.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    });
    builder.addCase(editOnelink.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.onelink_code = payload.onelink_code;
      state.long_url = payload.long_url;
      state.onelink = payload.onelink;
      state.user_id = payload.user_id;
      state.created_at = payload.created_at;
      state.updated_at = payload.updated_at;
      state.short_qr_code = payload.src;
    });
    builder.addCase(editOnelink.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(editOnelink.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    });
  },
});

export const { clearState, listAllMediumBySourceName} = utmSlice.actions;

export const utmSelector = (state) => state.utms;

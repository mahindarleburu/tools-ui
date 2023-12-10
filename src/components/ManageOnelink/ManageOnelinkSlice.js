import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { GET, POST, PUT, SET_AUTH_TOKEN } from "../../utils/axiosInstance";
import {
  createOneLinkUrl,
  createQrCodeUrl,
  deleteOnelinkUrl,
  getAllOnelinkByUserId,
  getAllOnelinkByUserIdUrl,
  updateOnelinkUrl,
} from "../../utils/urls";
import { getAuth } from "firebase/auth";
export const listAllOnelinkByUserId = createAsyncThunk(
  "listonelinks/listAllOnelinkByUserId",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await GET(getAllOnelinkByUserIdUrl + payload.user_id, payload);
      if (response?.success === true) {
        // toast.success(response?.message);
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

export const createOnelink = createAsyncThunk(
  "listonelinks/createOnelink",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await POST(createOneLinkUrl, payload);
      if (response?.success === true) {
        toast.success(response?.message);
        const auth = getAuth();
        const user = auth.currentUser;
        dispatch(listAllOnelinkByUserId({ user_id: user.uid }));
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

export const updateOnelink = createAsyncThunk(
  "listonelinks/updateOnelink",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await PUT(updateOnelinkUrl, payload);
      if (response?.success === true) {
        toast.success(response?.message);
        const auth = getAuth();
        const user = auth.currentUser;
        dispatch(listAllOnelinkByUserId({ user_id: user.uid }));
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

export const deleteOnelink = createAsyncThunk(
  "listonelinks/deleteOnelink",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const response = await POST(deleteOnelinkUrl, {...payload, user_name:user.displayName, user_email:user.email});
      if (response?.success === true) {
        toast.success("Onelink deleted success");
        dispatch(listAllOnelinkByUserId({ user_id: user.uid }));
        return response.data;
      } else {
        return rejectWithValue(response);
      }
    } catch (e) {
      console.log("Error", e);
      return rejectWithValue(e.response.data);
    }
  }
);

export const createQrCode = createAsyncThunk(
  "qrcode/createQrCode",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await POST(createQrCodeUrl, payload);
      if (response?.success === true) {
        toast.success('QR code generated successfully');
        var a = document.createElement("a");
        a.href = response?.data?.src;
        a.download = payload.name+".png";
        a.height = "100%";
        a.width = "100%";
        a.click();
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

export const listOneLinkSlice = createSlice({
  name: "listonelinks",
  initialState: {
    onelink_code: "",
    name: "",
    long_url: "",
    onelink: "",
    user_id: "",
    created_at: "",
    updated_at: "",
    long_qr_code: "",
    short_qr_code: "",
    listOneLink: [],
    isFetching: false,
    isSuccess: false,
    isError: false,
    errors: {},
    errorMessage: "",
  },
  reducers: {
    clearState: (state) => {
      state.onelink_code = "";
      state.name = "";
      state.long_url = "";
      state.onelink = "";
      state.user_id = "";
      state.created_at = "";
      state.updated_at = "";
      state.long_qr_code = "";
      state.short_qr_code = "";
      state.listOneLink = [];
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = false;
      state.errors = {};
      state.errorMessage = "";
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listAllOnelinkByUserId.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.listOneLink = payload;
    });
    builder.addCase(listAllOnelinkByUserId.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(listAllOnelinkByUserId.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    });
    builder.addCase(createOnelink.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.onelink_code = payload.onelink_code;
      state.long_url = payload.long_url;
      state.onelink = payload.onelink;
      state.user_id = payload.user_id;
      state.created_at = payload.created_at;
      state.updated_at = payload.updated_at;
    });
    builder.addCase(createOnelink.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(createOnelink.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload?.message;
    });
    builder.addCase(updateOnelink.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.onelink_code = payload.onelink_code;
      state.long_url = payload.long_url;
      state.onelink = payload.onelink;
      state.user_id = payload.user_id;
      state.created_at = payload.created_at;
      state.updated_at = payload.updated_at;
    });
    builder.addCase(updateOnelink.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(updateOnelink.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload?.message;
    });
    builder.addCase(deleteOnelink.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.short_qr_code = payload.src;
    });
    builder.addCase(deleteOnelink.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(deleteOnelink.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload?.message;
    });
    builder.addCase(createQrCode.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.qrCode = payload.src;
    })
    builder.addCase(createQrCode.pending, (state) => {
      state.isFetching = true;
    })
    builder.addCase(createQrCode.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    })
  },
});

export const { clearState } = listOneLinkSlice.actions;

export const listOneLinkSelector = (state) => state.listonelinks;

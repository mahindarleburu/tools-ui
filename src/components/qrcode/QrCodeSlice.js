import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {  POST, PUT } from "../../utils/axiosInstance";
import { createOneLinkUrl, updateOnelinkUrl } from "../../utils/urls";


export const createShortUrlQrcode = createAsyncThunk(
  "shorturl/createShortUrlQrcode",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await POST(createOneLinkUrl, payload);
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

export const editQrCode = createAsyncThunk(
  "editqrcode/editQrCode",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await PUT(updateOnelinkUrl, payload);
      if (response?.success === true) {
        toast.success("Short URL updated created");
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

export const qrCodeSlice = createSlice({
  name: "qrcode",
  initialState: {
    qrCode: "",
    shortUrl:"",
    short_qr_code:"",
    isFetching: false,
    isSuccess: false,
    isError: false,
    errors: {},
    errorMessage: "",
  },
  reducers: {
    clearState: (state) => {
      state.qrCode = "";
      state.shortUrl="";
      state.short_qr_code="";
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = false;
      state.errors = {};
      state.errorMessage = "";
      return state;
    },
  },
  extraReducers:(builder)=> {
    builder.addCase(createShortUrlQrcode.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.shortUrl = payload.onelink;
      state.short_qr_code = payload.src;
    })
    builder.addCase(createShortUrlQrcode.pending, (state) => {
      state.isFetching = true;
    })
    builder.addCase(createShortUrlQrcode.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    })
    builder.addCase(editQrCode.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.shortUrl = payload.onelink;
      state.short_qr_code = payload.src;
    })
    builder.addCase(editQrCode.pending, (state) => {
      state.isFetching = true;
    })
    builder.addCase(editQrCode.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    })
  },
});

export const { clearState } = qrCodeSlice.actions;

export const qrCodeSelector = (state) => state.qrcode;

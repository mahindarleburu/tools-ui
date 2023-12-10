import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {  POST, PUT } from "../../utils/axiosInstance";
import { createOneLinkUrl, createQrCodeUrl, updateOnelinkUrl } from "../../utils/urls";

export const createShortUrl = createAsyncThunk(
  "shorturl/createShortUrl",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await POST(createOneLinkUrl, payload);
      if (response?.success === true) {
        toast.success("Short URL successfully created");
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

export const editShortenCode = createAsyncThunk(
  "editqrcode/editShortenCode",
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

export const shortUrlSlice = createSlice({
  name: "shorturl",
  initialState: {
    shortUrl: "",
    short_qr_code:'',
    isFetching: false,
    isSuccess: false,
    isError: false,
    errors: {},
    errorMessage: "",
  },
  reducers: {
    clearState: (state) => {
      state.shortUrl = "";
      state.isFetching = false;
      state.isSuccess = false;
      state.short_qr_code = "";
      state.isError = false;
      state.errors = {};
      state.errorMessage = "";
      return state;
    },
  },
  extraReducers:(builder)=> {
    builder.addCase(createShortUrl.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.shortUrl = payload.onelink;
      state.short_qr_code = payload.src;
    })
    builder.addCase(createShortUrl.pending, (state) => {
      state.isFetching = true;
    })
    builder.addCase(createShortUrl.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    })
    builder.addCase(editShortenCode.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.shortUrl = payload.onelink;
      state.short_qr_code = payload.src;
    })
    builder.addCase(editShortenCode.pending, (state) => {
      state.isFetching = true;
    })
    builder.addCase(editShortenCode.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    })
  },
});

export const { clearState } = shortUrlSlice.actions;

export const shortUrlSelector = (state) => state.shorturl;

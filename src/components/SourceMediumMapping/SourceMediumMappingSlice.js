import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { GET, POST, PUT, SET_AUTH_TOKEN } from "../../utils/axiosInstance";
import { deleteSourceUrl, getAllSourceUrl, updateSourceUrl, createSourceUrl, createMediumUrl, getAllMediumUrl, createSourceMediumMappingUrl } from "../../utils/urls";
import { getAuth } from "firebase/auth";
import { ManageAllSourceMedium } from "../ManageSourceMedium/ManageSourceMediumSlice";
import { isEmpty } from "../../utils/function";

export const listAllSource = createAsyncThunk(
  "source_medium_mapping/listAllSource",
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
      toast.error('something went wrong');
      return rejectWithValue(e.response.data);
    }
  }
);

export const createSource = createAsyncThunk("source_medium_mapping/createSource", async (payload, { rejectWithValue, dispatch }) => {
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
});

export const listAllMedium = createAsyncThunk(
  "medium/listAllMedium",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await GET(getAllMediumUrl, payload);
      if (response?.success === true) {
        toast.success(response?.data?.message);
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

export const createSourceMediumMapping = createAsyncThunk("source_medium_mapping/createSourceMediumMapping", async (payload, { rejectWithValue, dispatch }) => {
  try {
    const {utmSource, utmMedium} = payload;
    let finalPayload = {utmSourceId:null, utmMediumId:null}
    if(isEmpty(utmSource.id)){

      const sourceResponse = await POST(createSourceUrl, utmSource);
      finalPayload.utmSourceId = sourceResponse?.data?.id
    }else{
      finalPayload.utmSourceId = utmSource.id
    }
    if(isEmpty(utmMedium.id)){

      const mediumResponse = await POST(createMediumUrl, utmMedium);
      finalPayload.utmMediumId = mediumResponse?.data?.id
    }else{
      finalPayload.utmMediumId = utmMedium.id
    }
    const response = await POST(createSourceMediumMappingUrl, finalPayload);
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
    toast.error(e?.response?.data?.message);
    return rejectWithValue(e.response.data);
    
  }
});

export const listSourceMedumSlice = createSlice({
  name: "source_medium_mapping",
  initialState: {
    source:null,
    medium:null,
    source_medium_mapping_id:null,
    listSource: [],
    listMedium:[],
    isFetching: false,
    isSuccess: false,
    isError: false,
    errors: {},
    errorMessage: "",
  },
  reducers: {
    clearState: (state) => {
      state.source = null;
      state.medium = null;
      state.source_medium_mapping_id=null
      state.listSource = [];
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
      state.source = payload
    });
    builder.addCase(createSource.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(createSource.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    });
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
      state.medium = payload
    });
    builder.addCase(createMedium.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(createMedium.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    });
    builder.addCase(createSourceMediumMapping.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.source_medium_mapping_id = payload.id
    });
    builder.addCase(createSourceMediumMapping.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(createSourceMediumMapping.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    });
  },
});

export const { clearState } = listSourceMedumSlice.actions;

export const listSourceMediumSelector = (state) => state.source_medium_mapping;

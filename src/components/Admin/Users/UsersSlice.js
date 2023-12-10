import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getDocs, collection, setDoc, updateDoc, orderBy, query } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../../utils/firebase";
import { convertToLocalTimeZone } from "../../../utils/function";

export const getUserById = createAsyncThunk("user/getUserById", async (payload, { rejectWithValue, dispatch }) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    const userDocRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userDocRef);
    if (userSnapshot.exists()) {
      toast.success();
      return userSnapshot.data();
    } else {
      return rejectWithValue("No such document!");
    }
  } catch (e) {
    return rejectWithValue("No such document!");
  }
});

export const listAllUser = createAsyncThunk("user/listallusers", async (payload, { rejectWithValue, dispatch }) => {
  try {
    const userRef = collection(db, "users");
    const q = query(userRef, orderBy("lastLoginAt", "desc"));
    const userSnapshot = await getDocs(q);
    const userArray = [];
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour:"numeric",
      minute:"numeric",
      hour12: true
    };
    userSnapshot.forEach((doc) => userArray.push({ ...doc.data(), id: doc.id, lastLoginAt: doc.data().lastLoginAt ? doc.data().lastLoginAt.toDate().toLocaleString("en-US", options) :''}));
    if (userArray) {
      toast.success();
      return userArray;
    } else {
      return rejectWithValue("No such document!");
    }
  } catch (e) {
    console.log(e);
    return rejectWithValue("No such document!");
  }
});

export const updateUser = createAsyncThunk("user/updateUser", async (payload, { rejectWithValue, dispatch }) => {
  try {
    const userDocRef = doc(db, "users", payload.id);
    try {
      // await setDoc(userDocRef, {
      //   displayName:payload.displayName,
      //   email:payload.email,
      //   createdAt:payload.createdAt,
      //   lastLoginAt: payload.lastLoginAt ? payload.lastLoginAt : null,
      //   role: payload.role,
      // });
      await updateDoc(userDocRef, {
        role: payload.role,
      });
    } catch (error) {
      console.log("error while creating document", error.message);
    }
    toast.success("Role Updated Success");
    dispatch(listAllUser());
  } catch (e) {
    console.log(e);
    return rejectWithValue("No such document!");
  }
});

export const listUserSlice = createSlice({
  name: "users",
  initialState: {
    name: "",
    display_name: "",
    created_at: "",
    updated_at: "",
    user: {},
    users: [],
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
      state.user = {};
      state.users = [];
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = false;
      state.errors = {};
      state.errorMessage = "";
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserById.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.user = payload;
    });
    builder.addCase(getUserById.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(getUserById.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    });
    builder.addCase(listAllUser.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.users = payload;
    });
    builder.addCase(listAllUser.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(listAllUser.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    });
    builder.addCase(updateUser.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      // state.users = payload;
    });
    builder.addCase(updateUser.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(updateUser.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    });
  },
});

export const { clearState } = listUserSlice.actions;

export const listUserSelector = (state) => state.users;

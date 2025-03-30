import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import errorFormater from "../../../utils/errorFormater";
import axios, { axiosPrivate } from "../../api/axios";

const initialState = {
  isVerified: false,
  email: null,
  guard: null,
  status: "idle",
  error: null,
  message:null,
  codeWasSent:false
};

const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    setVerified:(state)=>{
      state.isVerified=true;
    },
    reset:(state)=>{
      state=initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(passwordResetRequest.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(passwordResetRequest.fulfilled, (state, action) => {
        const { result } = action.payload.response;
        const { email,guard } = action.payload.credentials;
        state.status = "succeeded";
        state.email = email;
        state.guard = guard;
        state.codeWasSent = true;
        state.error = null;
        state.message = result.message;
      })
      .addCase(passwordResetRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(passwordResetVerify.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(passwordResetVerify.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isVerified=true;
        state.codeWasSent=false;
        state.message=null;
        state.error = null;
      })
      .addCase(passwordResetVerify.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(passwordReset.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(passwordReset.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isVerified=false;
        state.error = null;
      })
      .addCase(passwordReset.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
  },
});

export const passwordResetRequest = createAsyncThunk(
  "forgotPassword/request",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post("api/password-reset/request", credentials);
      return {credentials,response:response.data};
    } catch (error) {
      const errorObj = errorFormater(error);
      return rejectWithValue(errorObj);
    }
  }
);
export const passwordResetVerify = createAsyncThunk(
  "forgotPassword/verify",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post("api/password-reset/verify", credentials,{
        withCredentials:true
      });
      return response.data;
    } catch (error) {
      const errorObj = errorFormater(error);
      return rejectWithValue(errorObj);
    }
  }
);

export const passwordReset = createAsyncThunk(
  "forgotPassword/password-reset",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post("api/password-reset", credentials,{
        withCredentials:true
      });
      return response.data;
    } catch (error) {
      const errorObj = errorFormater(error);
      return rejectWithValue(errorObj);
    }
  }
);

export const { reset, setVerified } = forgotPasswordSlice.actions;

export default forgotPasswordSlice.reducer;

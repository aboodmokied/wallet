import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import errorFormater from "../../../utils/errorFormater";
import axios, { axiosPrivate } from "../../api/axios";
import { verifyUser } from "../auth-state/authSlice";

const initialState = {
//   isVerified: false,
//   email: null,
//   guard: null,
  status: "idle",
  error: null,
  message:null,
  codeWasSent:sessionStorage.getItem('verify_email_code_sent') || false
};

const VerifyEmailSlice = createSlice({
  name: "verifyEmail",
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyEmailRequest.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyEmailRequest.fulfilled, (state, action) => {
        const { result } = action.payload;
        state.status = "succeeded";
        state.codeWasSent = true;
        sessionStorage.setItem('verify_email_code_sent',JSON.stringify(true));
        state.error = null;
        state.message = result.message;
      })
      .addCase(verifyEmailRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(verifyEmail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        const {result}=action.payload;
        state.status = "succeeded";
        state.message=result.message;
        state.error = null;

      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
  },
});

export const verifyEmailRequest = createAsyncThunk(
  "verifyEmail/request",
  async (_,{ rejectWithValue }) => {
    try {
      const response = await axiosPrivate.get("api/verify-email/request");
      return response.data;
    } catch (error) {
      const errorObj = errorFormater(error);
      return rejectWithValue(errorObj);
    }
  }
);
export const verifyEmail = createAsyncThunk(
  "verifyEmail/verify",
  async (credentials, { rejectWithValue,dispatch }) => {
    try {
      const response = await axiosPrivate.post("api/verify-email", credentials);
      dispatch(verifyUser());
      return response.data;
    } catch (error) {
      const errorObj = errorFormater(error);
      return rejectWithValue(errorObj);
    }
  }
);



export const { reset, setVerified } = VerifyEmailSlice.actions;

export default VerifyEmailSlice.reducer;

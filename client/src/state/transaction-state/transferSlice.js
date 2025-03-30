import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import errorFormater from "../../../utils/errorFormater";
import axios, { axiosPrivate } from "../../api/axios";

const initialState = {
  targetUser: null,
  //   amount: 0,
  //   info:null,
  operationDetails: null,
  transaction: null,
  status: "idle",
  error: null,
  message: null,
  //   confirmed: false,
  codeWasSent: false,
  isVerified: false,
  verifiedTransactionId:null
};

const transferSlice = createSlice({
  name: "transfer",
  initialState,
  reducers: {
    // setConfirmed:(state)=>{
    //   state.confirmed=true;
    // },
    reset: (state) => {
      state.targetUser = initialState.targetUser;
      state.operationDetails = initialState.operationDetails;
      state.transaction = initialState.transaction;
      state.status = initialState.status;
      state.error = initialState.error;
      state.message = initialState.message;
      state.codeWasSent = initialState.codeWasSent;
      state.isVerified = initialState.isVerified;
      state.verifiedTransactionId = initialState.verifiedTransactionId;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTargetUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getTargetUser.fulfilled, (state, action) => {
        const { result } = action.payload;
        state.status = "succeeded";
        state.targetUser = result.user;
        // state.codeWasSent = true;
        state.error = null;
        // state.message = result.message;
      })
      .addCase(getTargetUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(transferRequest.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(transferRequest.fulfilled, (state, action) => {
        const { result } = action.payload;
        const { message, opertaionInfo, transaction, users } = result;
        state.status = "succeeded";
        state.codeWasSent = true;
        state.transaction = transaction;
        state.operationDetails = {
          opertaionInfo,
          users,
        };
        state.message = message;
        state.error = null;
      })
      .addCase(transferRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(verifyTransfer.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyTransfer.fulfilled, (state, action) => {
        const { result } = action.payload;
        state.status = "succeeded";
        state.isVerified = true;
        state.transaction = result.transaction; // updated transaction
        state.verifiedTransactionId = result.transaction.id;
        state.message = result.message;
        state.error = null;
      })
      .addCase(verifyTransfer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const getTargetUser = createAsyncThunk(
  "targetUser",
  async (credintials, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.post("api/target-user", credintials);
      return response.data;
    } catch (error) {
      const errorObj = errorFormater(error);
      return rejectWithValue(errorObj);
    }
  }
);

export const transferRequest = createAsyncThunk(
  "taransfer/request",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.post("api/transfer", credentials);
      return response.data;
    } catch (error) {
      const errorObj = errorFormater(error);
      return rejectWithValue(errorObj);
    }
  }
);

export const verifyTransfer = createAsyncThunk(
  "transfer/verify",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.post(
        "api/verify-transaction",
        credentials
      );
      return response.data;
    } catch (error) {
      const errorObj = errorFormater(error);
      return rejectWithValue(errorObj);
    }
  }
);

export const { reset } = transferSlice.actions;

export default transferSlice.reducer;

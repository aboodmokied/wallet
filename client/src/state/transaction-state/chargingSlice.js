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

const chargingSlice = createSlice({
  name: "charging",
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
      .addCase(getChargingTargetUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getChargingTargetUser.fulfilled, (state, action) => {
        const { result } = action.payload;
        state.status = "succeeded";
        state.targetUser = result.user;
        // state.codeWasSent = true;
        state.error = null;
        // state.message = result.message;
      })
      .addCase(getChargingTargetUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(chargingRequest.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(chargingRequest.fulfilled, (state, action) => {
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
      .addCase(chargingRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(verifyCharging.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyCharging.fulfilled, (state, action) => {
        const { result } = action.payload;
        state.status = "succeeded";
        state.isVerified = true;
        state.transaction = result.transaction; // updated transaction
        state.verifiedTransactionId = result.transaction.id;
        state.message = result.message;
        state.error = null;
      })
      .addCase(verifyCharging.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const getChargingTargetUser = createAsyncThunk(
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

export const chargingRequest = createAsyncThunk(
  "charging/request",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.post("api/charging", credentials);
      return response.data;
    } catch (error) {
      const errorObj = errorFormater(error);
      return rejectWithValue(errorObj);
    }
  }
);

export const verifyCharging = createAsyncThunk(
  "charging/verify",
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

export const { reset } = chargingSlice.actions;

export default chargingSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import errorFormater from "../../../utils/errorFormater";
import axios, { axiosPrivate } from "../../api/axios";

const initialState = {
  targetCompany: null,
  operationDetails: null,
  transaction: null,
  status: "idle",
  error: null,
  message: null,
  codeWasSent: false,
  isVerified: false,
  verifiedTransactionId:null
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setCategory: (state) => {
      state.category = true;
    },
    reset: (state) => {
      state.targetCompany = initialState.targetCompany;
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
      // .addCase(getTargetCompanyById.pending, (state) => {
      //   state.status = "loading";
      //   state.error = null;
      // })
      // .addCase(getTargetCompanyById.fulfilled, (state, action) => {
      //   const { result } = action.payload;
      //   state.status = "succeeded";
      //   state.targetCompany = result.company;
      //   // state.codeWasSent = true;
      //   state.error = null;
      //   // state.message = result.message;
      // })
      // .addCase(getTargetCompanyById.rejected, (state, action) => {
      //   state.status = "failed";
      //   state.error = action.payload || action.error.message;
      // })
      .addCase(paymentRequest.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(paymentRequest.fulfilled, (state, action) => {
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
      .addCase(paymentRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(verifyPayment.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        const { result } = action.payload;
        state.status = "succeeded";
        state.isVerified = true;
        state.transaction = result.transaction; // updated transaction
        state.verifiedTransactionId = result.transaction.id;
        state.message = result.message;
        state.error = null;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

// export const getTargetCompanyById = createAsyncThunk(
//   "targetCompany",
//   async (credintials, { rejectWithValue }) => {
//     try {
//       const response = await axiosPrivate.get(
//         `api/company/${credintials.companyId}`
//       );
//       return response.data;
//     } catch (error) {
//       const errorObj = errorFormater(error);
//       return rejectWithValue(errorObj);
//     }
//   }
// );

export const paymentRequest = createAsyncThunk(
  "payment/request",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.post("api/payment", credentials);
      return response.data;
    } catch (error) {
      const errorObj = errorFormater(error);
      return rejectWithValue(errorObj);
    }
  }
);

export const verifyPayment = createAsyncThunk(
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

export const { reset } = paymentSlice.actions;

export default paymentSlice.reducer;

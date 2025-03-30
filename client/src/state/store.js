import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../state/auth-state/authSlice";
import forgotPasswordReducer from "./forgot-password-state/forgotPasswordSlice";
import verifyEmailReducer from "./verify-email-state/verifyEmailSlice";
import transferReducer from "./transaction-state/transferSlice";
import paymentReducer from "./transaction-state/paymentSlice";
import chargingReducer from "./transaction-state/chargingSlice";
import errorReducer from "./error-state/errorSlice";
import { setupAxiosPrivate } from "../api/axios";

const store = configureStore({
  reducer: {
    auth: authReducer,
    forgotPassword: forgotPasswordReducer,
    verifyEmail: verifyEmailReducer,
    transfer: transferReducer,
    payment: paymentReducer,
    charging: chargingReducer,
    error: errorReducer,
  },
});

setupAxiosPrivate(() => store.getState().auth, store.dispatch);

export default store;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import errorFormater from "../../../utils/errorFormater";
import axios, { axiosPrivate } from "../../api/axios";

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  status: "idle",
  error: null,
  authPagesGuard: 'user',
  authType:null,
  persist:localStorage.getItem('persist') || JSON.parse(sessionStorage.getItem('persist_on_session')) || false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetForNewPage: (state) => {
      state.error = null;
      state.status = "idle";
    },
    togglePersist:(state)=>{
      const newValue=!state.persist;
      state.persist=!state.persist;
      localStorage.setItem('persist',JSON.stringify(newValue))
    },
    setAuthPagesGuard:(state,action)=>{
      const {guard}=action.payload;
      state.authPagesGuard=guard;
    },
    verifyUser:(state)=>{
      state.user.verified=true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        const { result } = action.payload;
        state.status = "succeeded";
        state.error = null;
        state.isAuthenticated = true;
        state.token = result.accessToken;
        state.user = result.user;
        state.authType=result.user.guard=='systemOwner'?'cms':'regular'
        sessionStorage.setItem('persist_on_session',JSON.stringify(true));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      // .addCase(refresh.pending,(state)=>{
      //     state.status='loading';
      //     // state.error=null;
      // })
      .addCase(refresh.fulfilled, (state, action) => {
        const { result } = action.payload;
        // state.status='idle';
        // state.error=null;
        state.isAuthenticated = true;
        state.token = result.accessToken;
        state.user = result.user;
        state.authType=result.user.guard=='systemOwner'?'cms':'regular'
      })
      // .addCase(refresh.rejected,(state,action)=>{
      //     state.status='idle';
      //     // state.error=action.payload || action.error.message;
      // })
      .addCase(logout.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, _) => {
        state.status = "succeeded";
        state.error = null;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.authType=null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post("api/login", credentials, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      const errorObj = errorFormater(error);
      return rejectWithValue(errorObj);
    }
  }
);
export const refresh = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("api/refresh", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      const errorObj = errorFormater(error);
      return rejectWithValue(errorObj);
    }
  }
);

// export const register=createAsyncThunk('auth/register',
//     async(credentials,{rejectWithValue})=>{
//         try {
//             const response=await axios.post('api/register',credentials);
//             // const {email,password,guard}=credentials;
//             // dispatch(login({email,password,guard}));
//             return response.data;
//         } catch (error) {
//             const errorObj=errorFormater(error);
//             return rejectWithValue(errorObj);
//         }

//     }
// )

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosPrivate.get("api/logout");
    } catch (error) {
      const errorObj = errorFormater(error);
      return rejectWithValue(errorObj);
    }
  }
);

export const { resetForNewPage, togglePersist, setAuthPagesGuard, verifyUser } = authSlice.actions;

export default authSlice.reducer;

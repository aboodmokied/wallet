import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hasError:false,
  error:null
};

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    reset:(state)=>{
      // state=initialState;
      console.log('Clear Error');
      state.error=null;
      state.hasError=false;
    },
    setError:(state,action)=>{
        state.hasError=true;
        state.error=action.payload?.error;
    }
  },
  
});


export const { reset,setError } = errorSlice.actions;

export default errorSlice.reducer;

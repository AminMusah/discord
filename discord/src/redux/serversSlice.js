import { createSlice } from "@reduxjs/toolkit";

export const serversSlice = createSlice({
  name: "servers",
  initialState: {
    servers: [],
    status: "idle",
    error: null,
  },
  reducers: {
    getServersStart: (state) => {
      state.status = "loading";
    },
    getServersSuccess: (state, action) => {
      state.status = "succeeded";
      state.servers = action.payload;
    },
    getServersFailure: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

// Export the actions
export const { getServersStart, getServersSuccess, getServersFailure } =
  serversSlice.actions;

export default serversSlice.reducer;

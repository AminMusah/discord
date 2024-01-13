import { createSlice } from "@reduxjs/toolkit";

export const serverSlice = createSlice({
  name: "server",
  initialState: {
    server: [],
    status: "idle",
    error: null,
  },
  reducers: {
    getServerStart: (state) => {
      state.status = "loading";
    },
    getServerSuccess: (state, action) => {
      state.status = "succeeded";
      state.server = action.payload;
    },
    getServerFailure: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

// Export the actions
export const { getServerStart, getServerSuccess, getServerFailure } =
  serverSlice.actions;

export default serverSlice.reducer;

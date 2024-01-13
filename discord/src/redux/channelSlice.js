import { createSlice } from "@reduxjs/toolkit";

export const channelSlice = createSlice({
  name: "channel",
  initialState: {
    channel: [],
    status: "idle",
    error: null,
  },
  reducers: {
    getChannelStart: (state) => {
      state.status = "loading";
    },
    getChannelSuccess: (state, action) => {
      state.status = "succeeded";
      state.channel = action.payload;
    },
    getChannelFailure: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

// Export the actions
export const { getChannelStart, getChannelSuccess, getChannelFailure } =
  channelSlice.actions;

export default channelSlice.reducer;

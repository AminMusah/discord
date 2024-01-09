import { createSlice } from "@reduxjs/toolkit";

export const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: [],
    status: "idle",
    error: null,
  },
  reducers: {
    getProfileStart: (state) => {
      state.status = "loading";
    },
    getProfileSuccess: (state, action) => {
      state.status = "succeeded";
      state.profile = action.payload;
    },
    getProfileFailure: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

// Export the actions
export const { getProfileStart, getProfileSuccess, getProfileFailure } =
  profileSlice.actions;

export default profileSlice.reducer;

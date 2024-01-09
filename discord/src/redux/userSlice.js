import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    status: "idle", // can be "idle", "loading", "succeeded", or "failed"
    error: null,
  },
  reducers: {
    getUsersStart: (state) => {
      state.status = "loading";
    },
    getUsersSuccess: (state, action) => {
      state.status = "succeeded";
      state.users = action.payload;
    },
    getUsersFailure: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

// Export the actions
export const { getUsersStart, getUsersSuccess, getUsersFailure } =
  userSlice.actions;

export default userSlice.reducer;

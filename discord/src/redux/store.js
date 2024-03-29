import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import profileReducer from "./profileSlice";
import serverReducer from "./serverSlice";
import channelReducer from "./channelSlice";
import serversSlice from "./serversSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    profile: profileReducer,
    server: serverReducer,
    channel: channelReducer,
    servers: serversSlice,
  },
});

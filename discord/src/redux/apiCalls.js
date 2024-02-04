import url from "../api/url";
import { toast } from "sonner";
import { getUsersStart, getUsersSuccess, getUsersFailure } from "./userSlice";
import {
  getServerFailure,
  getServerStart,
  getServerSuccess,
} from "./serverSlice";
import {
  getProfileFailure,
  getProfileStart,
  getProfileSuccess,
} from "./profileSlice";
import {
  getChannelFailure,
  getChannelStart,
  getChannelSuccess,
} from "./channelSlice";

// All users
export const fetchUsers = () => async (dispatch) => {
  try {
    dispatch(getUsersStart());
    const response = await url.get("/profiles");
    dispatch(getUsersSuccess(response.data));
  } catch (error) {
    dispatch(getUsersFailure(error.message));
    toast.error(error.response.data.message);
  }
};

// Current user
export const getProfile = (userId) => async (dispatch) => {
  try {
    dispatch(getProfileStart());
    const response = await url.get(`/profile/${userId}`);
    dispatch(getProfileSuccess(response.data));
  } catch (error) {
    dispatch(getProfileFailure(error.message));
  }
};

// All servers
export const getServers = () => async (dispatch) => {
  try {
    dispatch(getServerStart());
    const response = await url.get(`/server/`);
    dispatch(getServerSuccess(response.data));
  } catch (error) {
    dispatch(getServerFailure(error.message));
  }
};

// All channels
export const getChannel = () => async (dispatch) => {
  try {
    dispatch(getChannelStart());
    const response = await url.get(`/channels`);
    dispatch(getChannelSuccess(response.data));
  } catch (error) {
    dispatch(getChannelFailure(error.message));
  }
};

// single server
export const getServer = (serverId) => async (dispatch) => {
  try {
    dispatch(getServerStart());
    const response = await url.get(`/server/${serverId}`);
    dispatch(getServerSuccess(response.data));
  } catch (error) {
    dispatch(getServerFailure(error.message));
  }
};

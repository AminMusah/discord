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

export const fetchUsers = () => async (dispatch) => {
  try {
    dispatch(getUsersStart());
    const response = await url.get("/profiles");
    console.log({ response });
    dispatch(getUsersSuccess(response.data));
  } catch (error) {
    dispatch(getUsersFailure(error.message));
    toast.error(error.response.data.message);
  }
};

export const getProfile = () => async (dispatch) => {
  const userId = localStorage.getItem("user");

  try {
    dispatch(getProfileStart());
    const response = await url.get(`/profile/${userId}`);
    dispatch(getProfileSuccess(response.data));
  } catch (error) {
    dispatch(getProfileFailure(error.message));
  }
};

export const getServer = () => async (dispatch) => {
  try {
    dispatch(getServerStart());
    const response = await url.get(`/server/`);
    dispatch(getServerSuccess(response.data));
  } catch (error) {
    dispatch(getServerFailure(error.message));
  }
};

export const getChannel = () => async (dispatch) => {
  try {
    dispatch(getChannelStart());
    const response = await url.get(`/channels`);
    dispatch(getChannelSuccess(response.data));
  } catch (error) {
    dispatch(getChannelFailure(error.message));
  }
};

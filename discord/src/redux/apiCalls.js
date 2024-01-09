import url from "../api/url";
import { toast } from "sonner";

import { getUsersStart, getUsersSuccess, getUsersFailure } from "./userSlice";
import {
  getProfileFailure,
  getProfileStart,
  getProfileSuccess,
} from "./profileSlice";

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
    console.log({ response });
    dispatch(getProfileSuccess(response.data));
  } catch (error) {
    dispatch(getProfileFailure(error.message));
  }
};

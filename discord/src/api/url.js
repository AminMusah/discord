import axios from "axios";
import production from "../base";

const token = localStorage.getItem("token");

export default axios.create({
  baseURL: `${production}/api/`,
  headers: {
    "auth-token": token,
  },
});

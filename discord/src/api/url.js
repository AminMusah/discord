import axios from "axios";
import production from "../base";

const token = localStorage.getItem("token");

export default axios.create({
  // baseURL: "http://localhost:6060/api/",
  baseURL: `${production}/api/`,
  headers: {
    "auth-token": token,
  },
});

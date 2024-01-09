import axios from "axios";

const token = localStorage.getItem("token");

export default axios.create({
  baseURL: "http://localhost:6060/api/",
  headers: {
    "auth-token": token,
  },
});

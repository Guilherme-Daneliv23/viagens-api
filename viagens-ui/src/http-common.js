// src/http-common.js
import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:8081/viagens-api",
  headers: {
    "Content-Type": "application/json",
  },
});

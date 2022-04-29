import axios from "axios";

const BASE_URL = `https://nhom01.somee.com/Api/`;

export const Request = axios.create({
  baseURL: BASE_URL,
});

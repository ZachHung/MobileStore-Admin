import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

export const Request = axios.create({
  baseURL: BASE_URL,
});
export const changeToVND = (price) => {
  price = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
  return price;
};
export function capitalize(s) {
  if (!s) return "";
  return s[0].toUpperCase() + s.slice(1);
}

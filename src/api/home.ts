import { api } from "./client";

export const fetchHome = async () => {
  const res = await api.get("/home");
  return res.data;
};

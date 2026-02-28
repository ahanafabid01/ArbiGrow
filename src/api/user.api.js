import useUserStore from "../store/userStore.js";
import api from "./axiosInstance.js";

export const refreshUserStore = () => {
  const token = useUserStore.getState().token;
  return api.get("v1/user/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

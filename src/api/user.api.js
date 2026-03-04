import useUserStore from "../store/userStore.js";
import api from "./axiosInstance.js";

const authHeaders = () => {
  const token = useUserStore.getState().token;
  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};
};

export const refreshUserStore = () => {
  return api.get("v1/user/me", authHeaders());
};

export const getReferralNetwork = () => {
  return api.get("v1/user/referral-network", authHeaders());
};

export const getActiveDepositNetworks = () => {
  return api.get("v1/deposit-networks/active", authHeaders());
};

export const createDepositRequest = (payload) => {
  return api.post("v1/deposits/", payload, authHeaders());
};

export const getMyDeposits = () => {
  return api.get("v1/deposits/my", authHeaders());
};

export const startMining = () => {
  return api.post("v1/user/start-mining", {}, authHeaders());
};

export const claimMining = () => {
  return api.post("v1/user/claim-mining", {}, authHeaders());
};

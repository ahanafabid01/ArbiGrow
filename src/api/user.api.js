import useUserStore from "../store/userStore.js";
import api from "./axiosInstance.js";

const normalizeAccessToken = (value) => {
  if (!value) return null;

  let token = String(value).trim();

  if (token.toLowerCase().startsWith("bearer ")) {
    token = token.slice(7).trim();
  }

  if (token.startsWith('"') && token.endsWith('"')) {
    token = token.slice(1, -1).trim();
  }

  return token || null;
};

const authHeaders = () => {
  const token = normalizeAccessToken(useUserStore.getState().token);
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

export const createWithdrawalRequest = (payload) => {
  return api.post("v1/withdrawals/", payload, authHeaders());
};

export const getMyWithdrawals = () => {
  return api.get("v1/withdrawals/my", authHeaders());
};

export const startMining = () => {
  return api.post("v1/user/start-mining", {}, authHeaders());
};

export const claimMining = () => {
  return api.post("v1/user/claim-mining", {}, authHeaders());
};

export const buyInvestment = (payload) => {
  return api.post("v1/investments/buy", payload, authHeaders());
};

export const getMyInvestments = () => {
  return api.get("v1/investments/my", authHeaders());
};

export const getMyInvestmentDetails = (investmentId) => {
  return api.get(`v1/investments/${investmentId}`, authHeaders());
};

export const getMyEarningsHistory = () => {
  return api.get("v1/user/earnings-history", authHeaders());
};

export const getMyProfitHistory = () => {
  return api.get("v1/user/profit-history", authHeaders());
};

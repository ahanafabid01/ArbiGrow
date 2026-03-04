import api from "./axiosInstance.js";

const authHeaders = (token) =>
  token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};

export const getAllUsers = async (
  token,
  { page = 1, search = "", status = "" } = {},
) => {
  const params = new URLSearchParams();

  params.append("page", page);

  // Only include search if it has value
  if (search && search.trim() !== "") {
    params.append("search", search.trim());
  }

  // Only include status if not "all"
  if (status && status !== "all") {
    params.append("status", status);
  }

  const res = await api.get(`v1/admin/users?${params.toString()}`, authHeaders(token));

  return res || [];
};

export const getUser = async (token, user_Id) => {
  const res = await api.get(`v1/admin/users/${user_Id}`, authHeaders(token));

  // return only user data
  return res.data || {}; // single user object
};

export const updateKYCStatus = async (token, user_Id, statusValue) => {
  const res = await api.patch(
    `v1/admin/users/${user_Id}/kyc-status`,
    { status: statusValue },
    authHeaders(token),
  );

  // return only user data
  return res.data || {};
};

export const getDepositNetworks = async (token) => {
  const res = await api.get("v1/deposit-networks", authHeaders(token));
  return res.data || {};
};

export const createDepositNetwork = async (token, payload) => {
  const res = await api.post("v1/deposit-networks/", payload, authHeaders(token));
  return res.data || {};
};

export const updateDepositNetwork = async (token, networkId, payload) => {
  const res = await api.put(
    `v1/deposit-networks/${networkId}`,
    payload,
    authHeaders(token),
  );
  return res.data || {};
};

export const deleteDepositNetwork = async (token, networkId) => {
  const res = await api.delete(`v1/deposit-networks/${networkId}`, authHeaders(token));
  return res.data || {};
};

export const getAdminDeposits = async (
  token,
  { page = 1, limit = 50, status = "" } = {},
) => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);

  if (status && status.trim() !== "") {
    params.append("status", status.trim());
  }

  const res = await api.get(`v1/deposits/admin?${params.toString()}`, authHeaders(token));
  return res.data || {};
};

export const updateDepositStatus = async (token, depositId, status) => {
  const res = await api.patch(
    `v1/deposits/${depositId}`,
    { status },
    authHeaders(token),
  );
  return res.data || {};
};

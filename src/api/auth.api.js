import api from "./axiosInstance.js";

export const registerUser = (data) => {
  // console.log(data);
  return api.post("v1/auth/signup", data);
};

export const loginUser = (data) => {
  return api.post("v1/auth/login", data);
};

export const forgotPassword = (data) => {
  return api.post("v1/auth/forgot-password", data);
};

export const resetPassword = (newPassword, token) => {
  return api.post(
    "v1/auth/reset-password",
    { new_password: newPassword },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const verifyEmail = (token) => {
  return api.post("v1/auth/verify-email", null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const resendVerificationEmail = (token, email) => {
  return api.post(
    "v1/auth/resend-verification",
    { email },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

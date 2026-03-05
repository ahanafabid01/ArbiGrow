// /store/userStore.js
import { create } from "zustand";

// Safe parse for user

let savedUser = null;
// let savedUserDetails = null;
try {
  savedUser = JSON.parse(localStorage.getItem("user") || "null");
  // savedUserDetails = JSON.parse(localStorage.getItem("userDetails") || "null");
} catch (err) {
  console.warn("Invalid user in localStorage", err);
  localStorage.removeItem("user");
}

const normalizeAccessToken = (value) => {
  if (!value) return null;

  let token = String(value).trim();

  try {
    const parsed = JSON.parse(token);
    if (typeof parsed === "string") {
      token = parsed.trim();
    }
  } catch {
    // Keep raw token if it is not JSON encoded.
  }

  if (token.toLowerCase().startsWith("bearer ")) {
    token = token.slice(7).trim();
  }

  if (token.startsWith('"') && token.endsWith('"')) {
    token = token.slice(1, -1).trim();
  }

  return token || null;
};

const savedToken = normalizeAccessToken(localStorage.getItem("token"));

const useUserStore = create((set, get) => ({
  user: savedUser,
  token: savedToken,
  userDetails: null,

  // setUser: (userData) => {
  //   localStorage.setItem("user", JSON.stringify(userData));
  //   set({ user: userData });
  // },
  setUser: (newUserData) => {
    const currentUser = get().user || {};

    const updatedUser = {
      ...currentUser,
      ...newUserData,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    set({ user: updatedUser });
  },

  setToken: (token) => {
    const normalizedToken = normalizeAccessToken(token);

    if (normalizedToken) {
      localStorage.setItem("token", normalizedToken);
    } else {
      localStorage.removeItem("token");
    }

    set({ token: normalizedToken });
  },

  setUserDetails: (details) => {
    // localStorage.setItem("userDetails", JSON.stringify(details));
    set({ userDetails: details });
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));

export default useUserStore;

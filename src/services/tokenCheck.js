import { jwtDecode } from "jwt-decode";
import socketServiceInstance from "./socket";
import { resetStore } from "../features/action";

export const startTokenHeartbeat = () => {
  let hasRedirected = false;
  const isTokenExpired = (token) => {
    if (!token) return true;

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  };

  const checkTokenStatus = () => {
    const token = localStorage.getItem("userAuthToken");
    const currentPath = window.location.pathname;

    const excludedPaths = [
      "/login",
      "/admin/role/auth/login",
      "/province/login",
      "/student-signup",
      "/agent-signup",
      "/new-account"

    ];

    if (!token || isTokenExpired(token)) {
      if (!hasRedirected && !excludedPaths.includes(currentPath)) {
        hasRedirected = true;
        handleExpiredToken();
      }
    }
  };
  const handleExpiredToken = () => {
    const role = localStorage.getItem("role");
    const roleRedirectMap = {
      0: "/admin/role/auth/login",
      1: "/admin/role/auth/login",
      4: "/province/login",
      5: "/province/login",
    };

    const redirectURL = roleRedirectMap[role] || "/login";

    window.location.href = redirectURL;

    ["role", "student", "form", "userAuthToken"].forEach((item) =>
      localStorage.removeItem(item)
    );
    store.dispatch(resetStore());
    if (socketServiceInstance.isConnected()) {
      socketServiceInstance.disconnectSocket();
    } else {
      console.error("Socket disconnection failed, please refresh.");
    }
  };

  const intervalId = setInterval(checkTokenStatus, 60 * 1000);

  return () => clearInterval(intervalId);
};

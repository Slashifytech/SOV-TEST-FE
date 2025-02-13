import { jwtDecode } from "jwt-decode";


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

    const excludedPaths = ["/login", "/signup", "/admin/role/auth/login", "/province/login"];

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
      "0": "/admin/role/auth/login",
      "1": "/admin/role/auth/login",
      "4": "/province/login",
      "5": "/province/login"
    };

    const redirectURL = roleRedirectMap[role] || "/login";
    
    window.location.href = redirectURL;

    ["role", "student", "form", "userAuthToken"].forEach((item) =>
      localStorage.removeItem(item)
    );
  };

  const intervalId = setInterval(checkTokenStatus, 60 * 1000); 

  return () => clearInterval(intervalId);
};

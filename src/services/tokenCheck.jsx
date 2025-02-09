import { jwtDecode } from "jwt-decode";

export const startTokenHeartbeat = () => {
  const role = localStorage.getItem("role");
  const isTokenExpired = (token) => {
    if (!token) return true;

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert to seconds
      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true; // Consider the token expired if decoding fails
    }
  };

  const checkTokenStatus = () => {
    const token = localStorage.getItem("userAuthToken");
    if (!token || isTokenExpired(token)) {
      handleExpiredToken();
    }
  };

  const handleExpiredToken = () => {
    // Clear localStorage and redirect

    role === "0" || role === "1"
      ? window.open("/admin/role/auth/login")
      : role === "4" || role === "5"
      ? window.open("/province/login")
      : window.open("/login");
    localStorage.removeItem("role");
    localStorage.removeItem("student");
    localStorage.removeItem("form");
    localStorage.removeItem("userAuthToken");
  };

  // Start the interval
  const intervalId = setInterval(checkTokenStatus, 2 * 60 * 1000);

  // Return a function to stop the heartbeat
  return () => clearInterval(intervalId);
};

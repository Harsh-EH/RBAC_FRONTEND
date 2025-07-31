// src/hooks/useSessionManager.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const useSessionManager = () => {
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const lastRoute = sessionStorage.getItem("lastRoute");

    // ✅ Case: navigated back from "/" (dashboard) to "/login"
    if (location.pathname === "/login" && lastRoute === "/") {
      console.log("🔁 Back from Dashboard → clearing token");
      localStorage.removeItem("token");
      sessionStorage.removeItem("lastRoute");
    }

    // 🧼 Expired or corrupt token cleanup
    if (location.pathname === "/login" && token) {
      try {
        const decoded = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp <= now) {
          localStorage.removeItem("token");
          console.warn("🕒 Token expired, cleared");
        }
      } catch {
        localStorage.removeItem("token");
        console.warn("❌ Invalid token, cleared");
      }
    }

    // 🧠 Always track last visited route
    sessionStorage.setItem("lastRoute", location.pathname);
  }, [location.pathname]);
};

export default useSessionManager;

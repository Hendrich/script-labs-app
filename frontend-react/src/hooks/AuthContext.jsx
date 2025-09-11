import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { authService } from "../services/authService.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const idleTimerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const IDLE_LIMIT_MS = 15 * 60 * 1000; // 15 menit
  const WARNING_LIMIT_MS = 14 * 60 * 1000; // 14 menit (1 menit sebelum logout)
  const warningShownRef = useRef(false);

  // Simpan timestamp aktivitas terakhir ke storage agar tab lain bisa sinkron
  const ACTIVITY_KEY = "app:lastActivity";
  const LOGOUT_EVENT_KEY = "app:forceLogout";

  const updateActivity = (ts = Date.now()) => {
    lastActivityRef.current = ts;
    try {
      localStorage.setItem(ACTIVITY_KEY, String(ts));
    } catch (_) {}
    if (warningShownRef.current) warningShownRef.current = false;
  };

  const checkIdle = () => {
    const now = Date.now();
    const inactiveFor = now - lastActivityRef.current;
    if (inactiveFor >= IDLE_LIMIT_MS) {
      // Auto logout
      logout(true);
      try {
        localStorage.setItem(LOGOUT_EVENT_KEY, String(now));
      } catch (_) {}
      return;
    }
    if (!warningShownRef.current && inactiveFor >= WARNING_LIMIT_MS && user) {
      // Bisa diganti UI modal; sementara pakai alert ringan (tidak blocking jika browser block)
      try {
        console.warn("Inactivity warning: session will end in 60s");
      } catch (_) {}
      warningShownRef.current = true;
    }
  };

  const startIdleWatcher = () => {
    if (idleTimerRef.current) return; // already running
    idleTimerRef.current = setInterval(checkIdle, 30 * 1000); // cek tiap 30 detik
  };

  const stopIdleWatcher = () => {
    if (idleTimerRef.current) {
      clearInterval(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  };

  const activityEvents = [
    "mousemove",
    "keydown",
    "click",
    "scroll",
    "touchstart",
    "focus",
  ];

  const attachActivityListeners = () => {
    activityEvents.forEach((evt) =>
      window.addEventListener(evt, handleActivity, { passive: true })
    );
    window.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("storage", handleStorage);
  };

  const detachActivityListeners = () => {
    activityEvents.forEach((evt) =>
      window.removeEventListener(evt, handleActivity)
    );
    window.removeEventListener("visibilitychange", handleVisibility);
    window.removeEventListener("storage", handleStorage);
  };

  const handleActivity = () => {
    updateActivity();
  };

  const handleVisibility = () => {
    if (!document.hidden) {
      // Tab kembali aktif, sinkronkan dari storage
      const stored = Number(localStorage.getItem(ACTIVITY_KEY));
      if (stored && stored > lastActivityRef.current) {
        lastActivityRef.current = stored;
      } else {
        updateActivity();
      }
    }
  };

  const handleStorage = (e) => {
    if (e.key === ACTIVITY_KEY) {
      const val = Number(e.newValue);
      if (val > lastActivityRef.current) lastActivityRef.current = val;
    }
    if (e.key === LOGOUT_EVENT_KEY) {
      // Tab lain memicu logout
      logout();
    }
  };

  useEffect(() => {
    console.log("🚀 AuthProvider: Initializing auth state...");
    const currentUser = authService.getCurrentUser();
    console.log(
      "👤 AuthProvider: Current user from localStorage:",
      currentUser
    );
    setUser(currentUser);
    setLoading(false);
    updateActivity();
    attachActivityListeners();
    startIdleWatcher();
    return () => {
      detachActivityListeners();
      stopIdleWatcher();
    };
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 AuthProvider: Attempting login for:", email);
      const response = await authService.login(email, password);
      console.log("✅ AuthProvider: Login response:", response);

      if (response.user) {
        console.log("👤 AuthProvider: Setting user state:", response.user);
        setUser(response.user);
        console.log(
          "🔄 AuthProvider: User state updated, should trigger re-render"
        );
      } else {
        console.error("❌ AuthProvider: No user in response");
        throw new Error("Login failed: No user data received");
      }

      return response;
    } catch (err) {
      console.error("❌ AuthProvider: Login failed:", err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(userData);
      // Don't automatically set user state on registration
      // User should login after successful registration
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = (isAuto = false) => {
    console.log(
      "🚪 AuthProvider: Logging out..." + (isAuto ? " (auto idle)" : "")
    );
    authService.logout();
    setUser(null);
    if (isAuto) {
      try {
        sessionStorage.setItem("lastAutoLogout", String(Date.now()));
      } catch (_) {}
    }
    console.log("👤 AuthProvider: User state cleared");
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const BASE_URL = "https://veekites.onrender.com"; // ✅ your backend base URL
  const [token, setToken] = useState(undefined); // undefined = still checking
  const [loading, setLoading] = useState(true);

  // ✅ Load token from sessionStorage on mount
  useEffect(() => {
    const storedToken = sessionStorage.getItem("veekites_token");
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  // ✅ Save token to sessionStorage when set
  const saveToken = (newToken) => {
    setToken(newToken);
    sessionStorage.setItem("veekites_token", newToken);
  };

  // ✅ Logout / Clear token
  const logout = () => {
    setToken(null);
    sessionStorage.removeItem("veekites_token");
  };

  return (
    <AppContext.Provider
      value={{
        BASE_URL,
        token,
        loading,
        saveToken,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// ✅ Custom hook for cleaner access
export const useApp = () => useContext(AppContext);

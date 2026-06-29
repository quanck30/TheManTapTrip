import { createContext, useContext, useState } from "react";

const TOKEN_STORAGE_KEY = "authToken";
const USER_STORAGE_KEY = "authUser";

const AuthContext = createContext(null);

function removeDiagItems() {
  localStorage.removeItem("diag_step");
  localStorage.removeItem("diag_answers");
  localStorage.removeItem("diag_isConfirming");
}
const getStoredUser = () => {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState(getStoredUser);

  const setAuthenticatedUser = (authenticatedUser) => {
    setUser(authenticatedUser);

    if (authenticatedUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authenticatedUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  const login = (newToken, authenticatedUser) => {
    setToken(newToken);

    if (newToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }

    if (authenticatedUser) {
      setAuthenticatedUser(authenticatedUser);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    removeDiagItems();
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token),
        login,
        logout,
        getToken: () => token,
        setAuthenticatedUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

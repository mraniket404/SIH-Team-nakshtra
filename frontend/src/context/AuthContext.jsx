import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    () =>
      localStorage.getItem(
        "satquery_token"
      )
  );

  const [loading, setLoading] =
    useState(true);

  /* =========================
     RESTORE SESSION
  ========================= */

  useEffect(() => {
    const restoreSession = async () => {
      const storedToken =
        localStorage.getItem(
          "satquery_token"
        );

      if (!storedToken) {
        setToken(null);
        setUser(null);
        setLoading(false);
        return;
      }

      setToken(storedToken);

      try {
        const response =
          await api.get("/auth/me");

        if (response.data?.success) {
          setUser(
            response.data.user
          );
        } else {
          throw new Error(
            "Unable to restore session."
          );
        }
      } catch (error) {
        console.error(
          "Session restore failed:",
          error
        );

        localStorage.removeItem(
          "satquery_token"
        );

        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  /* =========================
     LOGIN
  ========================= */

  const login = async (
    email,
    password
  ) => {
    const response =
      await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

    if (!response.data?.success) {
      throw new Error(
        response.data?.message ||
          "Login failed."
      );
    }

    const {
      token: authenticatedToken,
      user: authenticatedUser,
    } = response.data;

    if (!authenticatedToken) {
      throw new Error(
        "Login succeeded but authentication token was not returned."
      );
    }

    localStorage.setItem(
      "satquery_token",
      authenticatedToken
    );

    setToken(
      authenticatedToken
    );

    setUser(
      authenticatedUser
    );

    return authenticatedUser;
  };

  /* =========================
     REGISTER
  ========================= */

  const register = async (
    name,
    email,
    password,
    confirmPassword
  ) => {
    const response =
      await api.post(
        "/auth/register",
        {
          name,
          email,
          password,
          confirmPassword,
        }
      );

    if (!response.data?.success) {
      throw new Error(
        response.data?.message ||
          "Registration failed."
      );
    }

    const {
      token: registeredToken,
      user: registeredUser,
    } = response.data;

    if (!registeredToken) {
      throw new Error(
        "Registration succeeded but authentication token was not returned."
      );
    }

    localStorage.setItem(
      "satquery_token",
      registeredToken
    );

    setToken(
      registeredToken
    );

    setUser(
      registeredUser
    );

    return registeredUser;
  };

  /* =========================
     LOGOUT
  ========================= */

  const logout = () => {
    localStorage.removeItem(
      "satquery_token"
    );

    setToken(null);
    setUser(null);
  };

  /* =========================
     CONTEXT VALUE
  ========================= */

  const value = useMemo(
    () => ({
      user,

      token,

      loading,

      isAuthenticated:
        Boolean(
          user && token
        ),

      login,

      register,

      logout,
    }),
    [
      user,
      token,
      loading,
    ]
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* =========================
   USE AUTH
========================= */

function useAuth() {
  const context =
    useContext(
      AuthContext
    );

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}

export {
  AuthProvider,
  useAuth,
};
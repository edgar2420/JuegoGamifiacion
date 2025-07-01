import { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

// Crear contexto
export const AuthContext = createContext();
export const socket = io("http://localhost:3000");

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    if (user) {
      socket.connect();
      console.log("🔌 Socket conectado");
    } else {
      socket.disconnect();
      console.log("❌ Socket desconectado");
    }

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

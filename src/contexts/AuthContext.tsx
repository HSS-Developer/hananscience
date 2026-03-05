import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  class: string;
  rollNumber: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const mockUsers: Record<string, User & { password: string }> = {
  "student@hanan.edu": {
    id: "1",
    name: "Ahmed Hassan",
    email: "student@hanan.edu",
    password: "student123",
    role: "student",
    class: "Grade 10 - Science",
    rollNumber: "HSS-2024-0042",
  },
  "admin@hanan.edu": {
    id: "2",
    name: "Dr. Fatima Khan",
    email: "admin@hanan.edu",
    password: "admin123",
    role: "admin",
    class: "Administration",
    rollNumber: "ADM-001",
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    const found = mockUsers[email];
    if (found && found.password === password) {
      const { password: _, ...userData } = found;
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

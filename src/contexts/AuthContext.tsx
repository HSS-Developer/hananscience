import React, { createContext, useContext, useState, ReactNode } from "react";

export type ClassLevel = "PG" | "Nursery" | "KG" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";

export const ALL_CLASSES: ClassLevel[] = ["PG", "Nursery", "KG", "1", "2", "3", "4", "5", "6", "7", "8"];

export const classDisplayName = (c: ClassLevel) => {
  if (["PG", "Nursery", "KG"].includes(c)) return c;
  return `Class ${c}`;
};

export interface DiaryEntry {
  id: string;
  date: string;
  targetClasses: ClassLevel[];
  subjects: { subject: string; homework: string }[];
  note?: string;
  createdBy: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  targetClasses: ClassLevel[];
  priority: "high" | "medium" | "low";
  createdBy: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  class: ClassLevel;
  rollNumber: string;
  section?: string;
  fatherName?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  diaryEntries: DiaryEntry[];
  announcements: Announcement[];
  addDiaryEntry: (entry: Omit<DiaryEntry, "id">) => void;
  addAnnouncement: (entry: Omit<Announcement, "id">) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const mockUsers: Record<string, User & { password: string }> = {
  "student@hanan.edu": {
    id: "1",
    name: "Ahmed Hassan",
    email: "student@hanan.edu",
    password: "student123",
    role: "student",
    class: "3",
    rollNumber: "HSS-2026-0042",
    section: "A",
    fatherName: "Mr. Hassan Ahmed",
  },
  "admin@hanan.edu": {
    id: "2",
    name: "Dr. Fatima Khan",
    email: "admin@hanan.edu",
    password: "admin123",
    role: "admin",
    class: "PG",
    rollNumber: "ADM-001",
  },
};

const initialDiary: DiaryEntry[] = [
  {
    id: "d1",
    date: "2026-03-05",
    targetClasses: ["3"],
    subjects: [
      { subject: "English", homework: "Learn page 45 poem by heart" },
      { subject: "Math", homework: "Do exercise 5.3 (Q1-Q10)" },
      { subject: "Urdu", homework: "Write 5 sentences about your family" },
      { subject: "Science", homework: "Draw and label parts of a plant" },
    ],
    note: "Reminder: Bring art supplies tomorrow! 🎨",
    createdBy: "Dr. Fatima Khan",
  },
  {
    id: "d2",
    date: "2026-03-04",
    targetClasses: ["3"],
    subjects: [
      { subject: "Math", homework: "Learn tables 6 to 9" },
      { subject: "Islamiat", homework: "Memorize Surah Al-Fil" },
      { subject: "English", homework: "Write 10 new words with meanings" },
    ],
    createdBy: "Dr. Fatima Khan",
  },
  {
    id: "d3",
    date: "2026-03-05",
    targetClasses: ["5", "6", "7", "8"],
    subjects: [
      { subject: "Science", homework: "Complete chapter 8 worksheet" },
      { subject: "Math", homework: "Exercise 7.2 all questions" },
    ],
    note: "Science test on Friday!",
    createdBy: "Dr. Fatima Khan",
  },
];

const initialAnnouncements: Announcement[] = [
  {
    id: "a1",
    title: "🎉 Annual Sports Day!",
    content: "Sports Day will be held on March 20th. All students must wear white PT uniform. Bring water bottles and caps!",
    date: "2026-03-05",
    targetClasses: ["PG", "Nursery", "KG", "1", "2", "3", "4", "5", "6", "7", "8"],
    priority: "high",
    createdBy: "Principal",
  },
  {
    id: "a2",
    title: "📝 Mid-Term Exams Schedule",
    content: "Mid-term exams will start from March 25th. Date sheet has been sent. Please prepare well!",
    date: "2026-03-04",
    targetClasses: ["1", "2", "3", "4", "5", "6", "7", "8"],
    priority: "high",
    createdBy: "Exam Department",
  },
  {
    id: "a3",
    title: "🧥 Winter Uniform Change",
    content: "From March 15th, students should switch to summer uniform. White shirt with grey pants/skirt.",
    date: "2026-03-03",
    targetClasses: ["PG", "Nursery", "KG", "1", "2", "3", "4", "5", "6", "7", "8"],
    priority: "medium",
    createdBy: "Administration",
  },
  {
    id: "a4",
    title: "🎨 Art Competition for Junior Classes",
    content: "Drawing competition on the topic 'My School' for PG to Class 3. Bring your own colors and sheets!",
    date: "2026-03-02",
    targetClasses: ["PG", "Nursery", "KG", "1", "2", "3"],
    priority: "medium",
    createdBy: "Art Department",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(initialDiary);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);

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

  const addDiaryEntry = (entry: Omit<DiaryEntry, "id">) => {
    setDiaryEntries((prev) => [{ ...entry, id: `d${Date.now()}` }, ...prev]);
  };

  const addAnnouncement = (entry: Omit<Announcement, "id">) => {
    setAnnouncements((prev) => [{ ...entry, id: `a${Date.now()}` }, ...prev]);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, diaryEntries, announcements, addDiaryEntry, addAnnouncement }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

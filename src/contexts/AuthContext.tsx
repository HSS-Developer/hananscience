import React, { createContext, useContext, useState, ReactNode } from "react";

export type ClassLevel = "PG" | "Nursery" | "KG" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";

export const ALL_CLASSES: ClassLevel[] = ["PG", "Nursery", "KG", "1", "2", "3", "4", "5", "6", "7", "8"];

export const classDisplayName = (c: ClassLevel) => {
  if (["PG", "Nursery", "KG"].includes(c)) return c;
  return `Class ${c}`;
};

export type UserRole = "student" | "admin" | "principal";

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

export interface Student {
  id: string;
  name: string;
  email: string;
  class: ClassLevel;
  section: string;
  rollNumber: string;
  fatherName: string;
  phone?: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
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
  students: Student[];
  addStudent: (student: Omit<Student, "id">) => void;
  removeStudent: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const defaultStudents: Student[] = [
  {
    id: "1",
    name: "Ahmed Hassan",
    email: "ahmed@hanan.edu",
    class: "3",
    section: "A",
    rollNumber: "HSS-2026-0042",
    fatherName: "Mr. Hassan Ahmed",
    phone: "03001234567",
    password: "student123",
  },
  {
    id: "2",
    name: "Ayesha Siddiqui",
    email: "ayesha@hanan.edu",
    class: "5",
    section: "A",
    rollNumber: "HSS-2026-0078",
    fatherName: "Mr. Siddiqui Ali",
    phone: "03009876543",
    password: "student123",
  },
  {
    id: "3",
    name: "Muhammad Ali",
    email: "ali@hanan.edu",
    class: "1",
    section: "B",
    rollNumber: "HSS-2026-0015",
    fatherName: "Mr. Ali Khan",
    phone: "03211234567",
    password: "student123",
  },
];

const adminUsers: Record<string, User & { password: string }> = {
  "admin@hanan.edu": {
    id: "admin-1",
    name: "Dr. Fatima Khan",
    email: "admin@hanan.edu",
    password: "admin123",
    role: "admin",
    class: "PG",
    rollNumber: "ADM-001",
  },
  "principal@hanan.edu": {
    id: "principal-1",
    name: "Prof. Abdul Rehman",
    email: "principal@hanan.edu",
    password: "principal123",
    role: "principal",
    class: "PG",
    rollNumber: "PRI-001",
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
    content: "Sports Day will be held on March 20th. All students must wear white PT uniform.",
    date: "2026-03-05",
    targetClasses: ALL_CLASSES,
    priority: "high",
    createdBy: "Principal",
  },
  {
    id: "a2",
    title: "📝 Mid-Term Exams Schedule",
    content: "Mid-term exams will start from March 25th. Date sheet has been sent.",
    date: "2026-03-04",
    targetClasses: ["1", "2", "3", "4", "5", "6", "7", "8"],
    priority: "high",
    createdBy: "Exam Department",
  },
  {
    id: "a3",
    title: "🧥 Summer Uniform Change",
    content: "From March 15th, students should switch to summer uniform.",
    date: "2026-03-03",
    targetClasses: ALL_CLASSES,
    priority: "medium",
    createdBy: "Administration",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(initialDiary);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [students, setStudents] = useState<Student[]>(defaultStudents);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Check admin/principal accounts
    const adminUser = adminUsers[email];
    if (adminUser && adminUser.password === password) {
      const { password: _, ...userData } = adminUser;
      setUser(userData);
      return true;
    }
    // Check student accounts
    const student = students.find((s) => s.email === email && s.password === password);
    if (student) {
      setUser({
        id: student.id,
        name: student.name,
        email: student.email,
        role: "student",
        class: student.class,
        rollNumber: student.rollNumber,
        section: student.section,
        fatherName: student.fatherName,
      });
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

  const addStudent = (student: Omit<Student, "id">) => {
    setStudents((prev) => [...prev, { ...student, id: `s${Date.now()}` }]);
  };

  const removeStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <AuthContext.Provider
      value={{
        user, login, logout, isAuthenticated: !!user,
        diaryEntries, announcements, addDiaryEntry, addAnnouncement,
        students, addStudent, removeStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

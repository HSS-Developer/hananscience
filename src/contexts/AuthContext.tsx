import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

export type ClassLevel = "PG" | "Nursery" | "KG" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";

export const ALL_CLASSES: ClassLevel[] = ["PG", "Nursery", "KG", "1", "2", "3", "4", "5", "6", "7", "8"];

export const classDisplayName = (c: ClassLevel) => {
  if (["PG", "Nursery", "KG"].includes(c)) return c;
  return `Class ${c}`;
};

export const getSectionsForClass = (c: ClassLevel): string[] => {
  if (["PG", "Nursery", "KG", "1", "2", "3"].includes(c)) return ["A", "B"];
  if (c === "5") return ["Girls", "Boys", "Important"];
  if (["4", "6", "7", "8"].includes(c)) return ["Girls", "Boys"];
  return ["A"];
};

export type UserRole = "student" | "admin" | "principal" | "teacher";

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
  userId: string;
  name: string;
  email: string;
  class: ClassLevel;
  section: string;
  rollNumber: string;
  fatherName: string;
  phone?: string;
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
  loading: boolean;
  diaryEntries: DiaryEntry[];
  announcements: Announcement[];
  addDiaryEntry: (entry: Omit<DiaryEntry, "id">) => Promise<void>;
  addAnnouncement: (entry: Omit<Announcement, "id">) => Promise<void>;
  deleteDiaryEntry: (id: string) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  students: Student[];
  teachers: Student[];
  addStudent: (student: { name: string; email: string; class: ClassLevel; section: string; rollNumber: string; fatherName: string; phone?: string; password: string }) => Promise<void>;
  addTeacher: (teacher: { name: string; email: string; phone?: string; password: string }) => Promise<void>;
  removeStudent: (id: string) => Promise<void>;
  removeTeacher: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Student[]>([]);
  const fetchUserProfile = useCallback(async (supabaseUser: SupabaseUser) => {
    // Get profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", supabaseUser.id)
      .single();

    // Get role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", supabaseUser.id)
      .single();

    if (profile) {
      setUser({
        id: supabaseUser.id,
        name: profile.name,
        email: profile.email,
        role: (roleData?.role as UserRole) || "student",
        class: (profile.class as ClassLevel) || "PG",
        rollNumber: profile.roll_number || "",
        section: profile.section || "A",
        fatherName: profile.father_name || undefined,
      });
    }
  }, []);

  const fetchDiaryEntries = useCallback(async () => {
    const { data: entries } = await supabase
      .from("diary_entries")
      .select("*")
      .order("created_at", { ascending: false });

    if (!entries) { setDiaryEntries([]); return; }

    // Fetch subjects for all entries
    const entryIds = entries.map((e) => e.id);
    const { data: subjects } = await supabase
      .from("diary_subjects")
      .select("*")
      .in("diary_entry_id", entryIds.length > 0 ? entryIds : ["__none__"]);

    const diaryList: DiaryEntry[] = entries.map((e) => ({
      id: e.id,
      date: e.date,
      targetClasses: e.target_classes as ClassLevel[],
      subjects: (subjects || [])
        .filter((s) => s.diary_entry_id === e.id)
        .map((s) => ({ subject: s.subject, homework: s.homework })),
      note: e.note || undefined,
      createdBy: e.created_by,
    }));

    setDiaryEntries(diaryList);
  }, []);

  const fetchAnnouncements = useCallback(async () => {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (!data) { setAnnouncements([]); return; }

    setAnnouncements(
      data.map((a) => ({
        id: a.id,
        title: a.title,
        content: a.content,
        date: a.date,
        targetClasses: a.target_classes as ClassLevel[],
        priority: a.priority as "high" | "medium" | "low",
        createdBy: a.created_by,
      }))
    );
  }, []);

  const fetchStudents = useCallback(async () => {
    const { data: profiles } = await supabase.from("profiles").select("*");
    const { data: roles } = await supabase.from("user_roles").select("*");

    if (!profiles || !roles) { setStudents([]); setTeachers([]); return; }

    const mapProfile = (p: any) => ({
      id: p.id,
      userId: p.user_id,
      name: p.name,
      email: p.email,
      class: (p.class as ClassLevel) || "PG",
      section: p.section || "A",
      rollNumber: p.roll_number || "",
      fatherName: p.father_name || "",
      phone: p.phone || undefined,
    });

    const studentUserIds = roles.filter((r) => r.role === "student").map((r) => r.user_id);
    setStudents(profiles.filter((p) => studentUserIds.includes(p.user_id)).map(mapProfile));

    const teacherUserIds = roles.filter((r) => r.role === "teacher").map((r) => r.user_id);
    setTeachers(profiles.filter((p) => teacherUserIds.includes(p.user_id)).map(mapProfile));
  }, []);

  const refreshData = useCallback(async () => {
    await Promise.all([fetchDiaryEntries(), fetchAnnouncements(), fetchStudents()]);
  }, [fetchDiaryEntries, fetchAnnouncements, fetchStudents]);

  useEffect(() => {
    // Set up auth listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user);
          // Fetch data after profile is loaded
          setTimeout(() => refreshData(), 100);
        } else {
          setUser(null);
          setDiaryEntries([]);
          setAnnouncements([]);
          setStudents([]);
          setTeachers([]);
        }
        setLoading(false);
      }
    );

    // Then check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user);
        refreshData();
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchUserProfile, refreshData]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return !error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const addDiaryEntry = async (entry: Omit<DiaryEntry, "id">) => {
    const { data: session } = await supabase.auth.getSession();
    const { data: newEntry, error } = await supabase
      .from("diary_entries")
      .insert({
        date: entry.date,
        target_classes: entry.targetClasses,
        note: entry.note || null,
        created_by: entry.createdBy,
        created_by_user_id: session?.session?.user?.id || null,
      })
      .select()
      .single();

    if (error || !newEntry) return;

    // Insert subjects
    if (entry.subjects.length > 0) {
      await supabase.from("diary_subjects").insert(
        entry.subjects.map((s) => ({
          diary_entry_id: newEntry.id,
          subject: s.subject,
          homework: s.homework,
        }))
      );
    }

    await fetchDiaryEntries();
  };

  const addAnnouncement = async (entry: Omit<Announcement, "id">) => {
    const { data: session } = await supabase.auth.getSession();
    await supabase.from("announcements").insert({
      title: entry.title,
      content: entry.content,
      date: entry.date,
      target_classes: entry.targetClasses,
      priority: entry.priority,
      created_by: entry.createdBy,
      created_by_user_id: session?.session?.user?.id || null,
    });

    await fetchAnnouncements();
  };

  const deleteDiaryEntry = async (id: string) => {
    await supabase.from("diary_entries").delete().eq("id", id);
    await fetchDiaryEntries();
  };

  const deleteAnnouncement = async (id: string) => {
    await supabase.from("announcements").delete().eq("id", id);
    await fetchAnnouncements();
  };

  const addStudent = async (student: { name: string; email: string; class: ClassLevel; section: string; rollNumber: string; fatherName: string; phone?: string; password: string }) => {
    const { data, error } = await supabase.functions.invoke("manage-users", {
      body: {
        action: "create",
        email: student.email,
        password: student.password,
        name: student.name,
        class: student.class,
        section: student.section,
        rollNumber: student.rollNumber,
        fatherName: student.fatherName,
        phone: student.phone,
        role: "student",
      },
    });

    if (error) throw error;
    if (data?.error) throw new Error(data.error);

    await fetchStudents();
  };

  const removeStudent = async (id: string) => {
    // id here is profile id, we need userId
    const student = students.find((s) => s.id === id);
    if (!student) return;

    await supabase.functions.invoke("manage-users", {
      body: { action: "delete", userId: student.userId },
    });

    await fetchStudents();
  };

  const addTeacher = async (teacher: { name: string; email: string; phone?: string; password: string }) => {
    const { data, error } = await supabase.functions.invoke("manage-users", {
      body: {
        action: "create",
        email: teacher.email,
        password: teacher.password,
        name: teacher.name,
        phone: teacher.phone,
        role: "teacher",
      },
    });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    await fetchStudents();
  };

  const removeTeacher = async (id: string) => {
    const teacher = teachers.find((t) => t.id === id);
    if (!teacher) return;
    await supabase.functions.invoke("manage-users", {
      body: { action: "delete", userId: teacher.userId },
    });
    await fetchStudents();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
        diaryEntries,
        announcements,
        addDiaryEntry,
        addAnnouncement,
        deleteDiaryEntry,
        deleteAnnouncement,
        students,
        teachers,
        addStudent,
        addTeacher,
        removeStudent,
        removeTeacher,
        refreshData,
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

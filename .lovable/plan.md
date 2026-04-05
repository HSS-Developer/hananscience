

# School Portal Upgrade Plan

## Summary of Changes

User ne kai improvements maange hain. Yeh plan sab cover karta hai:

---

## 1. UI/UX Design Overhaul
- Cleaner card designs with better spacing and subtle shadows
- Improved color contrast and typography hierarchy
- Better mobile responsiveness across all pages
- Smoother animations and micro-interactions
- Modernized sidebar with better active states
- Dashboard cards redesign with glassmorphism effects

## 2. New Syllabus Page (Admin uploads, everyone views)
- **Database**: New `syllabus_images` table (id, class, image_url, uploaded_by, created_at)
- **Storage**: New `syllabus` storage bucket (public)
- **RLS**: Admin/Principal can INSERT/UPDATE/DELETE, all authenticated can SELECT
- **Page**: Admin uploads PNG per class, students/teachers view and download
- **Sidebar**: Add "📚 Syllabus" link for all roles

## 3. Remove Separate Student Login — Single Student Account with Class/Section Selector
- Instead of removing the student management system, the Diary page for students will show a **class and section picker** so any student can browse diary entries for any class/section
- This way one student login can access all diary content by selecting class + section from dropdowns

## 4. Diary PNG Attachment Feature
- **Database**: New `diary_attachments` table (id, diary_entry_id, image_url, file_name)
- **Storage**: New `diary-attachments` storage bucket (public)
- **Admin/Teacher side**: Add file upload input in AdminSendDiary to attach multiple PNGs
- **Student side**: Show attached images in diary entries with download buttons
- **RLS**: Admin/Teacher can INSERT/DELETE, all authenticated can SELECT

## 5. Download Buttons Everywhere
- Diary page: Download button for each attached PNG
- Uniform page: Download button for uniform images
- Syllabus page: Download button for syllabus images
- All downloads use `<a download>` pattern

---

## Technical Details

### New Database Tables (Migration)
```sql
-- Syllabus images table
CREATE TABLE public.syllabus_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class text NOT NULL,
  image_url text NOT NULL,
  uploaded_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.syllabus_images ENABLE ROW LEVEL SECURITY;

-- Diary attachments table  
CREATE TABLE public.diary_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  diary_entry_id uuid NOT NULL REFERENCES diary_entries(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  file_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.diary_attachments ENABLE ROW LEVEL SECURITY;

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('syllabus', 'syllabus', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('diary-attachments', 'diary-attachments', true);

-- RLS policies for both tables + storage
```

### Files to Create
- `src/pages/Syllabus.tsx` — Syllabus page with upload (admin) and view/download (all)

### Files to Modify
- `src/App.tsx` — Add Syllabus route
- `src/components/portal/AppSidebar.tsx` — Add Syllabus menu item for all roles
- `src/pages/AdminSendDiary.tsx` — Add PNG attachment upload section
- `src/pages/Diary.tsx` — Add class/section selector for students + show attachments with download
- `src/pages/Uniform.tsx` — Add download buttons
- `src/pages/Dashboard.tsx` — UI refresh
- `src/index.css` — Refined design tokens
- `src/contexts/AuthContext.tsx` — Add diary attachments support
- Multiple pages for UI/UX polish


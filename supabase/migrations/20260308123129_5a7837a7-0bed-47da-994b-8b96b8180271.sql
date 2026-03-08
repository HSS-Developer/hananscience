
-- Update diary_entries INSERT policy to allow teachers
DROP POLICY IF EXISTS "Admins can insert diary" ON public.diary_entries;
CREATE POLICY "Admins and teachers can insert diary" ON public.diary_entries
FOR INSERT TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) 
  OR has_role(auth.uid(), 'principal'::app_role)
  OR has_role(auth.uid(), 'teacher'::app_role)
);

-- Update diary_entries DELETE policy to allow teachers
DROP POLICY IF EXISTS "Admins can delete diary" ON public.diary_entries;
CREATE POLICY "Admins and teachers can delete diary" ON public.diary_entries
FOR DELETE TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  OR has_role(auth.uid(), 'principal'::app_role)
  OR has_role(auth.uid(), 'teacher'::app_role)
);

-- Update diary_entries SELECT policy to allow teachers
DROP POLICY IF EXISTS "Students can view diary for their class" ON public.diary_entries;
CREATE POLICY "Users can view diary" ON public.diary_entries
FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  OR has_role(auth.uid(), 'principal'::app_role)
  OR has_role(auth.uid(), 'teacher'::app_role)
  OR EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid() AND profiles.class = ANY(diary_entries.target_classes)
  )
);

-- Update diary_subjects INSERT policy to allow teachers
DROP POLICY IF EXISTS "Insert diary subjects" ON public.diary_subjects;
CREATE POLICY "Insert diary subjects" ON public.diary_subjects
FOR INSERT TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'principal'::app_role)
  OR has_role(auth.uid(), 'teacher'::app_role)
);

-- Update diary_subjects DELETE policy to allow teachers
DROP POLICY IF EXISTS "Delete diary subjects" ON public.diary_subjects;
CREATE POLICY "Delete diary subjects" ON public.diary_subjects
FOR DELETE TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'principal'::app_role)
  OR has_role(auth.uid(), 'teacher'::app_role)
);

-- Teachers can view all profiles (read-only)
CREATE POLICY "Teachers can view all profiles" ON public.profiles
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'teacher'::app_role));

-- Teachers can view announcements
DROP POLICY IF EXISTS "Students can view announcements for their class" ON public.announcements;
CREATE POLICY "Users can view announcements" ON public.announcements
FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  OR has_role(auth.uid(), 'principal'::app_role)
  OR has_role(auth.uid(), 'teacher'::app_role)
  OR EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid() AND profiles.class = ANY(announcements.target_classes)
  )
);

-- Teachers can view all roles
CREATE POLICY "Teachers can view all roles" ON public.user_roles
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'teacher'::app_role));

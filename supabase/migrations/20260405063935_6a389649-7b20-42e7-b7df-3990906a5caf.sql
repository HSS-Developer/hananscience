
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
  diary_entry_id uuid NOT NULL REFERENCES public.diary_entries(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  file_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.diary_attachments ENABLE ROW LEVEL SECURITY;

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('syllabus', 'syllabus', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('diary-attachments', 'diary-attachments', true) ON CONFLICT (id) DO NOTHING;

-- Syllabus RLS
CREATE POLICY "Anyone can view syllabus" ON public.syllabus_images FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert syllabus" ON public.syllabus_images FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role));
CREATE POLICY "Admins can update syllabus" ON public.syllabus_images FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role));
CREATE POLICY "Admins can delete syllabus" ON public.syllabus_images FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role));

-- Diary attachments RLS
CREATE POLICY "Anyone can view diary attachments" ON public.diary_attachments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Teachers and admins can insert diary attachments" ON public.diary_attachments FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role) OR has_role(auth.uid(), 'teacher'::app_role));
CREATE POLICY "Teachers and admins can delete diary attachments" ON public.diary_attachments FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role) OR has_role(auth.uid(), 'teacher'::app_role));

-- Storage policies for syllabus bucket
CREATE POLICY "Anyone can view syllabus files" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'syllabus');
CREATE POLICY "Admins can upload syllabus files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'syllabus' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role)));
CREATE POLICY "Admins can update syllabus files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'syllabus' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role)));
CREATE POLICY "Admins can delete syllabus files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'syllabus' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role)));

-- Storage policies for diary-attachments bucket
CREATE POLICY "Anyone can view diary attachment files" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'diary-attachments');
CREATE POLICY "Teachers can upload diary attachment files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'diary-attachments' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role) OR has_role(auth.uid(), 'teacher'::app_role)));
CREATE POLICY "Teachers can delete diary attachment files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'diary-attachments' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role) OR has_role(auth.uid(), 'teacher'::app_role)));

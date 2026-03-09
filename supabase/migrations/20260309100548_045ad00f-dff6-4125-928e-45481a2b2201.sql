
-- Storage bucket for uniform images
INSERT INTO storage.buckets (id, name, public) VALUES ('uniforms', 'uniforms', true);

-- Allow anyone authenticated to view
CREATE POLICY "Anyone can view uniform images" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'uniforms');

-- Only admin/principal can upload
CREATE POLICY "Admins can upload uniform images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'uniforms' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'principal')));

-- Only admin/principal can update
CREATE POLICY "Admins can update uniform images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'uniforms' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'principal')));

-- Only admin/principal can delete
CREATE POLICY "Admins can delete uniform images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'uniforms' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'principal')));

-- Table to track uniform image URLs
CREATE TABLE public.uniform_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('girls', 'boys')),
  image_url text NOT NULL,
  updated_by text NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(type)
);

ALTER TABLE public.uniform_images ENABLE ROW LEVEL SECURITY;

-- Everyone authenticated can view
CREATE POLICY "Anyone can view uniforms" ON public.uniform_images FOR SELECT TO authenticated USING (true);

-- Only admin/principal can insert
CREATE POLICY "Admins can insert uniforms" ON public.uniform_images FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'principal'));

-- Only admin/principal can update
CREATE POLICY "Admins can update uniforms" ON public.uniform_images FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'principal'));

-- Only admin/principal can delete
CREATE POLICY "Admins can delete uniforms" ON public.uniform_images FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'principal'));

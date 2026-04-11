
-- Create fee status enum
DO $$ BEGIN
  CREATE TYPE public.fee_status AS ENUM ('pending', 'paid', 'overdue');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create fees table
CREATE TABLE public.fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_user_id uuid NOT NULL,
  student_name text NOT NULL,
  class text NOT NULL,
  section text NOT NULL DEFAULT 'A',
  amount numeric NOT NULL DEFAULT 0,
  due_date date NOT NULL,
  paid_date date,
  status fee_status NOT NULL DEFAULT 'pending',
  month text NOT NULL,
  description text DEFAULT 'Monthly Fee',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;

-- RLS: Admin/Principal full access
CREATE POLICY "Admins can do everything with fees"
ON public.fees FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role));

-- RLS: Students view own fees
CREATE POLICY "Students can view own fees"
ON public.fees FOR SELECT
TO authenticated
USING (auth.uid() = student_user_id);

-- RLS: Teachers view all fees
CREATE POLICY "Teachers can view all fees"
ON public.fees FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'teacher'::app_role));

-- Updated_at trigger
CREATE TRIGGER update_fees_updated_at
BEFORE UPDATE ON public.fees
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

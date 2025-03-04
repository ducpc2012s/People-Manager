
-- Cập nhật RLS cho bảng users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM public.users u 
    JOIN public.roles r ON u.role_id = r.id 
    WHERE u.id = auth.uid() AND r.name IN ('Quản trị viên', 'Quản lý')
  ));

CREATE POLICY "Admin can update users" ON public.users
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.users u 
    JOIN public.roles r ON u.role_id = r.id 
    WHERE u.id = auth.uid() AND r.name IN ('Quản trị viên', 'Quản lý')
  ) OR auth.uid() = id);

-- Cập nhật RLS cho bảng employees
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All users can view employees" ON public.employees
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can manage employees" ON public.employees
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.users u 
    JOIN public.roles r ON u.role_id = r.id 
    WHERE u.id = auth.uid() AND r.name IN ('Quản trị viên', 'Quản lý', 'Nhân sự')
  ));

-- Cập nhật RLS cho bảng attendance
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all attendance" ON public.attendance
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own attendance" ON public.attendance
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.employees e
    WHERE e.id = employee_id AND e.user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.users u 
    JOIN public.roles r ON u.role_id = r.id 
    WHERE u.id = auth.uid() AND r.name IN ('Quản trị viên', 'Quản lý', 'Nhân sự')
  ));

-- Cập nhật RLS cho bảng projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All users can view projects" ON public.projects
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin and managers can manage projects" ON public.projects
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.users u 
    JOIN public.roles r ON u.role_id = r.id 
    WHERE u.id = auth.uid() AND r.name IN ('Quản trị viên', 'Quản lý')
  ));

-- Cập nhật RLS cho bảng project_members
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All users can view project members" ON public.project_members
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin and managers can manage project members" ON public.project_members
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.users u 
    JOIN public.roles r ON u.role_id = r.id 
    WHERE u.id = auth.uid() AND r.name IN ('Quản trị viên', 'Quản lý')
  ));

-- Cập nhật RLS cho bảng roles
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All users can view roles" ON public.roles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admin can manage roles" ON public.roles
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.users u 
    JOIN public.roles r ON u.role_id = r.id 
    WHERE u.id = auth.uid() AND r.name = 'Quản trị viên'
  ));

-- Cập nhật RLS cho bảng departments
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All users can view departments" ON public.departments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin and managers can manage departments" ON public.departments
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.users u 
    JOIN public.roles r ON u.role_id = r.id 
    WHERE u.id = auth.uid() AND r.name IN ('Quản trị viên', 'Quản lý')
  ));

-- Bật Realtime tracking cho các bảng chính
ALTER TABLE employees REPLICA IDENTITY FULL;
ALTER TABLE users REPLICA IDENTITY FULL;
ALTER TABLE attendance REPLICA IDENTITY FULL;
ALTER TABLE projects REPLICA IDENTITY FULL;
ALTER TABLE project_members REPLICA IDENTITY FULL;

-- Đồng bộ sự kiện Realtime
BEGIN;
  -- Đảm bảo extension pg_cron đã được kích hoạt
  -- CREATE EXTENSION IF NOT EXISTS pg_cron;
  
  -- Tạo function để cập nhật thời gian làm việc dựa trên check_in và check_out
  CREATE OR REPLACE FUNCTION update_work_hours()
  RETURNS TRIGGER AS $$
  BEGIN
    IF NEW.check_in IS NOT NULL AND NEW.check_out IS NOT NULL THEN
      NEW.work_hours = EXTRACT(EPOCH FROM (NEW.check_out::time - NEW.check_in::time)) / 3600;
    END IF;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  -- Tạo trigger cho function update_work_hours
  DROP TRIGGER IF EXISTS tr_update_work_hours ON attendance;
  CREATE TRIGGER tr_update_work_hours
  BEFORE INSERT OR UPDATE ON attendance
  FOR EACH ROW
  EXECUTE FUNCTION update_work_hours();
COMMIT;


-- Tạo bảng roles (vai trò)
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng departments (phòng ban)
CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng users (người dùng)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  role_id INTEGER REFERENCES roles(id),
  department_id INTEGER REFERENCES departments(id),
  avatar_url TEXT,
  status VARCHAR(20) DEFAULT 'active',
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng permissions (quyền)
CREATE TABLE permissions (
  id SERIAL PRIMARY KEY,
  role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
  module VARCHAR(50) NOT NULL,
  can_view BOOLEAN DEFAULT FALSE,
  can_create BOOLEAN DEFAULT FALSE,
  can_edit BOOLEAN DEFAULT FALSE,
  can_delete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(role_id, module)
);

-- Tạo bảng employees (nhân viên)
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  employee_code VARCHAR(50) UNIQUE,
  phone_number VARCHAR(20),
  address TEXT,
  position VARCHAR(100),
  join_date DATE NOT NULL,
  salary DECIMAL(15, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng attendance (chấm công)
CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  check_in TIME,
  check_out TIME,
  status VARCHAR(20) NOT NULL,
  work_hours DECIMAL(5, 2),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(employee_id, date)
);

-- Tạo bảng projects (dự án)
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR(20) NOT NULL,
  budget DECIMAL(15, 2),
  client VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng project_members (thành viên dự án)
CREATE TABLE project_members (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
  role VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, employee_id)
);

-- Chèn dữ liệu mẫu cho vai trò
INSERT INTO roles (name, description) VALUES
  ('Quản trị viên', 'Quyền truy cập toàn bộ hệ thống'),
  ('Quản lý', 'Quản lý dự án, nhân viên và báo cáo'),
  ('Nhân sự', 'Quản lý thông tin nhân viên, chấm công'),
  ('Kế toán', 'Quản lý lương, chi phí dự án'),
  ('Nhân viên', 'Xem thông tin công việc cá nhân');

-- Chèn dữ liệu mẫu cho phòng ban
INSERT INTO departments (name, description) VALUES
  ('Ban quản lý', 'Ban lãnh đạo cao nhất của công ty'),
  ('Phòng thiết kế', 'Phòng phụ trách thiết kế kiến trúc, nội thất'),
  ('Phòng thi công', 'Phòng phụ trách công tác thi công, giám sát'),
  ('Phòng dự án', 'Phòng phụ trách quản lý các dự án'),
  ('Phòng tài chính', 'Phòng phụ trách tài chính, kế toán'),
  ('Phòng nhân sự', 'Phòng phụ trách nhân sự, tuyển dụng');

-- Thiết lập RLS policies cho bảng users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data" ON users
  FOR SELECT
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM users u 
    JOIN roles r ON u.role_id = r.id 
    WHERE u.id = auth.uid() AND r.name = 'Quản trị viên'
  ));

CREATE POLICY "Admin can insert users" ON users
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM users u 
    JOIN roles r ON u.role_id = r.id 
    WHERE u.id = auth.uid() AND r.name = 'Quản trị viên'
  ) OR auth.uid() = id);

CREATE POLICY "Admin can update users" ON users
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM users u 
    JOIN roles r ON u.role_id = r.id 
    WHERE u.id = auth.uid() AND r.name = 'Quản trị viên'
  ) OR auth.uid() = id);

CREATE POLICY "Admin can delete users" ON users
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM users u 
    JOIN roles r ON u.role_id = r.id 
    WHERE u.id = auth.uid() AND r.name = 'Quản trị viên'
  ));

-- Tương tự thiết lập RLS policies cho các bảng khác
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

-- RLS cho roles
CREATE POLICY "Users can view roles" ON roles FOR SELECT USING (true);
CREATE POLICY "Admin can manage roles" ON roles
  USING (EXISTS (
    SELECT 1 FROM users u 
    JOIN roles r ON u.role_id = r.id 
    WHERE u.id = auth.uid() AND r.name = 'Quản trị viên'
  ));

-- RLS cho permissions
CREATE POLICY "Users can view permissions" ON permissions FOR SELECT USING (true);
CREATE POLICY "Admin can manage permissions" ON permissions
  USING (EXISTS (
    SELECT 1 FROM users u 
    JOIN roles r ON u.role_id = r.id 
    WHERE u.id = auth.uid() AND r.name = 'Quản trị viên'
  ));

-- Chức năng để cập nhật trường updated_at tự động
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers để tự động cập nhật updated_at
CREATE TRIGGER update_users_modtime
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_roles_modtime
  BEFORE UPDATE ON roles
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_departments_modtime
  BEFORE UPDATE ON departments
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_permissions_modtime
  BEFORE UPDATE ON permissions
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_employees_modtime
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_attendance_modtime
  BEFORE UPDATE ON attendance
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_projects_modtime
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_project_members_modtime
  BEFORE UPDATE ON project_members
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();

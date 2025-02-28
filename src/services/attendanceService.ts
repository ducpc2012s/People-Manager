
import { supabase, Attendance, Employee } from '@/lib/supabase';

export const fetchAttendanceByDate = async (date: string): Promise<(Attendance & { employee?: Employee })[]> => {
  const { data, error } = await supabase
    .from('attendance')
    .select(`
      *,
      employees:employee_id(*)
    `)
    .eq('date', date)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data.map(attendance => ({
    ...attendance,
    employee: attendance.employees
  })) || [];
};

export const fetchAttendanceByEmployee = async (employeeId: number): Promise<Attendance[]> => {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('employee_id', employeeId)
    .order('date', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

export const recordAttendance = async (attendanceData: Partial<Attendance>): Promise<Attendance> => {
  // Kiểm tra nếu đã có bản ghi cho ngày và nhân viên này
  const { data: existingRecord, error: checkError } = await supabase
    .from('attendance')
    .select('*')
    .eq('employee_id', attendanceData.employee_id!)
    .eq('date', attendanceData.date!)
    .maybeSingle();

  if (checkError) {
    throw checkError;
  }

  if (existingRecord) {
    // Cập nhật bản ghi hiện có
    const { data, error } = await supabase
      .from('attendance')
      .update({
        ...attendanceData,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingRecord.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } else {
    // Tạo bản ghi mới
    const { data, error } = await supabase
      .from('attendance')
      .insert({
        ...attendanceData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }
};

export const calculateWorkHours = (checkIn: string, checkOut: string): number => {
  const checkInTime = new Date(`1970-01-01T${checkIn}`);
  const checkOutTime = new Date(`1970-01-01T${checkOut}`);
  
  // Nếu checkOut là ngày hôm sau, thêm 1 ngày
  if (checkOutTime < checkInTime) {
    checkOutTime.setDate(checkOutTime.getDate() + 1);
  }
  
  const diffMs = checkOutTime.getTime() - checkInTime.getTime();
  // Chuyển đổi từ milliseconds sang giờ
  return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
};


import { supabase, Attendance } from '@/lib/supabase';

export const fetchAttendance = async (date?: string): Promise<Attendance[]> => {
  let query = supabase
    .from('attendance')
    .select(`
      *,
      employee:employee_id(
        id,
        employee_code,
        position,
        user_id(id, full_name, email, avatar_url)
      )
    `)
    .order('date', { ascending: false });

  if (date) {
    query = query.eq('date', date);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching attendance:', error);
    throw error;
  }

  return data || [];
};

export const fetchAttendanceByEmployee = async (employeeId: number): Promise<Attendance[]> => {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('employee_id', employeeId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching employee attendance:', error);
    throw error;
  }

  return data || [];
};

export const checkIn = async (employeeId: number, date: string, time: string): Promise<Attendance> => {
  // Kiểm tra xem đã có bản ghi chấm công cho ngày hôm nay chưa
  const { data: existingRecord, error: checkError } = await supabase
    .from('attendance')
    .select('*')
    .eq('employee_id', employeeId)
    .eq('date', date)
    .maybeSingle();

  if (checkError) {
    console.error('Error checking existing attendance:', checkError);
    throw checkError;
  }

  if (existingRecord) {
    // Nếu đã có bản ghi, cập nhật check_in
    const { data, error } = await supabase
      .from('attendance')
      .update({
        check_in: time,
        status: 'present',
      })
      .eq('id', existingRecord.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating check-in:', error);
      throw error;
    }

    return data;
  } else {
    // Nếu chưa có, tạo bản ghi mới
    const { data, error } = await supabase
      .from('attendance')
      .insert([
        {
          employee_id: employeeId,
          date,
          check_in: time,
          status: 'present',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating check-in:', error);
      throw error;
    }

    return data;
  }
};

export const checkOut = async (attendanceId: number, time: string): Promise<Attendance> => {
  const { data, error } = await supabase
    .from('attendance')
    .update({
      check_out: time,
    })
    .eq('id', attendanceId)
    .select()
    .single();

  if (error) {
    console.error('Error updating check-out:', error);
    throw error;
  }

  return data;
};

export const updateAttendance = async (
  attendanceId: number,
  attendanceData: Partial<Attendance>
): Promise<Attendance> => {
  const { data, error } = await supabase
    .from('attendance')
    .update(attendanceData)
    .eq('id', attendanceId)
    .select()
    .single();

  if (error) {
    console.error('Error updating attendance:', error);
    throw error;
  }

  return data;
};

export const deleteAttendance = async (attendanceId: number): Promise<void> => {
  const { error } = await supabase
    .from('attendance')
    .delete()
    .eq('id', attendanceId);

  if (error) {
    console.error('Error deleting attendance:', error);
    throw error;
  }
};

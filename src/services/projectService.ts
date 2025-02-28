
import { supabase, Project, ProjectMember, Employee } from '@/lib/supabase';

export const fetchProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

export const fetchProject = async (projectId: number): Promise<Project | null> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const createProject = async (projectData: Partial<Project>): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects')
    .insert({
      ...projectData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const updateProject = async (projectId: number, projectData: Partial<Project>): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects')
    .update({
      ...projectData,
      updated_at: new Date().toISOString()
    })
    .eq('id', projectId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const deleteProject = async (projectId: number): Promise<void> => {
  // Xóa thành viên dự án trước
  const { error: memberError } = await supabase
    .from('project_members')
    .delete()
    .eq('project_id', projectId);

  if (memberError) {
    throw memberError;
  }

  // Sau đó xóa dự án
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);

  if (error) {
    throw error;
  }
};

export const fetchProjectMembers = async (projectId: number): Promise<(ProjectMember & { employee?: Employee })[]> => {
  const { data, error } = await supabase
    .from('project_members')
    .select(`
      *,
      employees:employee_id(*)
    `)
    .eq('project_id', projectId);

  if (error) {
    throw error;
  }

  return data.map(member => ({
    ...member,
    employee: member.employees
  })) || [];
};

export const addProjectMember = async (memberData: Partial<ProjectMember>): Promise<ProjectMember> => {
  const { data, error } = await supabase
    .from('project_members')
    .insert({
      ...memberData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const removeProjectMember = async (memberId: number): Promise<void> => {
  const { error } = await supabase
    .from('project_members')
    .delete()
    .eq('id', memberId);

  if (error) {
    throw error;
  }
};

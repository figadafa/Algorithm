import { supabase } from '@/lib/supabase';

export interface LearningTask {
  id: string;
  user_id: string;
  title: string;
  xp_points: number;
  status: "pending" | "completed";
  created_at: string;
}

/**
 * Mengambil daftar tugas belajar milik pengguna yang sedang login.
 * Urut berdasarkan created_at desc.
 */
export async function fetchTasks() {
  const { data, error } = await supabase
    .from('learning_tasks')
    .select('*')
    .order('created_at', { ascending: false });

  return { data: data as LearningTask[] | null, error };
}

/**
 * Membuat tugas belajar baru.
 * user_id diisi otomatis oleh Supabase (auth.uid()).
 */
export async function createTask(title: string, xpPoints: number) {
  const { data, error } = await supabase
    .from('learning_tasks')
    .insert([{ title, xp_points: xpPoints }])
    .select()
    .single();

  return { data: data as LearningTask | null, error };
}

/**
 * Memperbarui status tugas belajar.
 */
export async function updateTaskStatus(id: string, status: "pending" | "completed") {
  const { data, error } = await supabase
    .from('learning_tasks')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  return { data: data as LearningTask | null, error };
}

/**
 * Menghapus tugas belajar.
 */
export async function deleteTask(id: string) {
  const { error } = await supabase
    .from('learning_tasks')
    .delete()
    .eq('id', id);

  return { error };
}

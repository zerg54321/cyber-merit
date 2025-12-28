import { supabase } from '../lib/supabase';

// --- 统一数据类型定义 ---

export interface Entry {
  id?: string;
  type: 'plus' | 'minus';
  content: string;
  timestamp: number;
}

// 补充 Archive 类型定义，方便前端调用
export interface Archive {
  id: string;
  title: string;
  target_merit: number;
  entries: Entry[]; // 存储在 JSON 字段中的明细
  started_at: number;
  completed_at: number;
}

export const ledgerService = {
  // ================= 1. 现行功德 (entries) 操作 =================

  // 从云端获取所有记录
  async getEntries(): Promise<Entry[]> {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('获取失败:', error.message);
      return [];
    }
    return data as Entry[];
  },

  // 存入新记录到云端
  async addEntry(entry: Omit<Entry, 'id'>) {
    const { data, error } = await supabase
      .from('entries')
      .insert([entry])
      .select();

    if (error) throw error;
    return data[0];
  },

  // 删除云端现行记录
  async deleteEntry(id: string) {
    const { error } = await supabase
      .from('entries')
      .delete()
      .eq('id', id); // 推荐使用 .eq() 替代 .match()

    if (error) throw error;
  },

  // ================= 2. 往昔档案 (archives) 操作 =================

  // 获取所有已封箱的档案
  async getArchives(): Promise<Archive[]> {
    const { data, error } = await supabase
      .from('archives')
      .select('*')
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('获取档案失败:', error.message);
      return [];
    }
    return data as Archive[];
  },

  /**
   * 删除指定的封箱档案 (新功能)
   * 用于焚毁测试数据或私密记录
   */
  async deleteArchive(id: string) {
    const { error } = await supabase
      .from('archives')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('删除档案失败:', error.message);
      throw error;
    }
  }
};
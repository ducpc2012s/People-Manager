
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

/**
 * Hook để quản lý việc đồng bộ hóa dữ liệu
 * @param tables Mảng các tên bảng cần đồng bộ
 */
export const useSyncData = (tables: string[] = []) => {
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const queryClient = useQueryClient();

  // Thiết lập realtime cho các bảng
  useEffect(() => {
    if (!tables.length) return;

    const channels = tables.map(table => {
      return supabase
        .channel(`${table}-sync-channel`)
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table 
        }, () => {
          setHasChanges(true);
        })
        .subscribe((status) => {
          console.log(`Subscription status for ${table}:`, status);
        });
    });

    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [tables]);

  // Hàm đồng bộ dữ liệu
  const syncData = useCallback(async () => {
    if (syncing || !tables.length) return;

    setSyncing(true);
    try {
      // Invalidate tất cả các queries liên quan đến các bảng
      tables.forEach(table => {
        queryClient.invalidateQueries({ queryKey: [table] });
      });

      setLastSynced(new Date());
      setHasChanges(false);
      toast.success('Đồng bộ dữ liệu thành công');
    } catch (error) {
      console.error('Lỗi khi đồng bộ dữ liệu:', error);
      toast.error('Đồng bộ dữ liệu thất bại');
    } finally {
      setSyncing(false);
    }
  }, [syncing, tables, queryClient]);

  // Đồng bộ dữ liệu tự động khi có thay đổi
  useEffect(() => {
    if (hasChanges) {
      syncData();
    }
  }, [hasChanges, syncData]);

  // Đồng bộ dữ liệu lần đầu khi component mount
  useEffect(() => {
    syncData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    syncing,
    lastSynced,
    hasChanges,
    syncData
  };
};

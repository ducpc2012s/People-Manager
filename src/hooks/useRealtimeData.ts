
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

type RealtimeConfig = {
  table: string;
  schema?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
};

/**
 * Hook để theo dõi thay đổi realtime từ Supabase cho bảng cụ thể
 * @param queryKey - React Query key để invalidate khi có thay đổi 
 * @param config - Cấu hình realtime
 */
export const useRealtimeData = (
  queryKey: string | string[],
  config: RealtimeConfig
) => {
  const queryClient = useQueryClient();
  const { table, schema = 'public', event = '*', filter } = config;

  useEffect(() => {
    // Thiết lập channel
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event,
          schema,
          table,
          filter,
        } as any, // Use type assertion to bypass the TypeScript error
        (payload) => {
          console.log('Realtime change detected:', payload);
          // Invalidate query để React Query tự động fetch lại data
          queryClient.invalidateQueries({ queryKey: Array.isArray(queryKey) ? queryKey : [queryKey] });
        }
      )
      .subscribe();

    // Cleanup khi component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryKey, table, schema, event, filter, queryClient]);
};

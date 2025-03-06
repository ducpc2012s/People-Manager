
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { supabase } from '@/lib/supabase'

// Kiểm tra kết nối Supabase trước khi render app
const initApp = async () => {
  try {
    // Kiểm tra kết nối Supabase bằng cách truy vấn đơn giản hơn
    // Sử dụng truy vấn departments thay vì roles để tránh vấn đề RLS đệ quy
    const { error } = await supabase.from('departments').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Lỗi kết nối Supabase:', error.message);
      
      // Hiển thị thông báo lỗi nếu không thể kết nối tới database
      if (!error.message.includes('JWT')) {
        document.getElementById("root")!.innerHTML = `
          <div style="text-align: center; padding: 2rem; font-family: system-ui, sans-serif;">
            <h2>Không thể kết nối đến cơ sở dữ liệu</h2>
            <p>Vui lòng kiểm tra cấu hình Supabase và đảm bảo database đã được khởi tạo.</p>
            <p>Lỗi: ${error.message}</p>
            <button onclick="location.reload()" style="padding: 0.5rem 1rem; background: #4f46e5; color: white; border: none; border-radius: 0.25rem; cursor: pointer;">Làm mới trang</button>
          </div>
        `;
        return;
      }
    }

    // Nếu kết nối thành công, render app
    createRoot(document.getElementById("root")!).render(<App />);
  } catch (error: any) {
    console.error('Lỗi khởi tạo ứng dụng:', error);
    document.getElementById("root")!.innerHTML = `
      <div style="text-align: center; padding: 2rem; font-family: system-ui, sans-serif;">
        <h2>Đã xảy ra lỗi khi khởi tạo ứng dụng</h2>
        <p>Vui lòng kiểm tra console để biết thêm chi tiết</p>
        <p>Lỗi: ${error.message || 'Không rõ nguyên nhân'}</p>
        <button onclick="location.reload()" style="padding: 0.5rem 1rem; background: #4f46e5; color: white; border: none; border-radius: 0.25rem; cursor: pointer;">Làm mới trang</button>
      </div>
    `;
  }
};

initApp();

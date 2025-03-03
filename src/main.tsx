
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { supabase } from '@/lib/supabase'

// Kiểm tra kết nối Supabase trước khi render app
const initApp = async () => {
  try {
    // Kiểm tra kết nối Supabase
    const { error } = await supabase.from('roles').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.warn('Cảnh báo kết nối Supabase:', error.message);
      
      // Nếu lỗi không phải lỗi JWT, thì có thể là lỗi kết nối
      if (!error.message.includes('JWT')) {
        document.getElementById("root")!.innerHTML = `
          <div style="text-align: center; padding: 2rem; font-family: system-ui, sans-serif;">
            <h2>Đã kết nối đến Supabase nhưng có vấn đề với cơ sở dữ liệu</h2>
            <p>Có thể là do bảng 'roles' chưa được tạo hoặc quyền truy cập chưa được cấu hình.</p>
            <p>Lỗi: ${error.message}</p>
            <button onclick="location.reload()" style="padding: 0.5rem 1rem; background: #4f46e5; color: white; border: none; border-radius: 0.25rem; cursor: pointer;">Làm mới trang</button>
          </div>
        `;
        return;
      }
      
      // Nếu là lỗi JWT, vẫn tiếp tục vì đây là lỗi phổ biến khi chưa đăng nhập
      console.info("Lỗi JWT bình thường khi chưa đăng nhập, tiếp tục khởi chạy ứng dụng");
    }

    // Nếu kết nối thành công, render app
    createRoot(document.getElementById("root")!).render(<App />);
  } catch (error) {
    console.error('Lỗi khởi tạo ứng dụng:', error);
    document.getElementById("root")!.innerHTML = `
      <div style="text-align: center; padding: 2rem; font-family: system-ui, sans-serif;">
        <h2>Đã xảy ra lỗi khi khởi tạo ứng dụng</h2>
        <p>Vui lòng kiểm tra console để biết thêm chi tiết</p>
        <button onclick="location.reload()" style="padding: 0.5rem 1rem; background: #4f46e5; color: white; border: none; border-radius: 0.25rem; cursor: pointer;">Làm mới trang</button>
      </div>
    `;
  }
};

initApp();

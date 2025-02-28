
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { supabase } from '@/lib/supabase'

// Kiểm tra kết nối Supabase trước khi render app
const initApp = async () => {
  try {
    // Kiểm tra kết nối Supabase
    const { error } = await supabase.from('roles').select('count', { count: 'exact', head: true });
    
    if (error && !error.message.includes('JWT')) {
      console.error('Lỗi kết nối Supabase:', error.message);
      document.getElementById("root")!.innerHTML = `
        <div style="text-align: center; padding: 2rem; font-family: system-ui, sans-serif;">
          <h2>Không thể kết nối đến cơ sở dữ liệu</h2>
          <p>Vui lòng kiểm tra cấu hình Supabase trong file .env</p>
          <pre style="background: #f1f1f1; padding: 1rem; text-align: left; margin: 1rem auto; max-width: 500px; border-radius: 5px;">
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
          </pre>
          <p>Sau khi cập nhật cấu hình, làm mới trang để thử lại.</p>
          <button onclick="location.reload()" style="padding: 0.5rem 1rem; background: #4f46e5; color: white; border: none; border-radius: 0.25rem; cursor: pointer;">Làm mới trang</button>
        </div>
      `;
      return;
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

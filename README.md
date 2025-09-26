Musicist là ứng dụng web progressive (PWA) cho phép tải lên, quản lý và phát nhạc ngay cả khi offline. Nhạc được lưu trực tiếp trên thiết bị qua IndexedDB, hoạt động độc lập mà không cần server.

✨ Tính năng chính

Phát nhạc: MP3, WAV, OGG, M4A, FLAC, AAC; có Play/Pause, Next/Prev, Shuffle, Repeat, thanh tiến trình, âm lượng.

PWA: Cài đặt như app, chạy offline nhờ Service Worker, giao diện responsive.

Lưu trữ cục bộ: IndexedDB lưu file + metadata, hỗ trợ drag & drop upload.

Playlist: Tự động tạo từ files, xóa track hoặc clear toàn bộ, hiển thị thông tin nhạc.

Giao diện: Dark/Light theme, thiết kế hiện đại.

🛠️ Công nghệ

React 18 + Styled Components

IndexedDB, Service Worker, Web Audio API

Build bằng Create React App, deploy GitHub Pages

🚀 Cài đặt & chạy
git clone https://github.com/your-username/musicist.git
cd musicist
npm install
npm start


Truy cập: http://localhost:3000

Build production:

npm run build
npx serve -s build

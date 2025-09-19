# 🎵 Musicist - Progressive Web App Music Player

![Musicist Banner](https://via.placeholder.com/800x200/1DB954/ffffff?text=Musicist+-+PWA+Music+Player)

Musicist là một ứng dụng web progressive (PWA) cho phép bạn tải lên và phát nhạc offline. Ứng dụng lưu trữ toàn bộ âm nhạc của bạn cục bộ và hoạt động hoàn toàn offline sau khi tải trang lần đầu.

## ✨ Tính năng

### 🎶 Phát nhạc
- Hỗ trợ nhiều định dạng audio: MP3, WAV, OGG, M4A, FLAC, AAC
- Controls đầy đủ: Play/Pause, Next/Previous, Shuffle, Repeat
- Thanh tiến trình với khả năng tua nhanh
- Điều khiển âm lượng và tắt tiếng

### 📱 Progressive Web App (PWA)
- Hoạt động offline hoàn toàn
- Có thể cài đặt như ứng dụng native
- Service Worker cache toàn bộ assets và audio files
- Responsive design cho mọi thiết bị

### 💾 Lưu trữ cục bộ
- IndexedDB để lưu trữ audio files và metadata
- Không giới hạn dung lượng (tùy thuộc thiết bị)
- Tự động cache cho offline playback

### 🎨 Giao diện người dùng
- Dark/Light theme toggle
- Modern, responsive design
- Drag & drop file upload
- Playlist management với khả năng xóa tracks

### 🔄 Quản lý playlist
- Tự động tạo playlist từ files upload
- Shuffle và repeat modes
- Xóa từng track hoặc clear toàn bộ playlist
- Hiển thị thông tin file: tên, kích thước, thời lượng

## 🚀 Demo

Truy cập: [https://your-username.github.io/musicist](https://your-username.github.io/musicist)

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Styled Components** - CSS-in-JS styling
- **React Icons** - Icon library

### Storage & Caching
- **IndexedDB** - Client-side database cho audio files
- **Service Worker** - Offline caching và background sync
- **Web Audio API** - Audio processing

### Build & Deployment
- **Create React App** - Build tooling
- **GitHub Pages** - Static hosting
- **PWA Manifest** - App installation

## ⚡ Cài đặt và Chạy

### Yêu cầu hệ thống
- Node.js 16+
- npm hoặc yarn
- Modern browser với support cho:
  - Service Workers
  - IndexedDB
  - Web Audio API
  - File API

### Clone và cài đặt
```bash
# Clone repository
git clone https://github.com/your-username/musicist.git
cd musicist

# Cài đặt dependencies
npm install

# Chạy development server
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

### Build cho production
```bash
# Tạo production build
npm run build

# Serve static files (optional)
npx serve -s build
```

## 📱 Cài đặt như PWA

### Desktop (Chrome, Edge, Firefox)
1. Mở ứng dụng trong browser
2. Nhấn icon "Install" trên address bar
3. Hoặc Menu > "Install Musicist"

### Mobile (Android/iOS)
1. Mở trong mobile browser
2. Menu > "Add to Home Screen"
3. Confirm installation

## 📚 Cách sử dụng

### 1. Upload nhạc
- Click "Choose Files" hoặc drag & drop files
- Hỗ trợ multiple files cùng lúc
- Files được tự động lưu vào IndexedDB

### 2. Phát nhạc
- Click track trong playlist để phát
- Sử dụng controls để điều khiển playback
- Shuffle/Repeat modes cho playback options

### 3. Quản lý playlist
- Xóa từng track bằng trash icon
- "Clear All" để xóa toàn bộ playlist
- Tracks được lưu persistent qua sessions

### 4. Offline usage
- Sau khi upload, disconnect internet
- Ứng dụng vẫn hoạt động hoàn toàn offline
- Service worker serve cached content

## 📄 License

Dự án được phân phối dưới MIT License.

```
MIT License

Copyright (c) 2024 Musicist

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

⭐ Nếu dự án này hữu ích, hãy star repo để support development!

#PWA #React #Music #OfflineFirst #WebAudio #IndexedDB

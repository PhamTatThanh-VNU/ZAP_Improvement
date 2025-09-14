# Session Script Juice Shop

Script này dùng để quản lý phiên đăng nhập (session management) cho ứng dụng OWASP Juice Shop khi kiểm thử bảo mật với ZAP.  
Nó giúp ZAP tự động đăng nhập, lưu và sử dụng lại token xác thực trong quá trình quét, đảm bảo các request luôn hợp lệ và có quyền truy cập.

---

## Các hàm 

### 1. extractWebSession(sessionWrapper)
- **Chức năng:** Trích xuất token xác thực từ phản hồi đăng nhập (response) và lưu vào session của ZAP.
- **Tham số:** 
  - `sessionWrapper`: Đối tượng chứa thông tin về phiên làm việc và HTTP message.
- **Ý nghĩa:** Đảm bảo ZAP lưu lại token sau khi đăng nhập thành công để sử dụng cho các request tiếp theo.

### 2. clearWebSessionIdentifiers(sessionWrapper)
- **Chức năng:** Xóa thông tin xác thực khỏi header của request (ví dụ: Authorization).
- **Tham số:** 
  - `sessionWrapper`: Đối tượng chứa thông tin về phiên làm việc và HTTP message.
- **Ý nghĩa:** Đảm bảo khi đăng xuất hoặc chuyển phiên, các thông tin xác thực cũ không còn trong request.

### 3. processMessageToMatchSession(sessionWrapper)
- **Chức năng:** Thêm token xác thực vào header và cookie của request để đảm bảo các request gửi đi đều hợp lệ.
- **Tham số:** 
  - `sessionWrapper`: Đối tượng chứa thông tin về phiên làm việc và HTTP message.
- **Ý nghĩa:** Giúp ZAP duy trì trạng thái đăng nhập khi gửi các request kiểm thử.

### 4. getRequiredParamsNames()
- **Chức năng:** Trả về danh sách các tham số bắt buộc cho script (nếu có).
- **Ý nghĩa:** Thường để trống nếu không cần tham số bắt buộc.

### 5. getOptionalParamsNames()
- **Chức năng:** Trả về danh sách các tham số tùy chọn cho script (nếu có).
- **Ý nghĩa:** Thường để trống nếu không cần tham số tùy chọn.

---

## Cách hoạt động

1. Khi ZAP thực hiện đăng nhập, script sẽ lấy token xác thực từ phản hồi và lưu lại.
2. Các request tiếp theo sẽ được tự động chèn token vào header và cookie, giúp duy trì trạng thái đăng nhập.
3. Khi cần xóa thông tin xác thực (ví dụ đăng xuất), script sẽ loại bỏ token khỏi request.

---

## Lý do sử dụng Script

- Tự động hóa quá trình đăng nhập và quản lý phiên cho Juice Shop.
- Đảm bảo các request kiểm thử luôn hợp lệ và có quyền truy cập.
- Hỗ trợ kiểm thử các chức năng yêu cầu xác thực.

---
# ZAP Passive Scripts

ZAP Passive Scripts là các script mở rộng cho OWASP ZAP, giúp kiểm thử bảo mật ứng dụng web một cách thụ động. Passive Script chỉ phân tích các request/response đi qua ZAP mà không tạo thêm request mới tới serve.

---

## Các hàm trong Passive Script

### 1. getMetadata()
- **Chức năng:** Định nghĩa thông tin về rule (ID, tên, mô tả, giải pháp, tham khảo, mức độ rủi ro, confidence, các tag).
- **Tham số:** Không có.
- **Ý nghĩa:** ZAP sử dụng metadata này để hiển thị thông tin khi phát hiện lỗ hổng.

### 2. scan(ps, msg, src)
- **Chức năng:** Hàm chính để kiểm tra từng HTTP request/response đi qua ZAP.
- **Tham số:**
  - `ps`: Đối tượng PassiveScriptHelper, cung cấp các hàm tạo alert, kiểm tra trạng thái, thêm tag, v.v.
  - `msg`: Đối tượng HttpMessage, chứa thông tin request/response của trang.
  - `src`: Đối tượng Jericho Source, đại diện cho nội dung HTML của response (dùng để phân tích DOM).
- **Ý nghĩa:** Dùng để kiểm tra các dấu hiệu lỗ hổng hoặc thông tin nhạy cảm trong request/response mà không làm thay đổi trạng thái ứng dụng.

### 3. ps.newAlert()
- **Chức năng:** Tạo một cảnh báo lỗ hổng mới.
- **Tham số:** Không có, nhưng có thể thiết lập các thuộc tính như tham số, bằng chứng, thông điệp, v.v. thông qua các hàm `.setParam()`, `.setEvidence()`, `.setMessage()`, ...
- **Ý nghĩa:** Báo cáo lỗ hổng khi phát hiện dấu hiệu bất thường trong request/response.

### 4. ps.addHistoryTag(tag)
- **Chức năng:** Thêm một tag vào lịch sử request/response để đánh dấu hoặc phân loại.
- **Tham số:** 
  - `tag`: Chuỗi ký tự dùng làm nhãn.
- **Ý nghĩa:** Giúp quản lý, lọc và phân loại các request/response đã được kiểm tra.

### 5. ps.getAlertThreshold()
- **Chức năng:** Lấy mức độ cảnh báo (Alert Threshold) hiện tại của quá trình quét.
- **Tham số:** Không có, trả về giá trị dạng chuỗi như `"LOW"`, `"MEDIUM"`, `"HIGH"`.
- **Ý nghĩa:** Giúp script điều chỉnh độ nhạy của kiểm thử, ví dụ chỉ tạo alert khi chắc chắn hoặc giảm alert dễ gây false positive khi threshold cao.

### 6. appliesToHistoryType(historyType)
- **Chức năng:** Xác định script có áp dụng cho loại lịch sử request/response nào không.
- **Tham số:**
  - `historyType`: Số nguyên đại diện cho loại lịch sử (ví dụ: spider, proxy, ...).
- **Ý nghĩa:** Giúp kiểm soát script chỉ chạy với các loại request/response mong muốn.

---

## Khả năng của Passive Script

- Phân tích request/response đi qua ZAP mà không tạo thêm request mới.
- Phát hiện các dấu hiệu lỗ hổng, thông tin nhạy cảm, cấu hình sai, v.v. 
- Tạo alert khi phát hiện vấn đề.
- Thêm tag để quản lý và phân loại các request/response.
- Kiểm soát mức độ kiểm thử qua hàm kiểm tra trạng thái cảnh báo.

---
## Template Passive Script
[GraalVM(Javascript)](./Passive%20default%20template%20GraalJS.js)<br>
[Zest(.zst) for CICD](./Passive%20default%20template.zst)

---
## Script Custom để quét thụ động lỗ hổng liên quan tới CWE-548 và CWE-200 trong OWASP Juice Shop
[CWE-548](./cwe-548.js)
<br>
[CWE-200](./metricsAlert.js)
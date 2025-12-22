# ZAP Active Scripts - Graal VM

* **ZAP Active Scripts** là các script mở rộng cho OWASP ZAP, giúp kiểm thử bảo mật ứng dụng web bằng cách tự động gửi các payload tấn công vào từng tham số và phân tích phản hồi để phát hiện lỗ hổng.
* **Graal VM**:  Bridge giúp Javascripts tương tác với Java trong môi trường của OWASP ZAP
---

## Các hàm trong Active Script - Viết code trong các hàm này để tạo script.

### 1. getMetadata()
- **Chức năng:** Định nghĩa thông tin về rule (ID, tên, mô tả, giải pháp, tham khảo, mức độ rủi ro, confidence, các tag).
- **Ý nghĩa:** ZAP sử dụng metadata này để hiển thị thông tin khi phát hiện lỗ hổng.

### 2. scanNode(as, msg)
- **Chức năng:** Được gọi cho mỗi node (mỗi URL Request) trong cây Sites của ZAP.
- **Tham số:**
  - `as`: Đối tượng ActiveScriptHelper, cung cấp các hàm gửi request, tạo alert, kiểm tra trạng thái scan, v.v.
  - `msg`: Đối tượng HttpMessage, chứa thông tin request/response của trang.
- **Ý nghĩa:** Thường dùng để kiểm tra các lỗ hổng liên quan đến từng URL , không phải từng tham số trong URL.

### 3. scan(as, msg, param, value)
- **Chức năng:** Được gọi cho từng tham số (parameter) trong mỗi URL request.
- **Tham số:**
  - `as`: Đối tượng ActiveScriptHelper.
  - `msg`: Đối tượng HttpMessage.
  - `param`: Tên tham số đang kiểm tra.
  - `value`: Giá trị gốc của tham số trước khi bị thay đổi bởi script (Giá trị này do Engine của ZAP truyền vào)
- **Ý nghĩa:** Đây là hàm chính để kiểm tra lỗ hổng injection hoặc các lỗi liên quan đến từng tham số đầu vào.

### 4. as.sendAndReceive(msg, followRedirect, handleAntiCSRFtoken)
- **Chức năng:** Gửi request và nhận response từ server.
- **Tham số:**
  - `msg`: Đối tượng HttpMessage gửi đi.
  - `followRedirect`: Có tự động theo redirect không (`true`/`false`) - nếu server trả về HTTP 3xx (redirect) , ZAP sẽ redirect theo đường dẫn mới và gửi tiếp request.
  - `handleAntiCSRFtoken`: Có xử lý Anti-CSRF token không (`true`/`false`) - tham số này giúp ZAP lấy CSRF Token và chèn vào request trước khi được gửi đi.
- **Ý nghĩa:** Dùng để gửi request đã được chỉnh sửa (thường là đã chèn payload tấn công).

### 5. as.setParam(msg, param, value)
- **Chức năng:** Thay đổi giá trị của tham số trong request.
- **Tham số:**
  - `msg`: Đối tượng HttpMessage.
  - `param`: Tên tham số cần thay đổi.
  - `value`: Giá trị mới cho tham số.
- **Ý nghĩa:** Dùng để chèn payload tấn công vào tham số.

### 6. as.newAlert()
- **Chức năng:** Tạo một cảnh báo lỗ hổng mới.
- **Tham số:** Không có, nhưng có thể thiết lập các thuộc tính như tham số, payload tấn công, bằng chứng, thông điệp, v.v. thông qua các hàm `.setParam()`, `.setAttack()`, `.setEvidence()`, `.setMessage()`, ...
- **Ý nghĩa:** Báo cáo lỗ hổng khi phát hiện dấu hiệu bất thường.

### 7. as.getAlertThreshold() và as.getAttackStrength()
- **Chức năng:** Lấy mức độ cảnh báo (Alert Threshold) và mức độ tấn công (Attack Strength) hiện tại của quá trình quét. Trả về giá trị dạng chuỗi như `"LOW"`, `"MEDIUM"`, `"HIGH"` (đối với threshold) hoặc `"LOW"`, `"MEDIUM"`, `"HIGH"`, `"INSANE"` (đối với strength).
- **Ý nghĩa:** Giúp script điều chỉnh độ nhạy và độ mạnh của kiểm thử. Ví dụ: chỉ thực hiện kiểm tra sâu hoặc thử nhiều payload khi mức tấn công là `"HIGH"` hoặc `"INSANE"`, hoặc giảm kiểm tra dễ gây false positive khi threshold là `"HIGH"`.
---

## Khả năng của Active Script

- Tùy chỉnh payload tấn công cho từng loại lỗ hổng.
- Kiểm tra phản hồi để phát hiện dấu hiệu lỗ hổng (bằng regex, mã lỗi, thông báo lỗi, ...).
- Tự động tạo alert khi phát hiện lỗ hổng.
- Kiểm soát mức độ kiểm thử qua các hàm kiểm tra trạng thái và mức độ cảnh báo/tấn công.
- Dễ dàng mở rộng và debug bằng các hàm log.

---
## Template Active Script
[GraalVM (Javascript)](./template_javascripts.js)<br>
[Zest(.zst) for CICD](./template_cicd_.zst)<br>
## Scripts được sinh bằng LLM và thử nghiệm trên OWASP Benchmark, OWASP Broken Crystal, OWASP Juice Shop
[LDAP Injection Custom.js](./LDAP%20Injection%20Test.js)<br>
[XPath Injection Custom.js](./XPath%20Injection%20Test.js)

## Update hướng dẫn chạy
Với script OAST CWE-502 (Python or Javascripts) cần vào Tool ZAP --> Tools --> Options --> OAST --> Chọn OOB Service Used In Active Scans là BOAST --> OK.

# Cải thiện độ phủ cho công cụ  kiểm thử bảo mật với ứng dụng web

Repo này tập trung vào các giải pháp nâng cao hiệu quả kiểm thử bảo mật cho ứng dụng web. Nội dung repo gồm 3 thư mục chính:

---

## 1. [Pipeline Auto Sectest](./Pipeline%20Auto%20Sectest)
Mục đich  của giải pháp giúp tăng lượng thông tin về trang web mục tiêu cho ZAP.  (Bằng cách tự động và thủ công).
Pipeline  trong folder  sử dụng  kỹ thuật tự động UI với công cụ Browser Use để tương tác với  trang web theo luồng nghiệp vụ được định nghĩa trước, từ đó giúp ZAP phát hiện lỗ hổng xuất hiện trên luồng đó.

---

## 2. [Scripts](./Scripts)
Mở rộng các script kiểm thử cho ZAP, bao gồm Active Script, Passive Script, Session Script,...  
Các script này giúp ZAP phát hiện nhiều loại lỗ hổng hơn và tùy chỉnh theo từng ứng dụng hoặc kịch bản kiểm thử cụ thể.

---

## 3. [wstg_markdown_data](./wstg_markdown_data)
Dữ liệu về [OWASP Web Security Testing Guide (WSTG)](https://owasp.org/www-project-web-security-testing-guide/), phục vụ xây dựng database hướng dẫn kiểm thử bảo mật trên web.  <br>
**Quickstart Langflow RAG**: 
- Truy cập [Langflow](https://www.datastax.com/products/langflow) và đăng nhập 
- Import file  [LLM RAG](./ZAP_Script_LLMRAG.json) . FIle này sẽ chứa database về WSTG, Prompt cho mô hình.  
- Cung cấp cho mô hình ngữ cảnh về 1 trong các loại template  ZAP scripts và tiến hành hỏi dáp<br>

Chi tiết trong [Demo](https://drive.google.com/drive/folders/1bamASoMwHqR-oiVxKNCVnNiIvIfuPstj?usp=sharing)

---
## 4. Demo Video
[Link](https://drive.google.com/drive/folders/1bamASoMwHqR-oiVxKNCVnNiIvIfuPstj?usp=sharing)
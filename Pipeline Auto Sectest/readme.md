# Bổ sung thông tin ứng Web cho công cụ ZAP
## 1.Thủ công
Mục đích của cách này là thủ công tương tác với trang Web, sử dụng ZAP Proxy để ghi lại tất cả các thông tin tương tác. Sau đó tận dụng Engine của công cụ (Passive + Active scan) để kiểm thử trên các thông tin này. 
![Ảnh minh họa luồng](./manual.png)

## 2. Pipeline tự động
Mục đích của cách này tương tự như cách thủ công, đều là để bổ sung thêm thông tin về ứng dụng Web cho công cụ ZAP. 
![Ảnh minh họa luồng](./auto.png)
Cách này kết hợp một công cụ tự động UI là [Browser Use](https://github.com/browser-use/browser-use) để thực hiện tự động kiểm thử bảo mật dựa trên kịch bản cung cấp. <br>
Kịch bản được định nghĩa trong [gemini_auto.py](./gemini_auto.py)

## Tài liệu về công cụ Browser Use
[Documentation](https://docs.browser-use.com/introduction)<br>
[Installation](https://docs.browser-use.com/quickstart)

# Redis Public/Subcribe

## 1. Giới thiệu về Redis Public/Subcribe

Pub/Sub trong Redis là một mô hình giao tiếp "Publish/Subscribe" giúp các client có thể gửi và nhận thông điệp mà không cần phải biết về nhau. Mô hình này rất hữu ích trong các ứng dụng yêu cầu truyền tải thông tin theo thời gian thực, như chat, thông báo sự kiện, hoặc các ứng dụng theo dõi.

## 2. Các bước sử dụng Pub/Sub trong Redis

- **Publisher:** Người gửi thông điệp.
- **Subscriber:** Người nhận thông điệp.
- **Channel:** Kênh mà Publisher gửi thông điệp và Subscriber nhận thông điệp

## 3. Cách hoạt động

- Publisher sẽ gửi (publish) thông điệp tới một channel.
- Subscriber sẽ đăng ký (subscribe) với một hoặc nhiều channel để nhận thông điệp từ các kênh đó.
- Khi một thông điệp được gửi tới channel mà Subscriber đã đăng ký, thông điệp sẽ được gửi tới tất cả các Subscriber đang lắng nghe kênh đó.

## 4. Các lệnh Redis liên quan đến Pub/Sub

- **PUBLISH channel message:** Gửi thông điệp đến một kênh

```python
    PUBLISH news "Hello, world!"
```

- **SUBSCRIBE channel:** Đăng ký để nhận thông điệp từ một hoặc nhiều kênh.

```python
    SUBSCRIBE news
```

- **UNSUBSCRIBE channel:** Hủy đăng ký khỏi một kênh

```python
    UNSUBSCRIBE news
```

- **PUNSUBSCRIBE pattern:** Hủy đăng ký khỏi các kênh theo mẫu.

```python
    PUNSUBSCRIBE *news
```

## 5. Notes

- **Redis Pub/Sub** không lưu trữ thông điệp. Nếu một Subscriber không kịp nhận thông điệp, thông điệp đó sẽ bị mất.
- **Redis Pub/Sub** hoạt động tốt với các ứng dụng yêu cầu giao tiếp theo thời gian thực, nhưng không phù hợp với các ứng dụng yêu cầu lưu trữ thông điệp lâu dài.

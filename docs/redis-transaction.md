# Transaction in redis

Trong Redis, một transaction (giao dịch) là một nhóm các lệnh được thực thi tuần tự mà không bị gián đoạn bởi các lệnh khác. Redis đảm bảo rằng tất cả các lệnh trong transaction sẽ được thực thi liên tiếp, và không có lệnh nào xen vào giữa các lệnh trong transaction. Giao dịch trong Redis không có khả năng rollback (hoàn tác) như trong các hệ quản trị cơ sở dữ liệu truyền thống, vì vậy nếu một lệnh trong giao dịch gặp lỗi, các lệnh khác vẫn sẽ được thực thi.

Redis hỗ trợ giao dịch thông qua các lệnh chính sau:
**_Các lệnh chính trong giao dịch Redis_**

1. MULTI

- Bắt đầu một transaction.
- Redis chuyển vào chế độ "queuing" (hàng đợi), các lệnh được xếp vào hàng đợi để thực thi sau.

2. EXEC

- Kết thúc transaction và thực thi tất cả các lệnh đã được xếp hàng kể từ lệnh MULTI.
- Các lệnh được thực thi liên tiếp trong cùng một phiên, không bị gián đoạn bởi các lệnh khác.

3. DISCARD

- Hủy bỏ transaction, tất cả các lệnh đã được xếp hàng sẽ bị loại bỏ và không được thực thi.

4. WATCH

- Dùng để theo dõi các khóa (keys) cụ thể. Nếu có bất kỳ khóa nào bị thay đổi bởi các lệnh khác trước khi EXEC được gọi, transaction sẽ bị hủy bỏ.
- Giúp hỗ trợ tính năng lạc quan kiểm tra (optimistic locking).

5. UNWATCH

- Hủy bỏ theo dõi các khóa đã được đặt bởi lệnh WATCH.

```bash
MULTI
SET key1 "value1"
SET key2 "value2"
INCR key3
EXEC
```

Trong ví dụ này:

- Các lệnh SET và INCR được xếp hàng sau lệnh MULTI.
- Khi lệnh EXEC được gọi, Redis thực thi tất cả các lệnh trong hàng đợi.
- Nếu bạn cần tính năng kiểm tra khóa trước khi thực thi lệnh, bạn có thể sử dụng lệnh WATCH để giám sát khóa:

```bash
WATCH mykey
MULTI
SET mykey "new_value"
EXEC
```

Nếu khóa mykey bị thay đổi bởi một lệnh khác giữa lệnh WATCH và EXEC, Redis sẽ hủy transaction (không thực hiện các lệnh trong transaction).

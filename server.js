const app = require("./src/app");

const PORT = process.env.DEV_APP_PORT || 3055;

const server = app.listen(PORT, () => {
    console.log(`WSV eCommerce start with ${PORT}`);
});

// Đặt khối xử lý unhandledRejection ở đây
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Xử lý lỗi hoặc ghi log lại
});

// ctrl + C
process.on('SIGINT', () => {
    server.close(() => console.log(`Exit Server Express`));

});
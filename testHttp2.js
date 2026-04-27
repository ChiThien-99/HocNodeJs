const http2 = require("http2");
const client = http2.connect("https://localhost:3000");
client.on("connect", () => {
  console.log("Có hỗ trợ http2");
  client.close();
});
client.on("error", (err) => {
  console.log(`Lỗi kết nối ${err}`);
});

const http = require("http");
const server = http.createServer((req, res) => {
  const baseUrl = "http://" + req.headers.host + "/";
  const url = new URL(req.url, baseUrl);
  const hostname = url.hostname;
  const pathname = url.pathname;
  const id = url.searchParams.get("id");
  res.writeHead(200, { "content-type": "text/html" });
  res.end(
    JSON.stringify({
      hostname,
      pathname,
      id,
    }),
  );
});
server.listen(8080, "localhost", () => {
  console.log("Server running at http://localhost:8080");
});

const fs = require("fs").promises;
async function readFile() {
  try {
    let data = await fs.readFile("baitho.txt", "utf-8");
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}
readFile();
console.log("part 1");
process.nextTick(() => {
  console.log("part 2");
});
Promise.resolve().then(() => {
  console.log("part 3");
});
setTimeout(() => {
  console.log("part 4");
}, 0);
setImmediate(() => {
  console.log("part 5");
});
console.log("part 6");

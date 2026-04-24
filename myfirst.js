// const http = require("http");
// const server = http.createServer((req, res) => {
//   const url = new URL(req.url, `http://${req.headers.host}`);
//   const hostname = url.hostname;
//   const pathname = url.pathname;
//   const id = url.searchParams.get("id");
//   res.writeHead(200, { "content-type": "text/html" });
//   res.end(
//     JSON.stringify({
//       hostname,
//       pathname,
//       id,
//     }),
//   );
// });
// server.listen(8080, "localhost", () => {
//   console.log("Server running at http://localhost:8080");
// });
const http=require("http");
const server=http.createServer((req,res)=>{
  // const {url,method}=req;
  // res.writeHead(200,{"content-type":"text/plain"});
  // res.end(`You made a ${method} to ${url}`);
  const url=new URL(req.url,`http://${req.headers.host}`);
  const hostname=url.hostname;
  const pathname=url.pathname;
  const id=url.searchParams.get("id");
  res.writeHead(200,{"content-type":"text/html"});
  res.end(JSON.stringify({
    hostname,
    pathname,
    id
  }))
})
server.listen(8080,()=>{
  console.log("Server running at http://localhost:8080");
})
const fs=require("fs/promises");
const { error } = require("console");
const { URL } = require("url");
// console.log("Before");
// const data=fs.readFileSync("baitho.txt","utf-8");
// console.log(`Nội dung file\n${data}`);
// console.log("After");
async function readfile(){
  try {
    console.log("**Start read file");
    const data1=await fs.readFile("baitho.txt","utf-8");
    const data2=await fs.readFile("baitho2.txt","utf-8");
    console.log("**End read file");
    console.log(`Nội dung bài thơ 1:\n${data1}`);
    console.log(`Nội dung bài thơ 2:\n${data2}`);

  } catch (error) {
    console.error(`Error reading file ${error}`)
  }
}
readfile();
const myPromise=new Promise((res,rej)=>{
  setTimeout(() => {
    let success=Math.random()>0.5;
    if (success) {
      res("Thành công")
    } else {
      rej("Thất bại")
    }
  }, 1000);
})
myPromise
.then(result=>console.log(`Result:${result}`))
.catch(error=>console.error(error));
const promise1=Promise.resolve("Result 1");
const promise2=new Promise(res=>{
  res("Result 2")
});
const promise3=fs.readFile("baitho.txt","utf-8");
Promise.all([promise1,promise2,promise3])
.then((result)=>{
  console.log(`Result: ${result}`);
})
.catch(err=>{
  console.error(err);
})
const promise4=new Promise(res=>setTimeout(() => {
  res("Result 4")
}, 1000));
const promise5=new Promise(res=>setTimeout(() => {
  res("Result 5")
}, 1000));
Promise.race([promise4,promise5])
.then((result)=>{
  console.log(`Result nhanh nhất là: ${result}`);
})
.catch((err)=>{
  console.log(err);
});
function fetchData(id){
  return new Promise(res=>{
    res(`Data of id:${id}`)
  })
}
async function fetchSequential(){
  console.time("sequential");
  const data1=await fetchData(1);
  const data2=await fetchData(2);
  const data3=await fetchData(3);
  console.timeEnd("sequential");
  return([data1,data2,data3]);
}
async function fetchParallel(){
  console.time("parallel");
  const data=await Promise.all(
  [ fetchData(1),
    fetchData(2),
    fetchData(3),
  ]
  )
  console.timeEnd("parallel");
  return(data);
}
async function run(){
  console.log("Running Sequential");
  const seqResult=await fetchSequential();
  console.log(seqResult);
  console.log("Running Parallel");
  const parResult=await fetchParallel();
  console.log(parResult);
}
run();
// console.log("Part 1");
// process.nextTick(()=>{console.log("Part 2")});
// Promise.resolve().then(()=>{console.log("Part 3")});
// setTimeout(() => {
//   console.log("Part 4");
// }, 0);
// setImmediate(()=>{console.log("Part 5")})
// console.log("Part 6");

// const v8=require("v8");
// const heapStatis=v8.getHeapStatistics();
// console.log(`Bộ nhớ tối đa: ${heapStatis.heap_size_limit/1024/1024} MB`);
// console.log(`Bộ nhớ trống: ${heapStatis.total_heap_size/1024/1024} MB`);
// console.log(`Bộ nhớ đã sử dụng ${heapStatis.used_heap_size/1024/1024} MB`);

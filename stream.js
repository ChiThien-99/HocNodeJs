const http=require("http");
const fs=require("fs");
const path=require("path");
const os=require("os");
const url=require("url");
const public_dir=path.join(__dirname,"public");
const mime_type={
    ".html":"text/html",
    ".css":"text/css",
    ".js":"text/js",
    ".json":"application/json",
    ".pdf":"application/pdf",
    ".jpg":"image/jpg",
    ".png":"image/png",
}
const server=http.createServer((req,res)=>{
    const safeUrl=decodeURIComponent(req.url);
    const filePath=path.join(public_dir,safeUrl);
    if(!filePath.startsWith(public_dir)){
        res.statusCode=403;
        res.end("Access Denied");
        return;
    };
    fs.stat(filePath,(err,stats)=>{
        if(err||!stats.isFile()){
            res.statusCode=404;
            res.end("File not found");
            return;
        }
        const ext=path.extname(filePath).toLowerCase();
        const contentType=mime_type[ext]||"application/octet-stream";
        res.setHeader("Content-Type",contentType);
        res.setHeader("Content-Length",stats.size);
        const stream=fs.createReadStream(filePath);
        stream.pipe(res);
        stream.on("error",(err)=>{
            console.log("Error reading file:",err);
            if(!res.headersSent){
                res.statusCode=500;
                res.end("Server error");
            }
        })
    });
    console.log(`OS Platform: ${os.platform()}`);
    console.log(`OS Type: ${os.type()}`);
    console.log(`OS Version: ${os.version()}`);
    console.log(`OS Architecture: ${os.arch()}`);
    console.log(`Hostname: ${os.hostname()}`);
    const freemem=(os.freemem/(1024*1024*1024)).toFixed(2);
    const totalmem=(os.totalmem/(1024*1024*1024)).toFixed(2);
    console.log(`Bộ nhớ trống ${freemem}/${totalmem}`);
    const user=os.userInfo();
    console.log(`Username:${user.username}`);
    console.log(`UserId:${user.uid}`);
    console.log(`GroupId:${user.gid}`);
    console.log(`Home Directory:${os.homedir}`);
    console.log(`HostName:${os.hostname}`);
    const q=url.parse("http://localhost:8080/products?month=april",true);
    console.log(q.host);
    console.log(q.pathname);
    const qdata=q.query;
    console.log(qdata.month);


})
const port=8080
server.listen(port,()=>{
    console.log(`Server is running securely at http://localhost:${port}`);
    console.log(`Serving file from: ${public_dir}`);
})
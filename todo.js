const express=require("express");
const cors=require("cors");
const https=require("https");
const fs=require("fs");
const path=require("path");
const helmet=require("helmet");
const app=express();
const todoRouter=require("./routers/todo.router");

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'","'unsafe-inline'", "https://kit.fontawesome.com"],
      "connect-src": ["'self'", "https://ka-f.fontawesome.com"],
    },
  },
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
// Cấu hình file public
app.use(express.static(path.join(__dirname,"publics"),{
    dotfiles:"ignore",
    etag:true,
    maxAge:"1d",
    redirect:true,
}));


app.set("view engine","ejs");
app.set("views","./views");

app.get('/', (req, res) => {
  res.send('<h1>Welcome to Secure Express Server</h1>');
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'operational',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version
  });
});
app.use("/",todoRouter);
// Xử lý lỗi middleware
app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).json({error:"Something went wrong!"})
});
//Xử lý lỗi 404
app.use((req,res)=>{
    res.status(404).json({error:"Not Found"})
})

const sslOption={
    key:fs.readFileSync(path.join(__dirname,"server.key")),
    cert:fs.readFileSync(path.join(__dirname,"server.cert")),
    allowHTTP1:true,
    minVersion:"TLSv1.2",
    ciphers:[
    'TLS_AES_256_GCM_SHA384',
    'TLS_CHACHA20_POLY1305_SHA256',
    'TLS_AES_128_GCM_SHA256',
    'ECDHE-RSA-AES128-GCM-SHA256',
    '!DSS',
    '!aNULL',
    '!eNULL',
    '!EXPORT',
    '!DES',
    '!RC4',
    '!3DES',
    '!MD5',
    '!PSK'
    ].join(":"),
    honorCipherOrder:true,
}
const port=process.env.PORT||3000;
const server=https.createServer(sslOption,app);
process.on("unhandledRejection",(reason,promise)=>{
    console.error(`Unhandle Rejection ${promise}, reason ${reason}`)
});
process.on("uncaughtException",(error)=>{
    console.error(`Uncaught Exception ${error}`);
    process.exit(1);
})
const gracefulShutdown=(signal)=>{
    console.log(`Received ${signal}.Shutting down gracefully...`);
    server.close(()=>{
        console.log("Server Closed");
        process.exit(0);
    });
    setTimeout(() => {
        console.error("Forcing shutdown");
        process.exit(1);
    }, 10000);
}
process.on("SIGTERM",gracefulShutdown);
process.on("SIGINT",gracefulShutdown);


const host=process.env.HOST||"localhost";
server.listen(port,host,()=>{
    console.log(`Server running at https://${host}:${port}`);
    console.log("Environment",process.env.NODE_ENV||"development");
    console.log("Press Ctrl+C to stop the server");
})

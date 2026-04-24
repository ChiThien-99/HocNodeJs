const express=require("express");
const cors=require("cors");
const app=express();
const port=3000;
const todoRouter=require("./routers/todo.router");

app.set("view engine","ejs");
app.set("views","./views");

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(express.static("publics"));
app.use("/",todoRouter);


app.listen(port,"localhost",()=>{
    console.log(`Server running at http://localhost:${port}`)
})

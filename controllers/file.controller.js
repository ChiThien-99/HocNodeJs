import fs from "fs/promises";
export const getFile=async (req,res)=>{
    try {
        const data=await fs.readFile("baitho.txt","utf-8");
        res.render("file.ejs",{data});
    } catch (error) {
        console.error(`Error reading file: ${error}`);
    }
    
}
// async function writeFile(){
//     try {
//         const data="Hello World";
//         await fs.writeFile("newFile1.txt",data,"utf-8");
//         console.log("Create file successfully");
//     } catch (error) {
//         console.log(`Error writing file ${error}`);
//     }
// }
// // writeFile();
export const createFile=async (req,res)=>{
    try {
        const data=req.body;
        await fs.writeFile("fileUpper.txt",data,"utf-8");
        res.json({mess:"Đã tạo thành công",status:200});
    } catch (error) {
        res.json({mess:"Tạo thất bại",error});
    }
    
}
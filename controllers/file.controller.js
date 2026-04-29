import fs from "fs/promises";
import os from "os";
export const getFile = async (req, res) => {
  // try {
  //     const data=await fs.readFile("baitho.txt","utf-8");
  //     res.render("file.ejs",{data});
  // } catch (error) {
  //     console.error(`Error reading file: ${error}`);
  // }
  res.render("file.ejs");
};
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
export const createFile = async (req, res) => {
  try {
    if (!req.body || !req.body.data) {
      return req.json({ mess: "Ko lấy đc body", status: 400 });
    }
    const content = req.body.data;
    await fs.writeFile("download.txt", content, "utf-8");
    res.json({ mess: "Đã tạo thành công", status: 200 });
  } catch (error) {
    res.json({ mess: "Tạo thất bại", err: error.message });
  }
};

export const downloadFile = (req, res) => {
  const pathFile = "download.txt";
  res.download(pathFile, "download.txt", (err) => {
    if (err) {
      console.error(`Lỗi tải file:${err}`);
    }
    fs.unlink(pathFile);
  });
};
console.log(`OS platform: ${os.platform()}`);
console.log(`OS type: ${os.type()}`);
console.log(`OS release: ${os.release()}`);
console.log(`CPU Architure: ${os.arch()}`);
console.log(`OS hostname: ${os.hostname()}`);
const totalMemGB=(os.totalmem()/(1024*1024*1024)).toFixed(2);
const freeMemGB=(os.freemem()/(1024*1024*1024)).toFixed(2);
console.log(`Memory: ${freeMemGB} free of ${totalMemGB}`);
const userInfo=os.userInfo();
console.log(`User info: ${userInfo.username}`);
console.log(`Home directory: ${os.homedir}`);



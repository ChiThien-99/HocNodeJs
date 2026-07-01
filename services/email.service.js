import nodemailer from "nodemailer";
import "dotenv/config";
import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
export const sendVerificationEmail = async (
  clientEmail,
  clientName,
  otpCode,
) => {
  try {
    const mailOptions = {
      from: `"Hệ thống Imzen" <${process.env.EMAIL_USER}>`,
      to: clientEmail,
      subject: "Mã xác nhận đăng ký tài khoản-Imzen",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #1877f2; text-align: center;">Chào mừng ${clientName} đến với Imzen!</h2>
        <p>Cảm ơn bạn đã đăng ký tài khoản. Dưới đây là mã xác nhận (OTP) của bạn để hoàn tất quy trình đăng ký:</p>
        <div style="background-color: #f0f2f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333; margin: 20px 0; border-radius: 4px;">
            ${otpCode}
        </div>
        <p style="color: red; font-size: 13px;">* Lưu ý: Mã OTP này có hiệu lực trong vòng 5 phút và chỉ sử dụng một lần duy nhất.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;" />
        <p style="font-size: 12px; color: #888; text-align: center;">Đây là email tự động, vui lòng không phản hồi thư này.</p>
        </div>
      `,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(
      `[Email Service] Thư xác thực đã gửi thành công tới:${clientEmail}.MessageId:${info.messageId}`,
    );
    return true;
  } catch (error) {
    console.error("[Email Servive] Lỗi thực thi gửi mail xác thực:", error);
    return false;
  }
};
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const generateInvoicePDFBuffer=(order,nameClient)=>{
  return new Promise((resolve,reject)=>{
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    let buffers=[];
    doc.on("data",(chunk)=>buffers.push(chunk));
    doc.on("end",()=>resolve(Buffer.concat(buffers)));
    doc.on("error",(err)=>reject(err));
    const fontRegular = path.resolve(__dirname, "../publics/OpenSans-Regular.ttf");
    const fontBold = path.resolve(__dirname, "../publics/OpenSans-Bold.ttf");
    const logoPath = path.resolve(__dirname, "../publics/img/logo_imzai_1.png");
    const headerTopY = doc.y;
    doc.image(logoPath, 50, headerTopY, { width: 60 });
    doc.font(fontRegular).fontSize(10);
    doc.text("CÔNG TY TNHH CÔNG NGHỆ IMZEN", 130, headerTopY);
    doc.text("MST: 0123456789", 130, headerTopY + 15);
    doc.text(
      "ĐỊA CHỈ: 236 LÊ THỊ NGAY, XÃ VĨNH LỘC, THÀNH PHỐ HỒ CHÍ MINH, VIỆT NAM",
      130,
      headerTopY + 30,
    );
    doc.text(
      "STK 0123456789 tại NGÂN HÀNG QUỐC TẾ (VIB)",
      130,
      headerTopY + 45,
    );
    doc.moveDown(2);
    doc.font(fontBold).fontSize(14).text("Đơn hàng",0,headerTopY+75,{align:"center"});
    doc.font(fontRegular).fontSize(10).text("Thời gian",{align:"center"});
    doc.text("Số phiếu",{align:"center"});
    doc.text(`Người mua: ${nameClient}`,50,headerTopY+140);
    doc.text(`Tên khách hàng: ${order.nameCompany}`,50,headerTopY+140+15);
    doc.text(`Địa chỉ: ${order.addressCompany}`,50,headerTopY+140+30);
    doc.text(`Điện thoại: ${order.telDelivery}`,50,headerTopY+140+45);
    doc.text(`MST: ${order.mstCompany}`,50,headerTopY+140+60);
    doc.text("Diễn giải: VAT",50,headerTopY+140+75);
    doc.text("Loại tiền: VNĐ",50,headerTopY+140+90);
    const tableTop=headerTopY+270;
    const colIndex=50;
    const colName=90;
    const colUnil=210;
    const colQuantity=250;
    const colPrice=300;
    const colTotal=430;
    doc.font(fontBold)
    doc.text("STT",colIndex,tableTop);
    doc.text("Tên hàng",colName,tableTop);
    doc.text("Đơn vị",colUnil,tableTop);
    doc.text("Số lượng",colQuantity,tableTop);
    doc.text("Đơn giá (bao gồm VAT)",colPrice,tableTop);
    doc.text("Thành tiền",colTotal,tableTop);
    doc.moveTo(50,tableTop+15).lineTo(550,tableTop+15).stroke();
    const itemY=tableTop+25;
    doc.font(fontRegular)
    order.products.forEach((prod,index) => {
    const itemTotal=prod.price*prod.quantity;
    doc.text(index+1,colIndex,itemY);
    doc.text(prod.productName,colName,itemY);
    doc.text("Cái",colUnil,itemY);
    doc.text(prod.quantity,colQuantity,itemY);
    doc.text(prod.price,colPrice,itemY);
    doc.text(itemTotal,colTotal,itemY);
    doc.moveTo(50,itemY+15).lineTo(550,itemY+15).strokeColor("#e0e0e0").stroke();
    itemY+=20;
    });
    doc.font(fontBold).text("Tổng tiền:",50,itemY+45);
    doc.font(fontRegular).text("10.000.000đ",430,itemY+45);
    doc.font(fontBold).text("Số tiền bằng chữ: Mười triệu đồng",50,itemY+65);
    doc.font(fontRegular).text("Hình thức thanh toán: TM/CK",50,itemY+85);
    doc.font(fontRegular).text(`Thời hạn thanh toán: ${new Date().toLocaleString("vi-VN")}`,50,itemY+105);
    doc.font(fontRegular).text("Người mua hàng",90,itemY+135);
    doc.font(fontRegular).text("Người bán hàng",430,itemY+135);
    doc.font(fontRegular).text("(Ký và ghi rõ họ tên)",90,itemY+150);
    doc.font(fontRegular).text("(Ký và ghi rõ họ tên)",430,itemY+150);
    doc.end();
  })
}
export const sendOrderEmail = async (
  emailClient,
  nameClient,
  newOrder,
) => {
  try {
    const pdfBuffer=generateInvoicePDFBuffer(newOrder,nameClient);
    const mailOptions = {
      from: `"Hệ thống Imzen" <${process.env.EMAIL_USER}>`,
      to: emailClient,
      subject: "IMZEN - Xác nhận đơn hàng",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 0.5rem; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="font-family: fontLogo;color: $colorCTA;letter-spacing: 0.4rem">IMZEN</h2>
        <p style="font-size: 1.1rem">Xin chào <b>${nameClient}</b></p>
        <p style="font-size: 1.1rem">Đơn hàng của bạn đã được đặt thành công. Cảm ơn bạn đã mua sắm tại <span style="color: $colorCTA;">IMZEN</span></p>
        <p style="font-size: 1.1rem">Vui lòng kiểm tra file đơn hàng được đính kèm trong mail</p>
        <p style="font-size: 1.1rem">Mọi thắc mắc cần hỗ trợ xin liên hệ 0966159722</p>
        </div>
      `,
      attachments:[
        {
          filename:`Don_Hang.pdf`,
          content:pdfBuffer,
          contentType:"application/pdf"
        }
      ]
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(
      `[Email Service] Thư đơn hàng đã gửi thành công tới:${emailClient}.MessageId:${info.messageId}`,
    );
    return true;
  } catch (error) {
    console.error("[Email Servive] Lỗi thực thi gửi mail đơn hàng:", error);
    return false;
  }
};

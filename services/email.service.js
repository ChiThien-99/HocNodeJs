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
      subject: "Mã xác nhận đăng ký tài khoản-VÂN HY",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #1877f2; text-align: center;">Chào mừng ${clientName} đến với VÂN HY!</h2>
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
const DocSoTienVietNam = (number) => {
  const digits = [
    "không",
    "một",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ];
  const units = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];

  if (number === 0) return "Không đồng";

  let strNumber = String(Math.floor(Math.abs(number)));
  // Đảm bảo độ dài chia hết cho 3 bằng cách bù số 0 vào đầu
  while (strNumber.length % 3 !== 0) {
    strNumber = "0" + strNumber;
  }

  let blocks = [];
  for (let i = 0; i < strNumber.length; i += 3) {
    blocks.push(strNumber.substr(i, 3));
  }

  let resultStrings = [];
  let totalBlocks = blocks.length;

  for (let i = 0; i < totalBlocks; i++) {
    let block = blocks[i];
    let h = Number(block[0]); // Hàng trăm
    let t = Number(block[1]); // Hàng chục
    let u = Number(block[2]); // Hàng đơn vị

    // Nếu block toàn số 0 và không phải block cuối cùng thì bỏ qua
    if (h === 0 && t === 0 && u === 0 && i !== totalBlocks - 1) {
      continue;
    }

    let blockText = "";
    // Đọc hàng trăm
    blockText += digits[h] + " trăm ";

    // Đọc hàng chục
    if (t === 0) {
      if (u !== 0) blockText += "lẻ ";
    } else if (t === 1) {
      blockText += "mười ";
    } else {
      blockText += digits[t] + " mươi ";
    }

    // Đọc hàng đơn vị
    if (t !== 0 && t !== 1 && u === 1) {
      blockText += "mốt";
    } else if (t !== 0 && u === 5) {
      blockText += "lăm";
    } else if (u !== 0) {
      blockText += digits[u];
    }

    // Cắt bỏ khoảng trắng thừa và thêm hàng đơn vị lớn (nghìn, triệu, tỷ...)
    blockText = blockText.trim();
    if (blockText !== "") {
      const unitIndex = totalBlocks - 1 - i;
      if (units[unitIndex] !== "") {
        blockText += " " + units[unitIndex];
      }
      resultStrings.push(blockText);
    }
  }

  // Ghép các chuỗi block lại thành chuỗi hoàn chỉnh
  let finalResult = resultStrings.join(" ").replace(/\s+/g, " ").trim();

  // Xử lý các trường hợp đọc "không trăm" dư thừa ở block đầu tiên nếu số nhỏ
  if (finalResult.startsWith("không trăm mươi")) {
    finalResult = finalResult.replace("không trăm mươi", "");
  } else if (finalResult.startsWith("không trăm lẻ")) {
    finalResult = finalResult.replace("không trăm lẻ", "");
  } else if (finalResult.startsWith("không trăm")) {
    finalResult = finalResult.replace("không trăm", "");
  }

  finalResult = finalResult.trim();
  // Viết hoa chữ cái đầu tiên và thêm chữ "đồng" chuẩn hóa đơn kế toán
  return finalResult.charAt(0).toUpperCase() + finalResult.slice(1) + " đồng";
};
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 * @param {Object} order
 * @param {String} nameClient
 */
const now = new Date();
const day = String(now.getDate()).padStart(2, "0");
const month = String(now.getMonth() + 1).padStart(2, "0");
const year = now.getFullYear();
const generateInvoicePDFBuffer = (order, nameClient) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    let buffers = [];
    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", (err) => reject(err));
    const fontRegular = path.resolve(
      __dirname,
      "../publics/OpenSans-Regular.ttf",
    );
    const fontBold = path.resolve(__dirname, "../publics/OpenSans-Bold.ttf");
    const logoPath = path.resolve(
      __dirname,
      "../publics/img/logo_imzen01-final.png",
    );
    const headerTopY = doc.y;
    doc.image(logoPath, 50, headerTopY, { width: 60 });
    doc.font(fontRegular).fontSize(10);
    doc.text("CÔNG TY TNHH CÔNG NGHỆ VÂN HY", 130, headerTopY);
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
    doc
      .font(fontBold)
      .fontSize(14)
      .text("Đơn hàng", 0, headerTopY + 75, { align: "center" });
    doc
      .font(fontRegular)
      .fontSize(10)
      .text(`Thời gian: ${day}/${month}/${year}`, { align: "center" });
    doc.text(`Số phiếu: ${order.orderNumber}`, { align: "center" });
    doc.text(`Người mua: ${nameClient}`, 50, headerTopY + 140);
    if (
      order.nameCompany === "--" &&
      order.addressCompany === "--" &&
      order.mstCompany === "--"
    ) {
      doc.text(
        `Tên người nhận: ${order.fullnameDelivery}`,
        50,
        headerTopY + 140 + 15,
      );
      if (order.paymentMethod != "Thanh toán khi nhận hàng") {
        const stampX = 380;
        const stampY = headerTopY + 140 + 5;
        doc.fillColor("#bbbbbb").strokeColor("#bbbbbb");
        doc.font(fontBold).fontSize(15);
        doc.text("ĐÃ THANH TOÁN", stampX + 15, stampY + 10, {
          width: 150,
          align: "center",
        });
        doc.lineWidth(3).rect(stampX, stampY, 180, 35).stroke();
        doc.fillColor("#000000").strokeColor("#000000");
        doc.font(fontRegular).fontSize(10);
        doc.lineWidth(1);
      }
      doc.text(
        `Số điện thoại: ${order.telDelivery}`,
        50,
        headerTopY + 140 + 30,
      );
      doc.text(
        `Địa chỉ nhận hàng: ${order.addressDelivery}`,
        50,
        headerTopY + 140 + 45,
      );
    } else {
      doc.text(`Tên công ty: ${order.nameCompany}`, 50, headerTopY + 140 + 15);
      if (order.paymentMethod != "Thanh toán khi nhận hàng") {
        const stampX = 380;
        const stampY = headerTopY + 140 + 5;
        doc.fillColor("#bbbbbb").strokeColor("#bbbbbb");
        doc.font(fontBold).fontSize(15);
        doc.text("ĐÃ THANH TOÁN", stampX + 15, stampY + 10, {
          width: 150,
          align: "center",
        });
        doc.lineWidth(3).rect(stampX, stampY, 180, 35).stroke();
        doc.fillColor("#000000").strokeColor("#000000");
        doc.font(fontRegular).fontSize(10);
        doc.lineWidth(1);
      }
      doc.text(
        `Địa chỉ công ty: ${order.addressCompany}`,
        50,
        headerTopY + 140 + 30,
      );
      doc.text(`MST: ${order.mstCompany}`, 50, headerTopY + 140 + 45);
    }
    doc.text("Diễn giải: VAT", 50, headerTopY + 140 + 60);
    doc.text("Loại tiền: VNĐ", 50, headerTopY + 140 + 75);
    const tableTop = headerTopY + 250;
    const colIndex = 50;
    const colName = 90;
    const colUnil = 210;
    const colQuantity = 250;
    const colPrice = 300;
    const colTotal = 430;
    doc.font(fontBold);
    doc.text("STT", colIndex, tableTop);
    doc.text("Tên hàng", colName, tableTop);
    doc.text("Đơn vị", colUnil, tableTop);
    doc.text("Số lượng", colQuantity, tableTop);
    doc.text("Đơn giá (bao gồm VAT)", colPrice, tableTop);
    doc.text("Thành tiền", colTotal, tableTop);
    doc
      .moveTo(50, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke();
    let itemY = tableTop + 25;
    doc.font(fontRegular);
    let totalOrderPrice = 0;
    order.products.forEach((prod, index) => {
      const itemTotal = prod.price * prod.quantity;
      totalOrderPrice += itemTotal;
      doc.text(index + 1, colIndex, itemY);
      doc.text(prod.productName, colName, itemY);
      doc.text("Cái", colUnil, itemY);
      doc.text(prod.quantity, colQuantity, itemY);
      doc.text(prod.price.toLocaleString("vi-VN"), colPrice, itemY);
      doc.text(itemTotal.toLocaleString("vi-VN"), colTotal, itemY);
      doc
        .moveTo(50, itemY + 15)
        .lineTo(550, itemY + 15)
        .strokeColor("#e0e0e0")
        .stroke();
      itemY += 20;
    });
    const totalAfterDiscount = totalOrderPrice - order.voucherDiscount;
    doc.font(fontBold).text("Chiết khấu:", 50, itemY + 15);
    doc
      .font(fontRegular)
      .text(
        `${order.voucherDiscount.toLocaleString("vi-VN")}đ`,
        430,
        itemY + 15,
      );
    doc.font(fontBold).text("Tổng tiền:", 50, itemY + 35);
    doc
      .font(fontRegular)
      .text(`${totalAfterDiscount.toLocaleString("vi-VN")}đ`, 430, itemY + 35);
    doc
      .font(fontBold)
      .text(
        `Số tiền bằng chữ: ${DocSoTienVietNam(totalAfterDiscount)}`,
        50,
        itemY + 55,
      );
    doc
      .font(fontRegular)
      .text(`Hình thức thanh toán: ${order.paymentMethod}`, 50, itemY + 75);
    doc.font(fontRegular).text("Người mua hàng", 90, itemY + 95);
    doc.font(fontRegular).text("Người bán hàng", 430, itemY + 95);
    doc.font(fontRegular).text("(Ký và ghi rõ họ tên)", 90, itemY + 110);
    doc.font(fontRegular).text("(Ký và ghi rõ họ tên)", 430, itemY + 110);
    doc.end();
  });
};
export const sendOrderEmail = async (emailClient, nameClient, newOrder) => {
  try {
    const pdfBuffer = await generateInvoicePDFBuffer(newOrder, nameClient);
    const mailOptions = {
      from: `"Hệ thống VANHY" <${process.env.EMAIL_USER}>`,
      to: emailClient,
      subject: "VÂN HY - Xác nhận đơn hàng",
      html: `
        <div style="font-family: Arial, sans-serif; width:fit-content;margin: 0 auto; padding: 1rem; border: 1px solid #e0e0e0; border-radius: 5px;">
        <img src="https://res.cloudinary.com/doigxmzte/image/upload/v1784701803/logo_imzen01-final_r9ghv3.png" alt="logoImzenEmail" style="width:3rem; height:3rem;">
        <p style="font-size: 1.1rem; margin:0.5rem 0">Xin chào <b>${nameClient}</b></p>
        <p style="font-size: 1.1rem; margin:0.5rem 0">Đơn hàng của bạn đã được đặt thành công. Cảm ơn bạn đã mua sắm tại <span style="color: #80a710;letter-spacing:0.1rem">VÂN HY</span></p>
        <p style="font-size: 1.1rem; margin:0.5rem 0">Vui lòng kiểm tra file đơn hàng được đính kèm trong mail</p>
        <p style="font-size: 1.1rem; margin:0.5rem 0">Mọi thắc mắc cần hỗ trợ xin liên hệ 0966159722</p>
        </div>
      `,
      attachments: [
        {
          filename: `Don_Hang.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
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
export const sendEnableMfaEmail = async (
  emailClient,
  nameClient,
  backupCodes,
) => {
  try {
    const mailOptions = {
      from: `"Hệ thống VANHY" <${process.env.EMAIL_USER}>`,
      to: emailClient,
      subject: "Tài khoản của bạn đã được kích hoạt xác thực 2 lớp",
      html: `
        <div style="font-family: Arial, sans-serif; width:fit-content;margin: 0 auto; padding: 1rem; border: 1px solid #e0e0e0; border-radius: 5px;">
        <img src="https://res.cloudinary.com/doigxmzte/image/upload/v1784701803/logo_imzen01-final_r9ghv3.png" alt="logoImzenEmail" style="width:3rem; height:3rem;">
        <p style="font-size: 1.1rem; margin:0.5rem 0">Xin chào <b>${nameClient}</b></p>
        <p style="font-size: 1.1rem; margin:0.5rem 0">Tài khoản của bạn đã được bảo vệ bằng xác thực 2 lớp</p>
        <p style="font-size: 1.1rem; margin:0.5rem 0">Dưới đây là 5 mã dự phòng dùng để đăng nhập trong trường hợp bạn mất điện thoại hoặc lỡ xóa phần mềm Google Authenticator/Microsoft Authenticator</p>
        <b style="font-size: 1.1rem; margin:0.5rem 0; letter-spacing:0.1rem">${backupCodes[0]}</b><br>
        <b style="font-size: 1.1rem; margin:0.5rem 0; letter-spacing:0.1rem">${backupCodes[1]}</b><br>
        <b style="font-size: 1.1rem; margin:0.5rem 0; letter-spacing:0.1rem">${backupCodes[2]}</b><br>
        <b style="font-size: 1.1rem; margin:0.5rem 0; letter-spacing:0.1rem">${backupCodes[3]}</b><br>
        <b style="font-size: 1.1rem; margin:0.5rem 0; letter-spacing:0.1rem">${backupCodes[4]}</b><br>
        <p style="font-size: 1.1rem; margin:0.5rem 0">Lưu ý: Mỗi mã chỉ sử dụng 1 lần</p>
        </div>
      `,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(
      `[Email Service] Thư xác nhận kích hoạt bảo mật 2 lớp đã gửi thành công tới:${emailClient}.MessageId:${info.messageId}`,
    );
    return true;
  } catch (error) {
    console.error(
      "[Email Servive] Lỗi thực thi gửi mail xác nhận kích hoạt bảo mật 2 lớp:",
      error,
    );
    return false;
  }
};
export const sendDisableMfaEmail = async (emailClient, nameClient) => {
  try {
    const mailOptions = {
      from: `"Hệ thống VANHY" <${process.env.EMAIL_USER}>`,
      to: emailClient,
      subject: "Tài khoản của bạn đã tắt kích hoạt xác thực 2 lớp",
      html: `
        <div style="font-family: Arial, sans-serif; width:fit-content;margin: 0 auto; padding: 1rem; border: 1px solid #e0e0e0; border-radius: 5px;">
        <img src="https://res.cloudinary.com/doigxmzte/image/upload/v1784701803/logo_imzen01-final_r9ghv3.png" alt="logoImzenEmail" style="width:3rem; height:3rem;">
        <p style="font-size: 1.1rem; margin:0.5rem 0">Xin chào <b>${nameClient}</b></p>
        <p style="font-size: 1.1rem; margin:0.5rem 0">Tài khoản của bạn đã tắt xác thực 2 lớp</p>
        <p style="font-size: 1.1rem; margin:0.5rem 0">Nếu không phải bạn tắt vui lòng phản hồi lại email này để chúng tôi can thiệp kịp thời bạn nhé!</p>
        </div>
      `,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(
      `[Email Service] Thư xác nhận tắt bảo mật 2 lớp đã gửi thành công tới:${emailClient}.MessageId:${info.messageId}`,
    );
    return true;
  } catch (error) {
    console.error(
      "[Email Servive] Lỗi thực thi gửi mail tắt kích hoạt bảo mật 2 lớp:",
      error,
    );
    return false;
  }
};
export const sendReqDisableMfaEmail = async (
  emailClient,
  nameClient,
  disableToken,
) => {
  try {
    const mailOptions = {
      from: `"Hệ thống VANHY" <${process.env.EMAIL_USER}>`,
      to: emailClient,
      subject: "Yêu cầu tắt kích hoạt xác thực 2 lớp tài khoản",
      html: `
        <div style="font-family: Arial, sans-serif; width:fit-content;margin: 0 auto; padding: 1rem; border: 1px solid #e0e0e0; border-radius: 5px;">
        <img src="https://res.cloudinary.com/doigxmzte/image/upload/v1784701803/logo_imzen01-final_r9ghv3.png" alt="logoImzenEmail" style="width:3rem; height:3rem;">
        <p style="font-size: 1.1rem; margin:0.5rem 0">Xin chào <b>${nameClient}</b></p>
        <p style="font-size: 1.1rem; margin:0.5rem 0">Chúng tôi nhận được yêu cầu tắt kích hoạt 2 lớp tài khoản của bạn, nếu chính xác là bạn hãy nhấn nút tắt bên dưới nhé</p>
        <a href="https://confider-bronzing-manlike.ngrok-free.dev/loginClient/verifyDisableLink?token=${disableToken}" target="_blank" style="display:inline-block;padding:0.5rem;border:none;border-radius:5px;background-color:#80a710;color:#fafafa;text-decoration:none;">Tắt xác thực 2 lớp</a>
        <p style="font-size: 1.1rem; margin:0.5rem 0;color:red">Lưu ý: Có hiệu lực trong 15 phút</p>
        <p style="font-size: 1.1rem; margin:0.5rem 0">Nếu không phải bạn yêu cầu vui lòng thay đổi mật khẩu tài khoản mạnh hơn và không nhấn nút trên bạn nhé!</p>
        </div>
      `,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(
      `[Email Service] Thư yêu cầu tắt bảo mật 2 lớp đã gửi thành công tới:${emailClient}.MessageId:${info.messageId}`,
    );
    return true;
  } catch (error) {
    console.error(
      "[Email Servive] Lỗi thực thi gửi mail yêu cầu tắt kích hoạt bảo mật 2 lớp:",
      error,
    );
    return false;
  }
};
export const sendEmailNewEmployee = async (
  emailClient,
  nameClient,
  pwClient,
  QRCode,
  backupCodes,
) => {
  try {
    const mailOptions = {
      from: `"Hệ thống VANHY" <${process.env.EMAIL_USER}>`,
      to: emailClient,
      subject: `Chào mừng ${nameClient} đến với Vân Hy`,
      html: `
        <div style="font-family: Arial, sans-serif; width:fit-content;margin: 0 auto; padding: 1rem; border: 1px solid #e0e0e0; border-radius: 5px;">
        <img src="https://res.cloudinary.com/doigxmzte/image/upload/v1784701803/logo_imzen01-final_r9ghv3.png" alt="logoImzenEmail" style="width:3rem; height:3rem;">
        <p style="font-size: 1.1rem; margin:0.5rem 0">Xin chào <b>${nameClient}</b></p>
        <p style="font-size: 1.1rem; margin:0.5rem 0">Chúc mừng bạn trở thành thành viên của Vân Hy dưới đây là thông tin tài khoản đăng nhập hệ thống của bạn</p>
        <p style="font-size: 1.1rem; margin:0.5rem 0">Email: <b>${emailClient}</b></p>
        <p style="font-size: 1.1rem; margin:0.5rem 0">Mật khẩu: <b>${pwClient}</b></p>
        <p style="font-size: 1.1rem; margin:0.5rem 0">Mỗi lần đăng nhập hệ thống sẽ yêu cầu mã OTP để xác thực. Bạn hãy thực hiện theo các bước sau nhé:</p>
        <p style="font-size: 1.1rem; margin:0.5rem 0">B1.Tải phần mềm Google Authenticator hoặc Microsoft Authenticator trên CH Play hoặc App Store</p>
        <p style="font-size: 1.1rem; margin:0.5rem 0">B2.Vui lòng quét mã QR dưới bằng Google Authenticator hoặc Microsoft Authenticator để kích hoạt</p>
        <img src="cid:mfa_qrcode_img" style="width:10rem;height:10rem" alt="qrcode">
        <p style="font-size: 1.1rem; margin:0.5rem 0">**Mã dự phòng dùng để đăng nhập trong trường hợp bạn mất điện thoại hoặc lỡ xóa Google Authenticator/Microsoft Authenticator</p>
        <b style="font-size: 1.1rem; margin:0.5rem 0; letter-spacing:0.1rem">${backupCodes[0]}</b><br>
        <b style="font-size: 1.1rem; margin:0.5rem 0; letter-spacing:0.1rem">${backupCodes[1]}</b><br>
        <b style="font-size: 1.1rem; margin:0.5rem 0; letter-spacing:0.1rem">${backupCodes[2]}</b><br>
        <b style="font-size: 1.1rem; margin:0.5rem 0; letter-spacing:0.1rem">${backupCodes[3]}</b><br>
        <b style="font-size: 1.1rem; margin:0.5rem 0; letter-spacing:0.1rem">${backupCodes[4]}</b><br>
        <p style="font-size: 1.1rem; margin:0.5rem 0">Lưu ý: Mỗi mã chỉ sử dụng 1 lần</p>
        <p style="font-size: 1.1rem; margin:0.5rem 0">Truy cập <a href="https://confider-bronzing-manlike.ngrok-free.dev/loginAdmin">https://confider-bronzing-manlike.ngrok-free.dev/loginAdmin</a> bắt đầu công việc bạn nhé</p>
        <p style="font-size: 1.1rem; margin:0.5rem 0">Thanks & Best regards</p>
        </div>
      `,
      attachments:[
        {
          filename:"qrcode.png",
          path:QRCode,
          cid:"mfa_qrcode_img",
        }
      ]
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(
      `[Email Service] Thư chúc mừng nhân viên mới đã gửi thành công tới:${emailClient}.MessageId:${info.messageId}`,
    );
    return true;
  } catch (error) {
    console.error(
      "[Email Servive] Lỗi thực thi gửi mail chúc mừng nhân viên mới:",
      error,
    );
    return false;
  }
};
export const sendEmailRestoreMFA = async (
  emailClient,
  nameClient,
  QRCode,
  backupCodes,
) => {
  try {
    const mailOptions = {
      from: `"Hệ thống VANHY" <${process.env.EMAIL_USER}>`,
      to: emailClient,
      subject: `Khôi phục chức năng xác thực OTP của tài khoản ${nameClient}`,
      html: `
        <div style="font-family: Arial, sans-serif; width:fit-content;margin: 0 auto; padding: 1rem; border: 1px solid #e0e0e0; border-radius: 5px;">
        <img src="https://res.cloudinary.com/doigxmzte/image/upload/v1784701803/logo_imzen01-final_r9ghv3.png" alt="logoImzenEmail" style="width:3rem; height:3rem;">
        <p style="font-size: 1.1rem; margin:0.5rem 0">Xin chào <b>${nameClient}</b></p>
        <p style="font-size: 1.1rem; margin:0.5rem 0">Chúng tôi nhận được thông báo khôi phục lại chức năng xác thực OTP tài khoản của bạn, vui lòng thực hiện theo các bước sau bạn nhé</p>
        <p style="font-size: 1.1rem; margin:0.5rem 0">B1.Tải phần mềm Google Authenticator hoặc Microsoft Authenticator trên CH Play hoặc App Store</p>
        <p style="font-size: 1.1rem; margin:0.5rem 0">B2.Vui lòng quét mã QR dưới bằng Google Authenticator hoặc Microsoft Authenticator để kích hoạt</p>
        <img src="cid:mfa_qrcode_img" style="width:10rem;height:10rem" alt="qrcode">
        <p style="font-size: 1.1rem; margin:0.5rem 0">**Mã dự phòng dùng để đăng nhập trong trường hợp bạn mất điện thoại hoặc lỡ xóa Google Authenticator/Microsoft Authenticator</p>
        <b style="font-size: 1.1rem; margin:0.5rem 0; letter-spacing:0.1rem">${backupCodes[0]}</b><br>
        <b style="font-size: 1.1rem; margin:0.5rem 0; letter-spacing:0.1rem">${backupCodes[1]}</b><br>
        <b style="font-size: 1.1rem; margin:0.5rem 0; letter-spacing:0.1rem">${backupCodes[2]}</b><br>
        <b style="font-size: 1.1rem; margin:0.5rem 0; letter-spacing:0.1rem">${backupCodes[3]}</b><br>
        <b style="font-size: 1.1rem; margin:0.5rem 0; letter-spacing:0.1rem">${backupCodes[4]}</b><br>
        <p style="font-size: 1.1rem; margin:0.5rem 0">Lưu ý: Mỗi mã chỉ sử dụng 1 lần</p>
        <p style="font-size: 1.1rem; margin:0.5rem 0">Truy cập <a href="https://confider-bronzing-manlike.ngrok-free.dev/loginAdmin">https://confider-bronzing-manlike.ngrok-free.dev/loginAdmin</a> bắt đầu công việc bạn nhé</p>
        <p style="font-size: 1.1rem; margin:0.5rem 0">Thanks & Best regards</p>
        </div>
      `,
      attachments:[
        {
          filename:"qrcode.png",
          path:QRCode,
          cid:"mfa_qrcode_img",
        }
      ]
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(
      `[Email Service] Thư khôi phục chức năng OTP đã gửi thành công tới:${emailClient}.MessageId:${info.messageId}`,
    );
    return true;
  } catch (error) {
    console.error(
      "[Email Servive] Lỗi thực thi gửi mail khôi phục chức năng OTP:",
      error,
    );
    return false;
  }
};

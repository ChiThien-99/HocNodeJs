import nodemailer from "nodemailer";
import "dotenv/config";
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
      `[Email Service] Thư đã gửi thành công tới:${clientEmail}.MessageId:${info.messageId}`,
    );
    return true;
  } catch (error) {
    console.error("[Email Servive] Lỗi thực thi gửi mail:", error);
    return false;
  }
};
export const sendOrderEmail = async (
  clientEmail,
  clientName,
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
      `[Email Service] Thư đã gửi thành công tới:${clientEmail}.MessageId:${info.messageId}`,
    );
    return true;
  } catch (error) {
    console.error("[Email Servive] Lỗi thực thi gửi mail:", error);
    return false;
  }
};

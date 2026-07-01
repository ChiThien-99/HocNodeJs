import { cartEntity } from "../models/cart.model.js";
import { voucherEntity } from "../models/voucher.model.js";
import { provinceWardsEntity } from "../models/provinceWards.model.js";
import { clientEntity } from "../models/client.model.js";
import { orderEntity } from "../models/order.model.js";
import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";
import { sendOrderEmail } from "../services/email.service.js";
export const getCart = async (req, res) => {
  const { idClient } = req.params;
  const cart = await cartEntity.findOne({ clientId: idClient });
  const vouchers = await voucherEntity
    .find({
      isActive: true,
      clientIds: { $in: [idClient] },
      usersUsed: { $nin: [idClient] },
    })
    .select("code image title content discountPercentage createdAt");
  let subTotal = 0;
  if (cart) {
    cart.products.forEach((p) => {
      subTotal += p.price * p.quantity;
    });
  }
  const provinceWards = await provinceWardsEntity.find();
  const province = provinceWards.map((pw) => pw.province);
  const client = await clientEntity.findById(idClient);
  const deliveryAddress = client.addressInfor;
  const listInvoiceInfor = client.invoiceInfor;
  res.render("cart.ejs", {
    cart,
    vouchers,
    subTotal,
    province,
    deliveryAddress,
    listInvoiceInfor,
  });
};
export const deleteProduct = async (req, res) => {
  try {
    const { idClient, idProduct } = req.body;
    if (!idProduct || !idClient) {
      return res.json({
        mess: "Không tìm được idProduct,idClient",
        success: false,
      });
    }
    console.log(idClient);
    console.log(idProduct);
    const updateCart = await cartEntity.findOneAndUpdate(
      { clientId: idClient },
      {
        $pull: {
          products: { productId: idProduct },
        },
      },
      { new: true },
    );
    let totalItems = 0;
    if (updateCart && updateCart.products) {
      totalItems = updateCart.products.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
    }
    const io = req.app.get("socketio");
    io.emit("update-totalItems", totalItems);
    res.json({ mess: "Xóa sản phẩm thành công", success: true, totalItems });
  } catch (error) {
    res.json({
      mess: "Xóa sản phẩm thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const updateQuantity = async (req, res) => {
  try {
    const { idClient, idProduct, productQuantity } = req.body;
    const cart = await cartEntity.findOne({ clientId: idClient });
    const productIndex = cart.products.findIndex(
      (p) => p.productId === idProduct,
    );
    if (productIndex > -1) {
      cart.products[productIndex].quantity = Number(productQuantity);
    }
    cart.updateAt = new Date();
    await cart.save();
    const totalItems = cart.products.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    const io = req.app.get("socketio");
    io.emit("update-totalItems", totalItems);
    res.json({ success: true, totalItems });
  } catch (error) {
    res.json({
      mess: "Cập nhật số lượng thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const calMultiVouchers = async (req, res) => {
  try {
    const { selectedVoucherCode, idClient } = req.body;
    const cart = await cartEntity.findOne({ clientId: idClient });
    let subTotal = 0;
    cart.products.map((p) => {
      subTotal += p.price * p.quantity;
    });
    console.log(cart.products);
    let poolDiscountApp = 0;
    let poolDiscountDevice = 0;
    let totalDiscountAmount = 0;
    if (
      selectedVoucherCode &&
      Array.isArray(selectedVoucherCode) &&
      selectedVoucherCode.length > 0
    ) {
      const upperCode = selectedVoucherCode.map((code) => code.toUpperCase());
      const activeVoucher = await voucherEntity.find({
        code: { $in: upperCode },
        isActive: true,
        clientIds: { $in: [idClient] },
        usersUsed: { $nin: [idClient] },
      });
      activeVoucher.forEach((v) => {
        if (v.applyToCategory === "app") {
          poolDiscountApp += v.discountPercentage;
        } else if (v.applyToCategory === "device") {
          poolDiscountDevice += v.discountPercentage;
        } else {
          poolDiscountApp += v.discountPercentage;
          poolDiscountDevice += v.discountPercentage;
        }
      });
      cart.products.forEach((p) => {
        const itemTotalOriginal = p.price * p.quantity;
        if (p.category === "app") {
          if (poolDiscountApp > 0) {
            const percentToApply = Math.min(poolDiscountApp, 80);
            const discountForThisItem =
              (itemTotalOriginal * percentToApply) / 100;
            totalDiscountAmount += discountForThisItem;
            poolDiscountApp -= percentToApply;
          }
        } else if (p.category === "device") {
          if (poolDiscountDevice > 0) {
            const percentToApply = Math.min(poolDiscountDevice, 80);
            const discountForThisItem =
              (itemTotalOriginal * percentToApply) / 100;
            totalDiscountAmount += discountForThisItem;
            poolDiscountDevice -= percentToApply;
          }
        }
      });
    }
    let finalTotal = subTotal - totalDiscountAmount;
    if (finalTotal < 0) {
      finalTotal = 0;
    }
    res.json({ subTotal, totalDiscountAmount, finalTotal, success: true });
  } catch (error) {
    res.json({
      mess: "Áp dụng voucher thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const filterProvinceWards = async (req, res) => {
  try {
    const { province } = req.body;
    const currentProvince = await provinceWardsEntity.findOne({
      province: province,
    });
    const wards = currentProvince.wards;
    res.json({ success: true, wards: wards });
  } catch (error) {
    res.json({
      mess: "Lỗi lọc ProvinceWards",
      success: false,
      error: error.message,
    });
  }
};
export const addReceivingInfor = async (req, res) => {
  try {
    const {
      idClient,
      fullname,
      tel,
      provinceCity,
      wardsCommunes,
      numberHouse,
      categoryAddress,
    } = req.body;
    const client = await clientEntity.findById(idClient);
    client.addressInfor.push({
      fullname: fullname,
      tel: tel,
      address: `${numberHouse}, ${wardsCommunes}, ${provinceCity}`,
      category: categoryAddress,
    });
    await client.save();
    const listAddress = client.addressInfor;
    const io = req.app.get("socketio");
    io.emit("update-deliveryAddress", listAddress);
    res.json({
      mess: "Tạo thông tin giao hàng thành công",
      success: true,
    });
  } catch (error) {
    res.json({
      mess: "Tạo thông tin giao hàng thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const deleteAddress = async (req, res) => {
  try {
    const { idClient, idAddress } = req.body;
    if (!idAddress || !idClient) {
      return res.json({
        mess: "Không tìm được idAddress,idClient",
        success: false,
      });
    }
    const deleteAddress = await clientEntity.findOneAndUpdate(
      { _id: idClient },
      {
        $pull: {
          addressInfor: { _id: idAddress },
        },
      },
      { new: true },
    );
    const io = req.app.get("socketio");
    io.emit("delete-deliveryAddress", idAddress);
    res.json({ mess: "Xóa thông tin nhận hàng thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Xóa thông tin nhận hàng thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const addInfoInvoice = async (req, res) => {
  try {
    const {
      idClient,
      nameCompany,
      mstCompany,
      provinceCityInvoice,
      wardsCommunesInvoice,
      numberCompany,
      mailInvoice,
    } = req.body;
    const client = await clientEntity.findById(idClient);
    client.invoiceInfor.push({
      nameCompany: nameCompany,
      mstCompany: mstCompany,
      addressCompany: `${numberCompany}, ${wardsCommunesInvoice}, ${provinceCityInvoice}`,
      mailInvoice: mailInvoice,
    });
    await client.save();
    const listInvoiceInfor = client.invoiceInfor;
    const io = req.app.get("socketio");
    io.emit("update-invoiceInfo", listInvoiceInfor);
    res.json({ mess: "Tạo thông tin hóa đơn thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Tạo thông tin hóa đơn thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const deleteInvoiceInfor = async (req, res) => {
  try {
    const { idClient, idInforInvoice } = req.body;
    if (!idInforInvoice || !idClient) {
      return res.json({
        mess: "Không tìm được idInforInvoice,idClient",
        success: false,
      });
    }
    const deleteInforInvoice = await clientEntity.findOneAndUpdate(
      { _id: idClient },
      {
        $pull: {
          invoiceInfor: { _id: idInforInvoice },
        },
      },
      { new: true },
    );
    const io = req.app.get("socketio");
    io.emit("delete-inforInvoice", idInforInvoice);
    res.json({ mess: "Xóa thông tin xuất hóa đơn thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Xóa thông tin xuất hóa đơn thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const addOrder = async (req, res) => {
  try {
    const {
      idClient,
      discountAmount,
      paymentOrder,
      nameDelivery,
      telDelivery,
      addressDelivery,
      nameCompanyOrder,
      mstCompanyOrder,
      addressCompanyOrder,
      mailInvoiceOrder,
    } = req.body;
    const cartOfClient = await cartEntity.findOne({ clientId: idClient });
    const productsCart = cartOfClient.products;
    const newOrder=await orderEntity.create({
      idClient: idClient,
      products: productsCart,
      voucherDiscount: discountAmount,
      paymentMethod: paymentOrder,
      fullnameDelivery: nameDelivery,
      telDelivery: telDelivery,
      addressDelivery: addressDelivery,
      nameCompany: nameCompanyOrder,
      mstCompany: mstCompanyOrder,
      addressCompany: addressCompanyOrder,
      mailInvoice: mailInvoiceOrder,
    });
    await cartEntity.findByIdAndDelete(cartOfClient._id);
    const client=clientEntity.findById(idClient);
    const emailClient=client.email;
    const nameClient=client.fullname;
    sendOrderEmail(emailClient,nameClient,newOrder);
    res.json({ mess: "Đặt hàng thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Đặt hàng thất bại",
      success: false,
      error: error.message,
    });
  }
};
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const previewOrder = async (req, res) => {
  try {
    const fontRegular = path.resolve(__dirname, "../publics/OpenSans-Regular.ttf");
    const fontBold = path.resolve(__dirname, "../publics/OpenSans-Bold.ttf");
    const logoPath = path.resolve(__dirname, "../publics/img/logo_imzai_1.png");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=previewOrder.pdf");
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.pipe(res);
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
    doc.text("Người mua: Nguyễn Văn A",50,headerTopY+140);
    doc.text("Tên khách hàng: CÔNG TY TNHH TIN HỌC NGÔI SAO LỚN",50,headerTopY+140+15);
    doc.text("Địa chỉ: 28-30 Trần Triệu Luật, Phường Tân Hòa, Thành Phố Hồ Chí Minh",50,headerTopY+140+30);
    doc.text("Điện thoại: 09123456789",50,headerTopY+140+45);
    doc.text("MST: 0123456789",50,headerTopY+140+60);
    doc.text("Diễn giải: VAT",50,headerTopY+140+75);
    doc.text("Nhân viên bán hàng: Lâm Chí Thiện",50,headerTopY+140+90);
    doc.text("Loại tiền: VNĐ",50,headerTopY+140+105);
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
    doc.text("01",colIndex,itemY);
    doc.text("Imzen Aruba 01",colName,itemY);
    doc.text("Cái",colUnil,itemY);
    doc.text("10",colQuantity,itemY);
    doc.text("450.000",colPrice,itemY);
    doc.text("4.500.000",colTotal,itemY);
    doc.moveTo(50,itemY+15).lineTo(550,itemY+15).strokeColor("#e0e0e0").stroke();
    doc.text("02",colIndex,itemY+20);
    doc.text("Imzen Aruba 02",colName,itemY+20);
    doc.text("Cái",colUnil,itemY+20);
    doc.text("20",colQuantity,itemY+20);
    doc.text("550.000",colPrice,itemY+20);
    doc.text("5.500.000",colTotal,itemY+20);
    doc.moveTo(50,itemY+35).lineTo(550,itemY+35).strokeColor("#e0e0e0").stroke();
    doc.font(fontBold).text("Tổng tiền:",50,itemY+45);
    doc.font(fontRegular).text("10.000.000đ",430,itemY+45);
    doc.font(fontBold).text("Số tiền bằng chữ: Mười triệu đồng",50,itemY+65);
    doc.font(fontRegular).text("Hình thức thanh toán: TM/CK",50,itemY+85);
    doc.font(fontRegular).text("Thời hạn thanh toán: 01/07/2026",50,itemY+105);
    doc.font(fontRegular).text("Người mua hàng",90,itemY+135);
    doc.font(fontRegular).text("Người bán hàng",430,itemY+135);
    doc.font(fontRegular).text("(Ký và ghi rõ họ tên)",90,itemY+150);
    doc.font(fontRegular).text("(Ký và ghi rõ họ tên)",430,itemY+150);
    doc.end();
  } catch (error) {
    res.setHeader("Content-Type", "text/html; charset=UTF-8");
    res.send(`<h3>Lỗi tạo bản xem trước PDF: ${error.message}</h3>`);
  }
};

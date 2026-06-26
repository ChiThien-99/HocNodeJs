import { cartEntity } from "../models/cart.model.js";
import { voucherEntity } from "../models/voucher.model.js";
import { provinceWardsEntity } from "../models/provinceWards.model.js";
import { clientEntity } from "../models/client.model.js";
import { otpEntity } from "../models/otp.model.js";
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
  cart.products.forEach((p) => {
    subTotal += p.price * p.quantity;
  });
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
            const percentToApply = Math.min(poolDiscountApp, 80);
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
      address: `${numberHouse},${wardsCommunes},${provinceCity}`,
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
      addressCompany: `${numberCompany},${wardsCommunesInvoice},${provinceCityInvoice}`,
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

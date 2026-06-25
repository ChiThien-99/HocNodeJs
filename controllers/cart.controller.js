import { cartEntity } from "../models/cart.model.js";
import { voucherEntity } from "../models/voucher.model.js";
import { provinceWardsEntity } from "../models/provinceWards.model.js";
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
  const province=provinceWards.map(pw=>pw.province);
  res.render("cart.ejs", {
    cart,
    vouchers,
    subTotal,
    province,
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
export const filterProvinceWards=async(req,res)=>{
  try {
  const {province}=req.body;
  const currentProvince=await provinceWardsEntity.findOne({province:province});
  const wards=currentProvince.wards;
  res.json({success:true,wards:wards});
  } catch (error) {
  res.json({mess:"Lỗi lọc ProvinceWards",success:false,error:error.message})
  }
  
}

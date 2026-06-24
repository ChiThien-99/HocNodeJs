import { appEntity } from "../models/app.model.js";
import { cartEntity } from "../models/cart.model.js";
export const getDetailApp = async (req, res) => {
  const { id } = req.params;
  if (!req.session.viewedApp) {
    req.session.viewedApp = [];
  }
  if (!req.session.viewedApp.includes(id)) {
    await appEntity.findByIdAndUpdate(id, { $inc: { views: 1 } });
    req.session.viewedApp.push(id);
  }
  const app = await appEntity.findById(id);
  res.render("detailApp.ejs", { app });
};
export const addCart = async (req, res) => {
  try {
    const { idClient, productId, productName, productPrice } = req.body;
    const numericPrice = Number(productPrice);
    if (!idClient || !productId) {
      return res.json({
        mess: "Thiếu thông tin client hoặc sản phẩm",
        success: false,
      });
    }
    let cart = await cartEntity.findOne({ clientId: idClient });
    let productIndex;
    if (!cart) {
      cart = new cartEntity({
        clientId: idClient,
        products: [
          {
            category:"app",
            productId: productId,
            productName: productName,
            price: numericPrice,
            quantity: 1,
            color: "-",
          },
        ],
      });
      await cart.save();
    } else {
      productIndex = cart.products.findIndex(
        (p) => p.productId.toString() === `${productId}`,
      );
      console.log(productIndex);
      if (productIndex > -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({
          category:"app",
          productId: productId,
          productName: productName,
          price: numericPrice,
          quantity: 1,
          color: "-",
        });
      }
      cart.updateAt = new Date();
      await cart.save();
    }
    if (productIndex === -1) {
      productIndex = cart.products.findIndex(
        (p) => p.productId.toString() === `${productId}`,
      );
    }
    const totalItems = cart.products.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    const io = req.app.get("socketio");
    console.log(cart.products[productIndex])
    io.emit("updateCart", [cart.products[productIndex], totalItems]);
    io.emit("update-totalItems", totalItems);
    res.json({
      mess: `Đã thêm phần mềm ${productName} vào giỏ hàng`,
      success: true,
      totalItems: totalItems,
    });
  } catch (error) {
    const { productName } = req.body;
    res.json({
      mess: `Thêm phần mềm ${productName} vào giỏ hàng thất bại`,
      success: false,
      error: error.message,
    });
  }
};
export const countCart = async (req, res) => {
  try {
    const { idClient } = req.query;
    if (!idClient) {
      return res.json({ success: true, totalItems: 0 });
    }
    const cart = await cartEntity.findOne({ clientId: idClient });
    if (!cart) {
      return res.json({ success: true, totalItems: 0 });
    }
    const totalItems = cart.products.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    res.json({ success: true, totalItems: totalItems });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

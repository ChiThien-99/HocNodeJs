import { cartEntity } from "../models/cart.model.js";
export const getCart = async (req, res) => {
  const { idClient } = req.params;
  const cart = await cartEntity.findOne({ clientId: idClient });
  res.render("cart.ejs", { cart });
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

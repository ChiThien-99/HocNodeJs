import { deviceEntity } from "../models/device.model.js";
import { appEntity } from "../models/app.model.js";
import { blogsEntity } from "../models/blogs.model.js";
import { commentDeviceEntity } from "../models/commentDevice.model.js";
import { bannerEntity } from "../models/banner.model.js";
import { cartEntity } from "../models/cart.model.js";

export const getDetailDevice = async (req, res) => {
  const { id } = req.params;
  const device = await deviceEntity.findById(id);
  const apps = await appEntity.find().sort("-createAt").limit(4);
  const blogs = await blogsEntity.find().sort("-createAt").limit(4);
  const commentDevice = await commentDeviceEntity
    .find({ deviceId: id })
    .sort("-createAt");
  const otherDevice = await deviceEntity
    .find({ _id: { $ne: id } })
    .sort("-createAt")
    .limit(4);
  const banners = await bannerEntity.find({ page: "device" });
  res.render("detailDevice.ejs", {
    device,
    apps,
    blogs,
    commentDevice,
    otherDevice,
    banners,
  });
};
export const postAddComment = async (req, res) => {
  try {
    const { id } = req.params;
    let { authorComment, contentComment, parentCommentId } = req.body;
    if (!authorComment || authorComment.trim() === "") {
      authorComment = "Ẩn danh";
    }
    const comment = {
      deviceId: id,
      author: authorComment,
      content: contentComment,
    };
    if (parentCommentId && parentCommentId.trim() !== "") {
      comment.parentId = parentCommentId;
    }
    const newComment = await commentDeviceEntity.create(comment);
    const listComment = await commentDeviceEntity
      .find({ deviceId: id })
      .sort("-createAt");
    res.json({ data: listComment, success: true });
  } catch (error) {
    res.json({ data: error.message, success: false });
  }
};
export const handleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.ip;
    const comment = await commentDeviceEntity.findById(id);
    if (!comment) {
      res.json({ success: false, data: "Bình luận không tồn tại" });
    }
    const haslike = comment.likes.includes(userId);
    if (haslike) {
      comment.likes = comment.likes.filter((id) => id !== userId);
    } else {
      comment.likes.push(userId);
    }
    await comment.save();
    res.json({ success: true, likeCount: comment.likes.length });
  } catch (error) {
    res.json({ success: false, data: error.message });
  }
};
export const addCart = async (req, res) => {
  try {
    const {
      idClient,
      productId,
      productName,
      productPrice,
      productQuantity,
      productColor,
    } = req.body;
    if (!productColor) {
      console.log(productColor);
      return res.json({ mess: "Vui lòng chọn màu thiết bị", success: false });
    }
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
            category:"device",
            productId: `${productId}${productColor}`,
            productName: productName,
            price: numericPrice,
            quantity: productQuantity,
            color: productColor,
          },
        ],
      });
      await cart.save();
    } else {
      productIndex = cart.products.findIndex(
        (p) => p.productId.toString() === `${productId}${productColor}`,
      );
      console.log(productIndex);
      if (productIndex > -1) {
        cart.products[productIndex].quantity += Number(productQuantity);
      } else {
        cart.products.push({
          category:"device",
          productId: `${productId}${productColor}`,
          productName: productName,
          price: numericPrice,
          quantity: productQuantity,
          color: productColor,
        });
      }
      cart.updateAt = new Date();
      await cart.save();
    }
    if (productIndex === -1) {
      productIndex = cart.products.findIndex(
        (p) => p.productId.toString() === `${productId}${productColor}`,
      );
    }
    const totalItems = cart.products.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    const io = req.app.get("socketio");
    io.emit("updateCart", [cart.products[productIndex], totalItems]);
    io.emit("update-totalItems", totalItems);
    res.json({ success: true, totalItems: totalItems });
  } catch (error) {
    const { productName } = req.body;
    res.json({
      mess: `Thêm thiết bị ${productName} vào giỏ hàng thất bại`,
      success: false,
      error: error.message,
    });
  }
};

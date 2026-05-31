import { deviceEntity } from "../models/device.model.js";
import { appEntity } from "../models/app.model.js";
import { blogsEntity } from "../models/blogs.model.js";
import { commentDeviceEntity } from "../models/commentDevice.model.js";
import { bannerEntity } from "../models/banner.model.js";

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

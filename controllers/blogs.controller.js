import { blogsEntity } from "../models/blogs.model.js";
import { appEntity } from "../models/app.model.js";
import { deviceEntity } from "../models/device.model.js";
import { commentBlogsEntity } from "../models/commentBlogs.model.js";
import { categoryblogsEntity } from "../models/categoryblogs.model.js";

export const getBlogs = async (req, res) => {
  const apps = await appEntity.find().sort("-views").limit(4);
  const devices = await deviceEntity.find().sort("-createAt").limit(4);
  const categoryblogs = await categoryblogsEntity.find().sort("-createAt");
  const limit = 12;
  const currentPage = parseInt(req.query.page) || 1;
  const currentCategory = req.query.category || "";
  const sort = req.query.sort || "createAt";
  const query = {};
  let filterArray = [];
  if (currentCategory) {
    filterArray = Array.isArray(currentCategory)
      ? currentCategory
      : currentCategory.split(",");
    query.category = { $in: filterArray };
  }
  const skip = (currentPage - 1) * limit;
  const [blogList, blogTotal] = await Promise.all([
    blogsEntity.find(query).sort(`-${sort}`).skip(skip).limit(limit),
    blogsEntity.countDocuments(query),
  ]);
  const totalPage = Math.ceil(blogTotal / limit);
  res.render("blogs.ejs", {
    apps,
    devices,
    categoryblogs,
    blogList,
    currentPage,
    totalPage,
    currentCategory: currentCategory || "",
    sort,
  });
};
export const getDetailblogs = async (req, res) => {
  const { id } = req.params;
  const blogs = await blogsEntity.findById(id);
  if (!req.session.viewedBlog) {
    req.session.viewedBlog = [];
  }
  if (!req.session.viewedBlog.includes(id)) {
    await blogsEntity.findByIdAndUpdate(id, { $inc: { views: 1 } });
    req.session.viewedBlog.push(id);
  }
  const apps = await appEntity.find().sort("-views").limit(4);
  const devices = await deviceEntity.find().sort("-createAt").limit(4);
  const query = {};
  if (blogs.category) {
    const filterArray = Array.isArray(blogs.category)
      ? blogs.category
      : [blogs.category];
    query.category = { $in: filterArray };
  }
  const relatedblogs = await blogsEntity.find(query).sort("-createAt").limit(4);
  const latestblogs = await blogsEntity.find().sort("-createAt").limit(4);
  const comments = await commentBlogsEntity.find({ blogsId: id }).sort("-createAt");
  res.render("detailblogs.ejs", {
    blogs,
    apps,
    devices,
    relatedblogs,
    latestblogs,
    comments,
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
      blogsId: id,
      author: authorComment,
      content: contentComment,
    };
    if (parentCommentId && parentCommentId.trim() !== "") {
      comment.parentId = parentCommentId;
    }
    const newComment = await commentBlogsEntity.create(comment);
    const listComment = await commentBlogsEntity
      .find({ blogsId: id })
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
    const comment = await commentBlogsEntity.findById(id);
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

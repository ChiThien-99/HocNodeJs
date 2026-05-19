import { newsEntity } from "../models/news.model.js";
import { appEntity } from "../models/app.model.js";
import { deviceEntity } from "../models/device.model.js";
import { commentEntity } from "../models/comment.model.js";
export const getDetailNews = async (req, res) => {
  const { id } = req.params;
  const news = await newsEntity.findById(id);
  const apps = await appEntity.find().sort("-views").limit(4);
  const devices = await deviceEntity.find().sort("-createAt").limit(4);
  const query = {};
  if (news.category) {
    const filterArray = Array.isArray(news.category)
      ? news.category
      : [news.category];
    query.category = { $in: filterArray };
  }
  const relatedNews = await newsEntity.find(query).sort("-createAt").limit(4);
  const latestNews = await newsEntity.find().sort("-createAt").limit(4);
  const comments=await commentEntity.find().sort("-createAt");
  res.render("detailNews.ejs", {
    news,
    apps,
    devices,
    relatedNews,
    latestNews,
    comments,
  });
};
export const postAddComment=async(req,res)=>{
  try {
  const {id}=req.params;
  let {authorComment,contentComment}=req.body;
  if (!authorComment||authorComment.trim()==="") {
    authorComment="Ẩn danh";
  }
  const newComment=await commentEntity.create({
    newsId:id,
    author:authorComment,
    content:contentComment,
  })
  const listComment=await commentEntity.find().sort("-createAt")
  res.json({data:listComment,success:true});
  } catch (error) {
  res.json({data:error.message,success:false});
  }
}
export const handleLike=async(req,res)=>{
  try {
    const {id}=req.params;
    const userId=req.ip;
    const comment=await commentEntity.findById(id);
    if (!comment) {
      res.json({success:false,data:"Bình luận không tồn tại"});
    }
    const haslike=comment.likes.includes(userId);
    if (haslike) {
      comment.likes=comment.likes.filter(id=>id!==userId);
    } else {
      comment.likes.push(userId);
    }
    await comment.save();
    res.json({success:true,likeCount:comment.likes.length})
  } catch (error) {
    res.json({success:false,data:error.message});
  }
}

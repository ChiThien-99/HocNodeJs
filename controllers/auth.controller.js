import { adminEntity } from "../models/admin.model.js";
export const authTokens=async(req,res)=>{
    const oldRefreshToken = req.cookies.refreshToken;
      if (!oldRefreshToken) {
        return res.status(401).json("Chưa đăng nhập");
      }
      const admin = await adminEntity.findOne({ refreshToken: oldRefreshToken });
      if (!admin) {
        return res.status(403).json("Refresh Token không hợp lệ hoặc đã sử dụng");
      }
      jwt.verify(oldRefreshToken, process.env.REFRESH_SECRET, async (err, decodes) => {
        if (err) {
          await adminEntity.updateOne(
            {_id:admin._id},
            {$pull:{refreshToken: oldRefreshToken}}
          )
          return res.status(403).json("Token đã hết hạn hoặc sai");
        }
        const newAccessToken = jwt.sign(
          {
            id:admin._id,
            fullname: admin.fullname,
            role: admin.role,
            email: admin.email,
            decent: admin.decent,
          },
          process.env.ACCESS_SECRET,
          { expiresIn: "10s" },
        );
        console.log(`newAccessToken: ${newAccessToken}`)
        const newRefreshToken=jwt.sign(
          {id:admin._id},
          process.env.REFRESH_SECRET,
          {expiresIn:"7d"}
        )
        console.log(`newRefreshToken: ${newRefreshToken}`)
        await adminEntity.updateOne(
          {_id:admin._id,refreshToken:oldRefreshToken}, 
          {$set:{"refreshToken.$":newRefreshToken}}
        )
        res.cookie("refreshToken",newRefreshToken,{
          httpOnly:true,
          secure:true,
          sameSite:"none",
          path:"/",
          maxAge:7*24*60*60*1000
        })
        res.json({ accessToken: newAccessToken });
      });
}
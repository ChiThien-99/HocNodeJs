export const checkTokens=(req,res,next)=>{
    const authHeader=req.headers['authorization'];
    const accessToken=authHeader && authHeader.split(" ")[1];
    const refreshToken=req.cookies.refreshToken;
    console.log(`Access token hiện tại: ${accessToken?"Đã có":"Trống"}`);
    console.log(`Refresh token hiện tại: ${refreshToken?"Đã có":"Trống"}`);
    next();
};
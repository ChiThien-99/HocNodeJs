export const checkTokens=(req,res,next)=>{
    const authHeader=req.headers['authorization'];
    const acTokenFromHeader=authHeader && authHeader.split(" ")[1];
    const acTokenFromCookie=req.cookies?req.cookies.accessToken:null;
    const accessToken=acTokenFromHeader||acTokenFromCookie;
    const refreshToken=req.cookies.refreshToken;
    console.log(`Access token hiện tại: ${accessToken?"Đã có":"Trống"}`);
    console.log(`Refresh token hiện tại: ${refreshToken?"Đã có":"Trống"}`);
    next();
};
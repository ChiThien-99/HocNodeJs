export const checkTokens=(req,res,next)=>{
    const authHeader=req.headers['authorization'];
    const acTokenFromHeader=authHeader && authHeader.split(" ")[1];
    const acTokenFromCookie=req.cookies?req.cookies.accessToken:null;
    const accessToken=acTokenFromHeader||acTokenFromCookie;
    const refreshToken=req.cookies.refreshToken;
    next();
};
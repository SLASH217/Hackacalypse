const User=require('../models/User');
const jwt=require('jsonwebtoken')
const fetchUser=async(req, res,next)=>{
    const auth_token=req.header('auth-token');
    const user=jwt.decode(auth_token);
    let success=false;
    if(!user)return res.status(401).json({success, msg:"Unauthorized"});
    const verifyUser=User.findById({id:user.id});
    if(!verifyUser)return res.status(401).json({success, msg:"Unauthorized"});
    req.user=user;
    next();
}
module.exports={fetchUser};
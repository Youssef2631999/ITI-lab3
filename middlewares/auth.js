var jwt = require('jsonwebtoken');
const { secret } = require('../serverConfig');
const User = require('../models/User')
const auth = async (req,res,next)=>{
    const token = req.headers.token
    try {
      
        return next()
      } catch(err) {
          next({status:401, message:"Authentication error"})
      }
}


module.exports = {
    auth
}
const jwt = require('jsonwebtoken');
const HttpError = require('../../models/http-error');

module.exports = (req, res, next) => {
 
  //const token = req.cookies.token;
  const token = req.headers.authorization.split(" ")[1];
 // console.log(token,"hello");
  
  if (!token) {
      throw new HttpError('Not authenticated.',401);
      
    }

  let decodedToken= jwt.verify(token, process.env.SECRET_KEY);
  
  if (!decodedToken) {
    throw new HttpError('Not authenticated.',401);
  }
  req.userId = decodedToken.userId;
  
  next();
};




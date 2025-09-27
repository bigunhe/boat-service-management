import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {

  // get token from headers -- 
  // req.headers.authorization contains bearer token - .split(' ') splits the string into an array of substrings - [0] is bearer and [1] is token- have to take the second element.. ?. prevents errors if auth header is not present
  
  const token = req.headers.authorization?.split(' ')[1];

  if(!token){
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    })
  }

  // verify token

  try{
    console.log('JWT_SECRET being used:', process.env.JWT_SECRET ? 'Secret loaded' : 'No secret');
    console.log('Token being verified:', token.substring(0, 20) + '...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // add user info to request object

    next(); // move to next middleware/ controller

  }catch(error){
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    })
  }

}  

export default authMiddleware;

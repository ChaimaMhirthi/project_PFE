const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const authenticateToken = asyncHandler(async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const authHeader = authorization.split(' ');
  console.log(res.user);
  if (authHeader[0] === 'Bearer' && authHeader[1]) {
    try {
      const { ACCESS_TOKEN_SECRET } = process.env;
      const decoded = await jwt.verify(authHeader[1], ACCESS_TOKEN_SECRET);
      req.user = decoded.user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token has expired' });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Token is invalid' });
      } else {
        return res.status(401).json({ error: 'User is not authenticated' });
      }
    }
  } else if (!authHeader[0] || authHeader[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Authorization header must start with Bearer' });
  } else {
    return res.status(401).json({ error: 'Token is missing' });
  }
});



module.exports = { authenticateToken };



const jwt = require('jsonwebtoken');

// Used to get Secret Token
const dotenv = require('dotenv');
dotenv.config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET);
    req.userData = { id: decodedToken.id, type: decodedToken.type };
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: 'You are not authenticated!'});
  }

};
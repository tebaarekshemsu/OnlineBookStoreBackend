import jwt from 'jsonwebtoken';

const adminAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded.admin; // Assuming `admin` is the payload in the token
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default adminAuthMiddleware;
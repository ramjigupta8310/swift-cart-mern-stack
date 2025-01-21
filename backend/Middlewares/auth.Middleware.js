import jwt from 'jsonwebtoken';

const authenticateUser = (req, res, next) => {
  // console.log(req.body)
  try {
    const token = req.header('Authorization'); 
    // console.log(token)
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided" });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
      // Attach user data to the request object
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export default authenticateUser;

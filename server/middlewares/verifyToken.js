import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,       // ✅ match with token's payload
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

export default verifyToken;
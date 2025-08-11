const isStoreOwner = (req, res, next) => {
  try {
    if (req.user.role !== 'STORE_OWNER') {
      return res.status(403).json({ 
        message: 'Access denied. Store owner privileges required.' 
      });
    }
    
    next();
  } catch (error) {
    console.error('Store owner middleware error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default isStoreOwner;
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const handleError = (res, error, defaultMessage = 'An error occurred') => {
  console.error(error);
  res.status(500).json({ 
    success: false,
    message: error.message || defaultMessage
  });
};

// ✅ Admin: Create Normal User or Store Owner
export const createUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !address || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Only allow USER or STORE_OWNER
    if (!['USER', 'STORE_OWNER'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role,
      }
    });

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    handleError(res, error, 'Error creating user');
  }
};

// ✅ Admin: Create Store for Store Owner (with unique ownerId check)
export const createStoreByAdmin = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!name || !email || !address || !ownerId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Verify owner exists and is STORE_OWNER
    const owner = await prisma.user.findUnique({ where: { id: ownerId } });
    if (!owner || owner.role !== 'STORE_OWNER') {
      return res.status(400).json({ message: 'Owner must be a valid STORE_OWNER' });
    }

    // Check if this owner already owns a store (unique ownerId constraint)
    const existingStoreForOwner = await prisma.store.findUnique({
      where: { ownerId }
    });
    if (existingStoreForOwner) {
      return res.status(400).json({ message: 'This owner already has a store' });
    }

    // Also check if store email already exists
    const existingStore = await prisma.store.findUnique({ where: { email } });
    if (existingStore) {
      return res.status(409).json({ message: 'Store with this email already exists' });
    }

    // Create the store
    const newStore = await prisma.store.create({
      data: {
        name,
        email,
        address,
        ownerId
      }
    });

    res.status(201).json({ message: 'Store created successfully', store: newStore });

  } catch (err) {
    handleError(res, err, 'Failed to create store');
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalRatings = await prisma.rating.count();

    res.status(200).json({
      totalUsers,
      totalStores,
      totalRatings,
    });
  } catch (error) {
    handleError(res, error, 'Failed to fetch dashboard stats');
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { name, email, address, role } = req.query;

    const users = await prisma.user.findMany({
      where: {
        name: name ? { contains: name } : undefined,
        email: email ? { contains: email } : undefined,
        address: address ? { contains: address } : undefined,
        role: role || undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        store: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            ratings: {
              select: {
                value: true
              }
            }
          }
        }
      },
    });

    const formattedUsers = users.map(user => {
      const isStoreOwner = user.role === 'STORE_OWNER';
      const ratings = user.store?.ratings || [];
      const averageRating = isStoreOwner && ratings.length
        ? (ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length).toFixed(2)
        : null;

      return {
        ...user,
        store: user.store ? {
          ...user.store,
          averageRating
        } : null
      };
    });

    res.status(200).json(formattedUsers);
  } catch (error) {
    handleError(res, error, 'Failed to fetch users');
  }
};

export const getAllStores = async (req, res) => {
  try {
    const stores = await prisma.store.findMany({
      include: {
        ratings: true,
      }
    });

    const formatted = stores.map(store => {
      const avgRating = store.ratings.length
        ? (store.ratings.reduce((sum, r) => sum + r.value, 0) / store.ratings.length).toFixed(2)
        : null;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: avgRating
      };
    });

    res.status(200).json(formatted);
  } catch (err) {
    handleError(res, err, 'Failed to fetch stores');
  }
};

// Get all store owners (users with role STORE_OWNER)
export const getStoreOwners = async (req, res) => {
  try {
    const owners = await prisma.user.findMany({
      where: {
        role: 'STORE_OWNER'
      },
      select: { id: true, email: true, name: true }
    });
    res.json(owners);
  } catch (error) {
    handleError(res, error, 'Failed to fetch store owners');
  }
};



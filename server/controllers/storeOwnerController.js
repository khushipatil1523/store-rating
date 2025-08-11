import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const getStoreOwnerDashboard = async (req, res) => {
  try {
    const storeOwnerId = req.user.id;

    const store = await prisma.store.findUnique({
      where: { ownerId: storeOwnerId },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            id: 'desc',
          },
        },
      },
    });

    if (!store) {
      return res.status(404).json({ 
        message: 'No store found for this owner', 
        action: 'CREATE_STORE' 
      });
    }

    const avgRating = store.ratings.length
      ? (store.ratings.reduce((sum, r) => sum + r.value, 0) / store.ratings.length).toFixed(2)
      : null;

    const ratingsData = store.ratings.map(rating => ({
      id: rating.id,
      value: rating.value,
      user: {
        id: rating.user.id,
        name: rating.user.name,
        email: rating.user.email,
      },
    }));

    res.status(200).json({
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: avgRating,
        totalRatings: store.ratings.length,
      },
      ratingsData,
    });
  } catch (error) {
    console.error('Error fetching store owner dashboard:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
};

export const getMyStore = async (req, res) => {
  try {
    const storeOwnerId = req.user.id;

    const store = await prisma.store.findUnique({
      where: { ownerId: storeOwnerId },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!store) {
      return res.status(404).json({ 
        message: 'No store found for this owner', 
        action: 'CREATE_STORE' 
      });
    }

    const avgRating = store.ratings.length
      ? (store.ratings.reduce((sum, r) => sum + r.value, 0) / store.ratings.length).toFixed(2)
      : null;

    res.status(200).json({
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      averageRating: avgRating,
      totalRatings: store.ratings.length,
      ratings: store.ratings.map(r => ({
        id: r.id,
        value: r.value,
        userName: r.user.name,
        userId: r.user.id,
      })),
    });
  } catch (error) {
    console.error('Error fetching store details:', error);
    res.status(500).json({ message: 'Failed to fetch store details' });
  }
};
export const createStore = async (req, res) => {
  try {
    const storeOwnerId = req.user.id;
    const { name, email, address } = req.body;

    // Validation
    if (!name || !email || !address) {
      return res.status(400).json({ message: 'Store name, email, and address are required' });
    }

    // Check if user already has a store
    const existingStore = await prisma.store.findUnique({
      where: { ownerId: storeOwnerId },
    });

    if (existingStore) {
      return res.status(400).json({ message: 'You already have a store' });
    }

    // Check if store email is taken
    const emailTaken = await prisma.store.findFirst({
      where: { email: email.trim().toLowerCase() },
    });

    if (emailTaken) {
      return res.status(400).json({ message: 'Email is already taken by another store' });
    }

    // Create store
    const newStore = await prisma.store.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        address: address.trim(),
        ownerId: storeOwnerId,
      },
    });

    res.status(201).json({
      message: 'Store created successfully',
      store: {
        id: newStore.id,
        name: newStore.name,
        email: newStore.email,
        address: newStore.address,
      },
    });
  } catch (error) {
    console.error('Error creating store:', error);
    res.status(500).json({ message: 'Failed to create store' });
  }
};

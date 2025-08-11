import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllStoresForUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const stores = await prisma.store.findMany({
      include: {
        ratings: {
          include: {
            user: true,
          },
        },
      },
    });

    const formattedStores = stores.map(store => {
      const userRating = store.ratings.find(r => r.userId === userId);
      const avgRating = store.ratings.length
        ? (store.ratings.reduce((sum, r) => sum + r.value, 0) / store.ratings.length).toFixed(2)
        : null;

      const ratingsWithUser = store.ratings.map(r => ({
        id: r.id,
        value: r.value,
        userId: r.userId,
        userName: r.user?.name ?? 'Unknown',
      }));

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        averageRating: avgRating,
        yourRating: userRating?.value ?? null,
        ratings: ratingsWithUser,
      };
    });

    res.status(200).json(formattedStores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ message: 'Failed to fetch stores' });
  }
};

export const submitRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { storeId, value } = req.body;

    if (!storeId || typeof value !== 'number') {
      return res.status(400).json({ message: 'Store ID and numeric rating value are required' });
    }

    if (value < 1 || value > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const existing = await prisma.rating.findFirst({
      where: { userId, storeId },
    });

    let rating;
    if (existing) {
      rating = await prisma.rating.update({
        where: { id: existing.id },
        data: { value },
      });
    } else {
      rating = await prisma.rating.create({
        data: {
          value,
          storeId,
          userId,
        },
      });
    }

    res.status(200).json({ message: 'Rating submitted successfully', rating });
  } catch (error) {
    console.error('Submit Rating Error:', error);
    res.status(500).json({ message: 'Failed to submit rating' });
  }
};

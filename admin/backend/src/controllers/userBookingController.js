import prisma from '../prismaClient.js';

// Calculate days between two dates
const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, diffDays);
};

export const createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { carId, startDate, endDate } = req.body;

    if (!carId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Car ID, start date, and end date required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    // Check if car exists
    const car = await prisma.car.findUnique({ where: { id: carId } });
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Check for overlapping bookings
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        carId,
        status: { in: ['ACTIVE', 'APPROVED'] },
        AND: [
          { startDate: { lt: end } },
          { endDate: { gt: start } }
        ]
      }
    });

    if (overlappingBooking) {
      return res.status(400).json({ message: 'Car is not available for selected dates' });
    }

    const days = calculateDays(startDate, endDate);
    const totalCost = days * car.pricePerDay;

    const booking = await prisma.booking.create({
      data: {
        userId,
        carId,
        startDate: start,
        endDate: end,
        totalCost,
        status: 'ACTIVE'
      },
      include: {
        car: { select: { id: true, make: true, model: true, year: true, type: true, pricePerDay: true, images: true } }
      }
    });

    return res.status(201).json(booking);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        car: { select: { id: true, make: true, model: true, year: true, type: true, pricePerDay: true, images: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json(bookings);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getBookingDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookingId } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        car: { select: { id: true, make: true, model: true, year: true, type: true, pricePerDay: true, images: true, description: true } }
      }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    return res.json(booking);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookingId } = req.params;

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const startDate = new Date(booking.startDate);
    const now = new Date();

    if (startDate <= now) {
      return res.status(400).json({ message: 'Cannot cancel booking after start date' });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
      include: {
        car: { select: { id: true, make: true, model: true, year: true, type: true, pricePerDay: true, images: true } }
      }
    });

    return res.json(updatedBooking);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

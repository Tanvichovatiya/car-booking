import prisma from '../prismaClient.js';

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        car: { select: { id: true, make: true, model: true, year: true, type: true, pricePerDay: true, image: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(bookings);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        car: { select: { id: true, make: true, model: true, year: true, type: true, pricePerDay: true, image: true } }
      }
    });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    return res.json(booking);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const changeBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'ACTIVE', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        car: { select: { id: true, make: true, model: true, year: true, type: true, pricePerDay: true, image: true } }
      }
    });
    return res.json(booking);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

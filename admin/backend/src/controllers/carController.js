import prisma from '../prismaClient.js';
import cloudinary from '../utils/cloudinary.js'
import streamifier from 'streamifier'

export const createCar = async (req, res) => {
  try {
    const { make, model, year, pricePerDay } = req.body;
    const images = []
    if (req.files && req.files.length) {
      for (const file of req.files) {
        const uploaded = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream({ folder: 'cars' }, (error, result) => {
            if (error) return reject(error)
            resolve(result)
          })
          streamifier.createReadStream(file.buffer).pipe(uploadStream)
        })
        images.push(uploaded.secure_url)
      }
    }

    const car = await prisma.car.create({ data: { make, model, year: Number(year), pricePerDay: Number(pricePerDay), images } })
    return res.json(car)
  } catch (err) {
    console.error('Error creating car:', err);
    return res.status(500).json({ message: err.message, error: err.toString() });
  }
};

export const getAllCars = async (req, res) => {
  try {
    const cars = await prisma.car.findMany({ orderBy: { createdAt: 'desc' } });
    return res.json(cars);
  } catch (err) {
    console.error('Error fetching cars:', err);
    return res.status(500).json({ message: err.message, error: err.toString() });
  }
};

export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body }
    if (data.year) data.year = Number(data.year);
    if (data.pricePerDay) data.pricePerDay = Number(data.pricePerDay);

    // handle uploaded files
    const newImages = []
    if (req.files && req.files.length) {
      for (const file of req.files) {
        const uploaded = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream({ folder: 'cars' }, (error, result) => {
            if (error) return reject(error)
            resolve(result)
          })
          streamifier.createReadStream(file.buffer).pipe(uploadStream)
        })
        newImages.push(uploaded.secure_url)
      }
    }

    // allow keeping existing images passed as JSON array in body.images
    let images = []
    if (data.images) {
      try { images = typeof data.images === 'string' ? JSON.parse(data.images) : data.images } catch (e) { images = data.images }
    }
    data.images = [...images, ...newImages]

    const car = await prisma.car.update({ where: { id }, data })
    return res.json(car)
  } catch (err) {
    console.error('Error updating car:', err);
    return res.status(500).json({ message: err.message, error: err.toString() });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.car.delete({ where: { id } });
    return res.json({ message: 'Car deleted' });
  } catch (err) {
    console.error('Error deleting car:', err);
    return res.status(500).json({ message: err.message, error: err.toString() });
  }
};

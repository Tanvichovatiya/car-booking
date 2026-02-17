import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import prisma from '../prismaClient.js';

dotenv.config();

export const registerAdmin = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Admin already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const admin = await prisma.admin.create({ data: { email, password: hashed, name } });
    return res.json({ id: admin.id, email: admin.email, name: admin.name });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    let admin = await prisma.admin.findUnique({ where: { email } });

    // If admin not found, allow fallback default credentials and create the admin record.
    // Prefer environment variables `DEFAULT_ADMIN_EMAIL` / `DEFAULT_ADMIN_PASSWORD` if set.
    const DEFAULT_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || 'admin@gmail.com'
    const DEFAULT_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || 'admin##23'

    if (!admin) {
      if (email === DEFAULT_EMAIL && password === DEFAULT_PASSWORD) {
        const hashed = await bcrypt.hash(password, 10);
        admin = await prisma.admin.create({ data: { email, password: hashed, name: 'Default Admin' } });
      } else {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      const ok = await bcrypt.compare(password, admin.password);
      if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name } });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const generateToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
  return token;
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
};

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const comparePasswords = async (password, hashedPassword) => {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
};

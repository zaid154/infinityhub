import jwt from 'jsonwebtoken';

export const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'technova_fallback_secret_key',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    }
  );
};

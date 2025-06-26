const jwt = require('jsonwebtoken');
const { logger } = require('./logger');

function generateToken(user) {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET não configurado');
    }

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      iat: Math.floor(Date.now() / 1000),
    };

    const options = {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
      issuer: 'nextlevel-api',
      audience: 'nextlevel-client',
    };

    const token = jwt.sign(payload, secret, options);
    
    logger.info(`Token gerado para usuário: ${user.email}`);
    return token;
  } catch (error) {
    logger.error(`Erro ao gerar token: ${error.message}`);
    throw error;
  }
}

function verifyToken(token) {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET não configurado');
    }

    const decoded = jwt.verify(token, secret, {
      issuer: 'nextlevel-api',
      audience: 'nextlevel-client',
    });

    return decoded;
  } catch (error) {
    logger.error(`Erro ao verificar token: ${error.message}`);
    throw error;
  }
}

module.exports = { generateToken, verifyToken };

const { verifyToken } = require('../utils/generateToken');
const { logger } = require('../utils/logger');

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      logger.warn('Tentativa de acesso sem token de autorização');
      return res.status(401).json({ 
        error: 'Token de autorização não fornecido',
        code: 'AUTH_TOKEN_MISSING'
      });
    }

    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      logger.warn('Formato de token inválido');
      return res.status(401).json({ 
        error: 'Formato de token inválido',
        code: 'AUTH_TOKEN_INVALID_FORMAT'
      });
    }

    const token = parts[1];
    
    if (!token) {
      logger.warn('Token vazio fornecido');
      return res.status(401).json({ 
        error: 'Token vazio',
        code: 'AUTH_TOKEN_EMPTY'
      });
    }

    const decoded = verifyToken(token);
    
    // Adicionar informações do usuário ao request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      iat: decoded.iat
    };

    logger.info(`Usuário autenticado: ${decoded.email}`);
    next();
    
  } catch (error) {
    logger.error(`Erro na autenticação: ${error.message}`);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expirado',
        code: 'AUTH_TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Token inválido',
        code: 'AUTH_TOKEN_INVALID'
      });
    }
    
    return res.status(500).json({ 
      error: 'Erro interno na autenticação',
      code: 'AUTH_INTERNAL_ERROR'
    });
  }
}

module.exports = authMiddleware;

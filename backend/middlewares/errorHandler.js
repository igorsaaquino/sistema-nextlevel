const { logger } = require('../utils/logger');

function errorHandler(err, req, res, next) {
  // Log do erro
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Erros de validação
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: err.message,
      code: 'VALIDATION_ERROR'
    });
  }

  // Erros de banco de dados
  if (err.code === 'SQLITE_CONSTRAINT') {
    return res.status(409).json({
      error: 'Conflito de dados',
      details: 'Registro já existe ou viola restrição',
      code: 'DATABASE_CONSTRAINT_ERROR'
    });
  }

  // Erros de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token inválido',
      code: 'JWT_INVALID'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expirado',
      code: 'JWT_EXPIRED'
    });
  }

  // Erro padrão
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Erro interno do servidor' 
    : err.message;

  res.status(statusCode).json({
    error: message,
    code: err.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

module.exports = errorHandler; 
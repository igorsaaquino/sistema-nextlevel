require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

// Importações locais
const { logger, morganFormat } = require('./utils/logger');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de segurança
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Configuração CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Compressão
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP
  message: {
    error: 'Muitas requisições deste IP, tente novamente em 15 minutos',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Rate limiting específico para autenticação
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // limite de 5 tentativas de login por IP
  message: {
    error: 'Muitas tentativas de login, tente novamente em 15 minutos',
    code: 'AUTH_RATE_LIMIT_EXCEEDED'
  },
  skipSuccessfulRequests: true,
});
app.use('/api/login', authLimiter);
app.use('/api/register', authLimiter);

// Logging
app.use(morgan(morganFormat, {
  stream: {
    write: (message) => logger.http(message.trim())
  }
}));

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    code: 'ROUTE_NOT_FOUND',
    path: req.originalUrl
  });
});

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM recebido, fechando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT recebido, fechando servidor...');
  process.exit(0);
});

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  logger.error('Erro não capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Promise rejeitada não tratada:', reason);
  process.exit(1);
});

// Iniciar servidor
app.listen(PORT, () => {
  logger.info(`🚀 Servidor rodando em http://localhost:${PORT}`);
  logger.info(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔒 Rate limiting: ativo`);
  logger.info(`🛡️  Helmet: ativo`);
  logger.info(`🗜️  Compressão: ativa`);
});

module.exports = app;

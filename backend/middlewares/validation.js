const { logger } = require('../utils/logger');

// Validação de email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validação de senha
function isValidPassword(password) {
  // Mínimo 8 caracteres, pelo menos uma letra e um número
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

// Validação de nome
function isValidName(name) {
  return name && name.trim().length >= 2 && name.trim().length <= 100;
}

// Middleware de validação para registro
function validateRegister(req, res, next) {
  const { name, email, password } = req.body;

  const errors = [];

  if (!isValidName(name)) {
    errors.push('Nome deve ter entre 2 e 100 caracteres');
  }

  if (!isValidEmail(email)) {
    errors.push('Email inválido');
  }

  if (!isValidPassword(password)) {
    errors.push('Senha deve ter pelo menos 8 caracteres, uma letra e um número');
  }

  if (errors.length > 0) {
    logger.warn(`Validação falhou para registro: ${errors.join(', ')}`);
    return res.status(400).json({
      error: 'Dados inválidos',
      details: errors,
      code: 'VALIDATION_ERROR'
    });
  }

  next();
}

// Middleware de validação para login
function validateLogin(req, res, next) {
  const { email, password } = req.body;

  const errors = [];

  if (!email || !email.trim()) {
    errors.push('Email é obrigatório');
  }

  if (!password || !password.trim()) {
    errors.push('Senha é obrigatória');
  }

  if (errors.length > 0) {
    logger.warn(`Validação falhou para login: ${errors.join(', ')}`);
    return res.status(400).json({
      error: 'Dados inválidos',
      details: errors,
      code: 'VALIDATION_ERROR'
    });
  }

  next();
}

// Middleware de validação para tarefas
function validateTask(req, res, next) {
  const { title, description, status, priority } = req.body;

  const errors = [];

  if (!title || !title.trim()) {
    errors.push('Título é obrigatório');
  } else if (title.trim().length > 200) {
    errors.push('Título deve ter no máximo 200 caracteres');
  }

  if (description && description.length > 1000) {
    errors.push('Descrição deve ter no máximo 1000 caracteres');
  }

  if (status && !['pendente', 'em_andamento', 'concluida', 'cancelada'].includes(status)) {
    errors.push('Status inválido');
  }

  if (priority && !['baixa', 'media', 'alta'].includes(priority)) {
    errors.push('Prioridade inválida');
  }

  if (errors.length > 0) {
    logger.warn(`Validação falhou para tarefa: ${errors.join(', ')}`);
    return res.status(400).json({
      error: 'Dados inválidos',
      details: errors,
      code: 'VALIDATION_ERROR'
    });
  }

  next();
}

module.exports = {
  validateRegister,
  validateLogin,
  validateTask,
  isValidEmail,
  isValidPassword,
  isValidName
}; 
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../config/database').getDatabase();
const { generateToken } = require('../utils/generateToken');
const { logger } = require('../utils/logger');
const { validateRegister, validateLogin } = require('../middlewares/validation');

// Registro de usuário
router.post('/register', validateRegister, async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Verificar se usuário já existe
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      logger.warn(`Tentativa de registro com email já existente: ${email}`);
      return res.status(409).json({ 
        error: 'E-mail já cadastrado',
        code: 'USER_ALREADY_EXISTS'
      });
    }

    // Hash da senha
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Inserir usuário
    const stmt = db.prepare(`
      INSERT INTO users (name, email, password) 
      VALUES (?, ?, ?)
    `);
    
    const result = stmt.run(name.trim(), email.toLowerCase().trim(), hashedPassword);
    
    const newUser = {
      id: result.lastInsertRowid,
      name: name.trim(),
      email: email.toLowerCase().trim()
    };

    // Gerar token
    const token = generateToken(newUser);

    logger.info(`Novo usuário registrado: ${email}`);
    
    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (error) {
    logger.error(`Erro no registro: ${error.message}`);
    next(error);
  }
});

// Login de usuário
router.post('/login', validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Buscar usuário
    const user = db.prepare(`
      SELECT id, name, email, password 
      FROM users 
      WHERE email = ?
    `).get(email.toLowerCase().trim());

    if (!user) {
      logger.warn(`Tentativa de login com email inexistente: ${email}`);
      return res.status(401).json({ 
        error: 'Credenciais inválidas',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      logger.warn(`Tentativa de login com senha incorreta para: ${email}`);
      return res.status(401).json({ 
        error: 'Credenciais inválidas',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Gerar token
    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email
    });

    logger.info(`Login realizado com sucesso: ${email}`);
    
    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    logger.error(`Erro no login: ${error.message}`);
    next(error);
  }
});

// Verificar token (rota de teste)
router.get('/verify', (req, res) => {
  res.json({ 
    message: 'Token válido',
    user: req.user 
  });
});

module.exports = router;

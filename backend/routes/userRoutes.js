const express = require('express');
const authMiddleware = require('../middlewares/auth');
const { logger } = require('../utils/logger');
const db = require('../config/database').getDatabase();
const router = express.Router();

// Dashboard do usuário
router.get('/dashboard', authMiddleware, (req, res) => {
  try {
    logger.info(`Dashboard acessado por: ${req.user.email}`);
    
    res.json({ 
      message: `Bem-vindo, ${req.user.name}`,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error(`Erro no dashboard: ${error.message}`);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      code: 'DASHBOARD_ERROR'
    });
  }
});

// Perfil do usuário
router.get('/profile', authMiddleware, (req, res) => {
  try {
    const user = db.prepare(`
      SELECT id, name, email, created_at, updated_at 
      FROM users 
      WHERE id = ?
    `).get(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    logger.info(`Perfil acessado por: ${req.user.email}`);
    
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    });
  } catch (error) {
    logger.error(`Erro ao buscar perfil: ${error.message}`);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      code: 'PROFILE_ERROR'
    });
  }
});

// Atualizar perfil
router.put('/profile', authMiddleware, (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Validações básicas
    if (!name || !email) {
      return res.status(400).json({
        error: 'Nome e email são obrigatórios',
        code: 'MISSING_FIELDS'
      });
    }

    // Verificar se email já existe (exceto para o usuário atual)
    const existingUser = db.prepare(`
      SELECT id FROM users 
      WHERE email = ? AND id != ?
    `).get(email.toLowerCase().trim(), req.user.id);
    
    if (existingUser) {
      return res.status(409).json({
        error: 'Email já está em uso',
        code: 'EMAIL_ALREADY_EXISTS'
      });
    }

    // Atualizar usuário
    const stmt = db.prepare(`
      UPDATE users 
      SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    
    const result = stmt.run(name.trim(), email.toLowerCase().trim(), req.user.id);
    
    if (result.changes === 0) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    logger.info(`Perfil atualizado por: ${req.user.email}`);
    
    res.json({
      message: 'Perfil atualizado com sucesso',
      user: {
        id: req.user.id,
        name: name.trim(),
        email: email.toLowerCase().trim()
      }
    });
  } catch (error) {
    logger.error(`Erro ao atualizar perfil: ${error.message}`);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      code: 'UPDATE_PROFILE_ERROR'
    });
  }
});

// Logout (rota para invalidar token no frontend)
router.post('/logout', authMiddleware, (req, res) => {
  try {
    logger.info(`Logout realizado por: ${req.user.email}`);
    
    res.json({
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    logger.error(`Erro no logout: ${error.message}`);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      code: 'LOGOUT_ERROR'
    });
  }
});

module.exports = router;

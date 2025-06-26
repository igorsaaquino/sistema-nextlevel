const Database = require('better-sqlite3');
const path = require('path');

class DatabaseManager {
  constructor() {
    this.db = null;
    this.init();
  }

  init() {
    const dbPath = process.env.DB_PATH || 'freela.db';
    this.db = new Database(path.resolve(dbPath));
    
    // Habilitar WAL mode para melhor performance
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('synchronous = NORMAL');
    this.db.pragma('cache_size = 10000');
    this.db.pragma('temp_store = MEMORY');
    
    this.createTables();
  }

  createTables() {
    // Tabela de usuários com índices otimizados
    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    // Índice para email (já existe UNIQUE, mas explícito para performance)
    this.db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `).run();

    // Tabela de tarefas otimizada
    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'pendente' CHECK(status IN ('pendente', 'em_andamento', 'concluida', 'cancelada')),
        priority TEXT DEFAULT 'media' CHECK(priority IN ('baixa', 'media', 'alta')),
        user_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `).run();

    // Índices para tasks
    this.db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)
    `).run();
    
    this.db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id)
    `).run();

    // Tabela de pessoas otimizada
    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS people (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT,
        type TEXT CHECK(type IN ('cliente', 'fornecedor')) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    // Índices para people
    this.db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_people_type ON people(type)
    `).run();
    
    this.db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_people_email ON people(email)
    `).run();
  }

  getDatabase() {
    return this.db;
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

module.exports = new DatabaseManager(); 
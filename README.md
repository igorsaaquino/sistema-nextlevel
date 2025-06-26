# Sistema NextLevel - Otimizado

Sistema de gestão empresarial com autenticação segura, dashboard moderno e arquitetura otimizada.

## 🚀 Melhorias Implementadas

### Segurança
- ✅ Hash de senhas com bcrypt
- ✅ JWT com configurações seguras
- ✅ Rate limiting para prevenir ataques
- ✅ Helmet para headers de segurança
- ✅ Validação de entrada de dados
- ✅ Variáveis de ambiente (.env)

### Performance
- ✅ Compressão de resposta
- ✅ Índices otimizados no banco de dados
- ✅ WAL mode para SQLite
- ✅ Cache de consultas preparadas
- ✅ Logging estruturado

### Arquitetura
- ✅ Middleware de tratamento de erros centralizado
- ✅ Sistema de logging com Winston
- ✅ Validação de dados com middlewares
- ✅ Estrutura modular e organizada
- ✅ Graceful shutdown

### Frontend
- ✅ Interface moderna e responsiva
- ✅ Validação de formulários
- ✅ Tratamento de erros melhorado
- ✅ UX otimizada com loading states
- ✅ Verificação de expiração de token

## 📋 Pré-requisitos

- Node.js 16+ 
- npm ou yarn

## 🛠️ Instalação

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd Sistema-NextLevel
```

### 2. Configurar Backend
```bash
cd backend
npm install
```

### 3. Configurar Frontend
```bash
cd frontend
npm install
```

### 4. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e configure suas variáveis:

```bash
# Backend
cd backend
cp config.env.example .env
```

Edite o arquivo `.env`:
```env
# Configurações do Servidor
PORT=3001
NODE_ENV=development

# JWT Secret (GERE UMA CHAVE FORTE EM PRODUÇÃO)
JWT_SECRET=sua_chave_secreta_muito_forte_aqui

# Configurações do Banco de Dados
DB_PATH=freela.db

# Configurações de Segurança
BCRYPT_ROUNDS=12
JWT_EXPIRES_IN=24h

# Configurações CORS
CORS_ORIGIN=http://localhost:3000
```

## 🚀 Executando o Sistema

### Desenvolvimento

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm start
```

### Produção

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
```

## 📊 Estrutura do Projeto

```
Sistema NextLevel/
├── backend/
│   ├── config/
│   │   └── database.js          # Configuração otimizada do banco
│   ├── middlewares/
│   │   ├── auth.js              # Autenticação JWT
│   │   ├── errorHandler.js      # Tratamento de erros
│   │   └── validation.js        # Validação de dados
│   ├── routes/
│   │   ├── authRoutes.js        # Rotas de autenticação
│   │   └── userRoutes.js        # Rotas de usuário
│   ├── utils/
│   │   ├── generateToken.js     # Geração de JWT
│   │   └── logger.js            # Sistema de logging
│   ├── server.js                # Servidor principal
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Login.js         # Componente de login
│   │   ├── pages/
│   │   │   └── Dashboard.js     # Dashboard principal
│   │   ├── utils/
│   │   │   └── auth.js          # Utilitários de auth
│   │   └── App.js               # App principal
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verificar token

### Usuários
- `GET /api/users/dashboard` - Dashboard do usuário
- `GET /api/users/profile` - Perfil do usuário
- `PUT /api/users/profile` - Atualizar perfil
- `POST /api/users/logout` - Logout

### Health Check
- `GET /health` - Status do servidor

## 🔒 Segurança

### Rate Limiting
- **Geral**: 100 requisições por IP a cada 15 minutos
- **Autenticação**: 5 tentativas por IP a cada 15 minutos

### Validação de Senha
- Mínimo 8 caracteres
- Pelo menos uma letra e um número
- Caracteres especiais permitidos: @$!%*?&

### JWT
- Expiração configurável
- Issuer e audience definidos
- Chave secreta via variável de ambiente

## 📝 Logs

O sistema utiliza Winston para logging estruturado:

- **Console**: Em desenvolvimento
- **Arquivos**: Em produção (`logs/error.log`, `logs/combined.log`)
- **Níveis**: error, warn, info, http, debug

## 🐛 Troubleshooting

### Erro de CORS
Verifique se a variável `CORS_ORIGIN` está configurada corretamente.

### Erro de JWT
Certifique-se de que `JWT_SECRET` está definido no arquivo `.env`.

### Erro de Banco de Dados
Verifique se o arquivo do banco tem permissões de escrita.

### Performance
- Monitore os logs para identificar gargalos
- Use o health check para verificar o status
- Verifique o uso de memória e CPU

## 🔄 Migração de Dados

Para migrar dados do sistema anterior:

1. Faça backup do banco atual
2. Execute o novo sistema
3. As tabelas serão criadas automaticamente
4. Reimporte os dados se necessário

## 📈 Monitoramento

### Métricas Disponíveis
- Uptime do servidor
- Número de requisições
- Erros de autenticação
- Performance de queries

### Logs Importantes
- Tentativas de login falhadas
- Erros de validação
- Acessos ao dashboard
- Operações de CRUD

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.

## 🆘 Suporte

Para suporte técnico, entre em contato com a equipe de desenvolvimento. 
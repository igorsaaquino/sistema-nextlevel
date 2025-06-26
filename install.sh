#!/bin/bash

echo "🚀 Instalando Sistema NextLevel - Versão Otimizada"
echo "=================================================="

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js 16+ primeiro."
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Por favor, instale o npm primeiro."
    exit 1
fi

echo "✅ npm encontrado: $(npm --version)"

# Instalar dependências do backend
echo ""
echo "📦 Instalando dependências do Backend..."
cd backend
npm install

if [ $? -eq 0 ]; then
    echo "✅ Backend instalado com sucesso!"
else
    echo "❌ Erro ao instalar dependências do backend"
    exit 1
fi

# Configurar arquivo .env
if [ ! -f .env ]; then
    echo ""
    echo "⚙️  Configurando variáveis de ambiente..."
    cp config.env.example .env
    echo "✅ Arquivo .env criado. Edite-o conforme necessário."
else
    echo "✅ Arquivo .env já existe."
fi

cd ..

# Instalar dependências do frontend
echo ""
echo "📦 Instalando dependências do Frontend..."
cd frontend
npm install

if [ $? -eq 0 ]; then
    echo "✅ Frontend instalado com sucesso!"
else
    echo "❌ Erro ao instalar dependências do frontend"
    exit 1
fi

cd ..

echo ""
echo "🎉 Instalação concluída com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Edite o arquivo backend/.env com suas configurações"
echo "2. Execute 'cd backend && npm run dev' para iniciar o servidor"
echo "3. Execute 'cd frontend && npm start' para iniciar o frontend"
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo "   Health:   http://localhost:3001/health"
echo ""
echo "📚 Consulte o README.md para mais informações." 
// Funções de autenticação otimizadas
const TOKEN_KEY = 'nextlevel_token';
const USER_KEY = 'nextlevel_user';

export function salvarToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('Erro ao salvar token:', error);
    return false;
  }
}

export function obterToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Erro ao obter token:', error);
    return null;
  }
}

export function removerToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return true;
  } catch (error) {
    console.error('Erro ao remover token:', error);
    return false;
  }
}

export function estaAutenticado() {
  const token = obterToken();
  if (!token) return false;
  
  try {
    // Verificar se o token não expirou (decodificação básica)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    return payload.exp > currentTime;
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    removerToken(); // Remover token inválido
    return false;
  }
}

export function salvarUsuario(usuario) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(usuario));
    return true;
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
    return false;
  }
}

export function obterUsuario() {
  try {
    const usuario = localStorage.getItem(USER_KEY);
    return usuario ? JSON.parse(usuario) : null;
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    return null;
  }
}

export function obterHeaders() {
  const token = obterToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

export function logout() {
  removerToken();
  window.location.href = '/';
}
  
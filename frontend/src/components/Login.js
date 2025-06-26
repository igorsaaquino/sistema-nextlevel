import React, { useState } from 'react';
import { salvarToken, salvarUsuario, obterHeaders } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Limpar erro quando usuário começa a digitar
    if (erro) setErro('');
  };

  const validateForm = () => {
    if (!form.email.trim()) {
      setErro('Email é obrigatório');
      return false;
    }
    if (!form.password.trim()) {
      setErro('Senha é obrigatória');
      return false;
    }
    if (!form.email.includes('@')) {
      setErro('Email inválido');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: obterHeaders(),
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro no login');
      }

      // Salvar token e dados do usuário
      if (salvarToken(data.token) && salvarUsuario(data.user)) {
        navigate('/dashboard');
      } else {
        throw new Error('Erro ao salvar dados de autenticação');
      }
    } catch (err) {
      setErro(err.message);
      console.error('Erro no login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: 20, 
      maxWidth: 400, 
      margin: '50px auto',
      backgroundColor: '#f8f9fa',
      borderRadius: 8,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: 30 }}>
        Login - Sistema NextLevel
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
            E-mail:
          </label>
          <input 
            name="email" 
            type="email" 
            value={form.email} 
            onChange={handleChange}
            style={{
              width: '100%',
              padding: 10,
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: 16
            }}
            placeholder="Digite seu email"
            disabled={loading}
          />
        </div>
        
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
            Senha:
          </label>
          <input 
            name="password" 
            type="password" 
            value={form.password} 
            onChange={handleChange}
            style={{
              width: '100%',
              padding: 10,
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: 16
            }}
            placeholder="Digite sua senha"
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{
            width: '100%',
            padding: 12,
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            fontSize: 16,
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: 15
          }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      
      {erro && (
        <div style={{ 
          color: '#dc3545', 
          backgroundColor: '#f8d7da',
          padding: 10,
          borderRadius: 4,
          border: '1px solid #f5c6cb',
          marginTop: 10
        }}>
          {erro}
        </div>
      )}
      
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <small style={{ color: '#666' }}>
          Não tem uma conta? Entre em contato com o administrador.
        </small>
      </div>
    </div>
  );
}

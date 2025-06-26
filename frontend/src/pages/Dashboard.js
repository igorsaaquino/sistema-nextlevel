import React, { useState, useEffect } from 'react';
import { obterUsuario, obterHeaders, logout } from '../utils/auth';

export default function Dashboard() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = obterUsuario();
    if (user) {
      setUsuario(user);
    }
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    try {
      // Chamar API de logout
      await fetch('/api/users/logout', {
        method: 'POST',
        headers: obterHeaders(),
      });
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      logout();
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Carregando...</div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div>Usuário não encontrado</div>
        <button onClick={logout} style={{ marginTop: 10 }}>
          Voltar ao Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#fff',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#333' }}>
            Sistema NextLevel
          </h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>
            Bem-vindo, {usuario.name}!
          </p>
        </div>
        <button 
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 14
          }}
        >
          Sair
        </button>
      </header>

      {/* Main Content */}
      <main style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: 8,
          padding: 30,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginTop: 0, color: '#333' }}>
            Dashboard
          </h2>
          
          <div style={{ marginBottom: 30 }}>
            <h3>Informações do Usuário</h3>
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: 20, 
              borderRadius: 4,
              border: '1px solid #e9ecef'
            }}>
              <p><strong>Nome:</strong> {usuario.name}</p>
              <p><strong>Email:</strong> {usuario.email}</p>
              <p><strong>ID:</strong> {usuario.id}</p>
            </div>
          </div>

          <div style={{ marginBottom: 30 }}>
            <h3>Funcionalidades</h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 20
            }}>
              <div style={{
                backgroundColor: '#e3f2fd',
                padding: 20,
                borderRadius: 4,
                border: '1px solid #bbdefb'
              }}>
                <h4 style={{ marginTop: 0, color: '#1976d2' }}>Gestão de Tarefas</h4>
                <p>Gerencie suas tarefas e projetos</p>
                <button style={{
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 4,
                  cursor: 'pointer'
                }}>
                  Acessar
                </button>
              </div>

              <div style={{
                backgroundColor: '#f3e5f5',
                padding: 20,
                borderRadius: 4,
                border: '1px solid #e1bee7'
              }}>
                <h4 style={{ marginTop: 0, color: '#7b1fa2' }}>Gestão de Pessoas</h4>
                <p>Gerencie clientes e fornecedores</p>
                <button style={{
                  backgroundColor: '#7b1fa2',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 4,
                  cursor: 'pointer'
                }}>
                  Acessar
                </button>
              </div>

              <div style={{
                backgroundColor: '#e8f5e8',
                padding: 20,
                borderRadius: 4,
                border: '1px solid #c8e6c9'
              }}>
                <h4 style={{ marginTop: 0, color: '#388e3c' }}>Relatórios</h4>
                <p>Visualize relatórios e estatísticas</p>
                <button style={{
                  backgroundColor: '#388e3c',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 4,
                  cursor: 'pointer'
                }}>
                  Acessar
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div style={{ 
              color: '#dc3545', 
              backgroundColor: '#f8d7da',
              padding: 10,
              borderRadius: 4,
              border: '1px solid #f5c6cb',
              marginTop: 20
            }}>
              {error}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

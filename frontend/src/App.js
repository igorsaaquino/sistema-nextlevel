// App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import { estaAutenticado } from './utils/auth';

function RotaPrivada({ children }) {
  return estaAutenticado() ? children : <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={
          <RotaPrivada>
            <Dashboard />
          </RotaPrivada>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

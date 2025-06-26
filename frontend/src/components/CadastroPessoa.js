import React, { useState } from 'react';

export default function CadastroPessoa({ onPessoaAdicionada }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    type: 'cliente'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Nome é obrigatório!');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const pessoa = await res.json();
      onPessoaAdicionada(pessoa);
      setForm({ name: '', email: '', type: 'cliente' });
    } catch (err) {
      console.error('Erro ao cadastrar:', err);
      alert('Erro ao cadastrar pessoa');
    }
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <h2>Cadastrar Pessoa</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label><br />
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nome completo"
          />
        </div>
        <div>
          <label>Email:</label><br />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="E-mail"
            type="email"
          />
        </div>
        <div>
          <label>Tipo:</label><br />
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="cliente">Cliente</option>
            <option value="fornecedor">Fornecedor</option>
          </select>
        </div>
        <button type="submit" style={{ marginTop: 10 }}>Cadastrar</button>
      </form>
    </div>
  );
}

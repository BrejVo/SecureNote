import React, { useState } from 'react';
import './App.css';

export default function Register({ onRegisterSuccess }) {
  // stany na rejestracje i logowanie
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // wysylanie danych do backendu do rejestracji
    fetch('http://localhost:5284/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then(res => {
        if (!res.ok) return res.text().then(text => { throw new Error(text); });
        return res.text();
      })
      .then(msg => {
        setMessage(msg);
        setError('');
        setUsername('');
        setPassword('');
        onRegisterSuccess();
      })
      .catch(err => setError(err.message));
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Rejestracja</h2>
      {error && <p className="form-error">{error}</p>}
      {message && <p className="form-success">{message}</p>}
      <div className="form-group">
        <label>Nazwa użytkownika:</label>
        <input value={username} onChange={e => setUsername(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Hasło:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      
      <button type="submit">Zarejestruj się</button>
    </form>
  );
}

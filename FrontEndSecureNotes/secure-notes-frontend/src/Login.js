import React, { useState } from 'react';
import './App.css';

export default function Login({ onLoginSuccess }) {
  // stany formularza logowania 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5284/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Błędna nazwa użytkownika lub hasło');
        return res.json();
      })
      .then(data => {
        localStorage.setItem('token', data.token); // zapisujemy token
        onLoginSuccess();
      })
      .catch(err => setError(err.message));
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Logowanie</h2>
      {error && <p className="form-error">{error}</p>}
      <div className="form-group">
        <label htmlFor="username">Nazwa użytkownika:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Hasło:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Zaloguj się</button>
    </form>
  );
}

import React, { useState } from 'react';


// komponent do dodawania nowej notatki
export default function AddNote({ onAddNote }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // wysylanie formularza, sprawdza czy pola sa uzupelnione
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Uzupełnij tytuł i treść notatki!');
      return;
    }

    const newNote = { title, content };
    onAddNote(newNote); // przekazujemy do App.js
    setTitle('');
    setContent(''); //czyści formularz
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h2>Dodaj nową notatkę</h2>
      <div>
        <label>
          Tytuł:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Treść:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </label>
      </div>
      <button type="submit">Dodaj notatkę</button>
    </form>
  );
}

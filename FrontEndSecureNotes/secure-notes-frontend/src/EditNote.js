import React, { useState } from 'react';

// komponent do edycji istniejacych notatek
export default function EditNote({ note, onSave, onCancel }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  // zapisywanie zmian
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Proszę uzupełnić tytuł i treść');
      return;
    }
    onSave({ ...note, title, content });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edytuj notatkę</h2>
      <div>
        <label>Tytuł:</label><br />
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div>
        <label>Treść:</label><br />
        <textarea value={content} onChange={e => setContent(e.target.value)} rows={4} />
      </div>
      <button type="submit">Zapisz</button>
      <button type="button" onClick={onCancel} style={{ marginLeft: '10px' }}>Anuluj</button>
    </form>
  );
}

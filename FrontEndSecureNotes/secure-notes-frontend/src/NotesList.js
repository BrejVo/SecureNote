import React from 'react';

// do wyswietlanai listy notatek
export default function NotesList({ notes, onDeleteNote, onEditClick }) {
  if (!notes) return <div>Brak notatek do wyświetlenia.</div>;

  return (
    <div>
      <h2>Twoje notatki</h2>
      {notes.length === 0 ? (
        <p>Brak notatek do wyświetlenia.</p>
      ) : (
        <ul>
          {notes.map(note => (
            <li key={note.id}>
              <strong>{note.title}</strong>: {note.content}
              <button
                onClick={() => onDeleteNote(note.id)}
                style={{ marginLeft: '10px' }}
              >
                 Usuń
              </button>
              <button
                onClick={() => onEditClick(note)}
                style={{ marginLeft: '10px' }}
              >
                 Edytuj
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

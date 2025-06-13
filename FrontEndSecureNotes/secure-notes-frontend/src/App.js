import React, { useState, useEffect } from 'react';
import NotesList from './NotesList';
import AddNote from './AddNote';
import EditNote from './EditNote';
import Login from './Login';
import Register from './Register';
import './App.css';

function App() {
  // lista notatek, token i formularze
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [showRegister, setShowRegister] = useState(false);

  // pobieranie notek z backendu
  const fetchNotes = () => {
    if (!token) return;
    setLoading(true);
    fetch('http://localhost:5284/api/notes', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (res.status === 401) {
          logout();
          return [];
        }
        return res.json();
      })
      .then(data => {
        setNotes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Błąd pobierania notatek:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNotes();
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setNotes([]);
    setEditingNote(null);
  };

  // dodawanie nowej notatki
  const addNote = (note) => {
    fetch('http://localhost:5284/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(note),
    })
      .then(res => {
        if (!res.ok) throw new Error('Błąd podczas dodawania notatki');
        return res.json();
      })
      .then(() => {
        fetchNotes();
      })
      .catch(err => {
        console.error(err);
        alert('Nie udało się dodać notatki');
      });
  };

  // usuwanie notatek
  const handleDeleteNote = async (id) => {
    try {
      const response = await fetch(`http://localhost:5284/api/notes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        fetchNotes();
      } else {
        console.error('Błąd usuwania notatki');
      }
    } catch (error) {
      console.error('Błąd żądania DELETE:', error);
    }
  };

  // edytownaie
  const handleEditClick = (note) => {
    setEditingNote(note);
  };

  const updateNote = (updatedNote) => {
    fetch(`http://localhost:5284/api/notes/${updatedNote.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedNote),
    })
      .then(res => {
        if (!res.ok) throw new Error('Błąd podczas aktualizacji notatki');
        setEditingNote(null);
        fetchNotes();
      })
      .catch(err => {
        console.error(err);
        alert('Nie udało się zaktualizować notatki');
      });
  };

  const cancelEdit = () => {
    setEditingNote(null);
  };

  // pokazujemy logowanie jezeli nie jst zalogowany user
  if (!token) {
    return (
      <div className="auth-container">
        {showRegister ? (
          <>
            <Register onRegisterSuccess={() => setShowRegister(false)} />
            <p>
              Masz konto?{' '}
              <button className="link-button" onClick={() => setShowRegister(false)}>Zaloguj się</button>
            </p>
          </>
        ) : (
          <>
            <Login onLoginSuccess={() => setToken(localStorage.getItem('token'))} />
            <p>
              Nie masz konta?{' '}
              <button className="link-button" onClick={() => setShowRegister(true)}>Zarejestruj się</button>
            </p>
          </>
        )}
      </div>
    );
  }

  // widok po zalogowaniu
  return (
    <div className="App">
      <header className="App-header">
        <h1>📝 Secure Notes</h1>
        <button className="logout-button" onClick={logout}>Wyloguj się</button>
      </header>
      <main className="App-main">
        <AddNote onAddNote={addNote} />
        {loading ? (
          <div>Ładowanie notatek...</div>
        ) : (
          <>
            <NotesList
              notes={notes}
              onDeleteNote={handleDeleteNote}
              onEditClick={handleEditClick}
            />
            {editingNote && (
              <EditNote
                note={editingNote}
                onSave={updateNote}
                onCancel={cancelEdit}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;

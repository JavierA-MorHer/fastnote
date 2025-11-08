import './App.css';
import { Editor } from './components/Editor';
import Header from './components/Header/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import { useState, useEffect } from 'react';
import type { Note } from './utils/notesStorage';
import { getAllNotes, createNewNote, getNoteById, saveNote, togglePinNote, deleteNote } from './utils/notesStorage';

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);

  // Cargar notas al iniciar
  useEffect(() => {
    const loadedNotes = getAllNotes();
    setNotes(loadedNotes);
    
    // Si hay notas, cargar la más reciente
    if (loadedNotes.length > 0) {
      setCurrentNoteId(loadedNotes[0].id);
      setCurrentNote(loadedNotes[0]);
    } else {
      // Si no hay notas, crear una nueva y guardarla
      const newNote = createNewNote();
      saveNote(newNote);
      setCurrentNoteId(newNote.id);
      setCurrentNote(newNote);
      setNotes([newNote]);
    }
  }, []);

  // Actualizar la nota actual cuando cambia el ID
  useEffect(() => {
    if (currentNoteId) {
      const note = getNoteById(currentNoteId);
      if (note) {
        setCurrentNote(note);
      }
    }
  }, [currentNoteId]);

  // Recargar lista de notas cuando cambia
  useEffect(() => {
    setNotes(getAllNotes());
  }, [currentNoteId]);

  const handleCreateNewNote = () => {
    const newNote = createNewNote();
    // Guardar la nueva nota en localStorage
    saveNote(newNote);
    setCurrentNoteId(newNote.id);
    setCurrentNote(newNote);
    setNotes(getAllNotes());
  };

  const handleSelectNote = (noteId: string) => {
    setCurrentNoteId(noteId);
  };

  const handleNoteUpdate = () => {
    // Recargar la lista de notas después de una actualización
    setNotes(getAllNotes());
    if (currentNoteId) {
      const updatedNote = getNoteById(currentNoteId);
      if (updatedNote) {
        setCurrentNote(updatedNote);
      }
    }
  };

  const handleTogglePin = (noteId: string) => {
    togglePinNote(noteId);
    setNotes(getAllNotes());
    if (currentNoteId === noteId) {
      const updatedNote = getNoteById(noteId);
      if (updatedNote) {
        setCurrentNote(updatedNote);
      }
    }
  };

  const handleDeleteNote = (noteId: string) => {
    const note = getNoteById(noteId);
    if (!note) return;

    const confirmMessage = `¿Estás seguro de que quieres eliminar la nota "${note.title}"?\n\nEsta acción no se puede deshacer.`;
    
    if (window.confirm(confirmMessage)) {
      deleteNote(noteId);
      const updatedNotes = getAllNotes();
      setNotes(updatedNotes);

      // Si se eliminó la nota actual, cambiar a otra nota o crear una nueva
      if (currentNoteId === noteId) {
        if (updatedNotes.length > 0) {
          setCurrentNoteId(updatedNotes[0].id);
          setCurrentNote(updatedNotes[0]);
        } else {
          // Si no hay más notas, crear una nueva
          const newNote = createNewNote();
          saveNote(newNote);
          setCurrentNoteId(newNote.id);
          setCurrentNote(newNote);
          setNotes([newNote]);
        }
      }
    }
  };

  return (
    <div className='app-content-master'>
      <Sidebar 
        notes={notes}
        currentNoteId={currentNoteId}
        onSelectNote={handleSelectNote}
        onCreateNewNote={handleCreateNewNote}
        onTogglePin={handleTogglePin}
        onDeleteNote={handleDeleteNote}
      />
      <div className='main-content'>
        <Header/>
        <div className='editor-container'>
          {currentNote && (
            <Editor
              note={currentNote}
              onNoteUpdate={handleNoteUpdate}
              onCreateNewNote={handleCreateNewNote}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default App

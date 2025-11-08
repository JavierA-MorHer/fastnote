export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  pinned?: boolean;
}

const STORAGE_KEY = 'fast-note-notes';

/**
 * Obtiene todas las notas desde localStorage
 */
export const getAllNotes = (): Note[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error al cargar notas:', error);
    return [];
  }
};

/**
 * Guarda todas las notas en localStorage
 */
export const saveAllNotes = (notes: Note[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Error al guardar notas:', error);
  }
};

/**
 * Obtiene una nota por su ID
 */
export const getNoteById = (id: string): Note | null => {
  const notes = getAllNotes();
  return notes.find(note => note.id === id) || null;
};

/**
 * Guarda o actualiza una nota
 */
export const saveNote = (note: Note): void => {
  const notes = getAllNotes();
  const existingIndex = notes.findIndex(n => n.id === note.id);
  
  if (existingIndex >= 0) {
    notes[existingIndex] = { ...note, updatedAt: Date.now() };
  } else {
    notes.push({ ...note, updatedAt: Date.now() });
  }
  
  // Ordenar: primero las pineadas (por fecha de actualización), luego las no pineadas (por fecha de actualización)
  notes.sort((a, b) => {
    const aPinned = a.pinned ?? false;
    const bPinned = b.pinned ?? false;
    
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    
    // Si ambas tienen el mismo estado de pin, ordenar por fecha
    return b.updatedAt - a.updatedAt;
  });
  
  saveAllNotes(notes);
};

/**
 * Elimina una nota por su ID
 */
export const deleteNote = (id: string): void => {
  const notes = getAllNotes();
  const filtered = notes.filter(note => note.id !== id);
  saveAllNotes(filtered);
};

/**
 * Crea una nueva nota vacía
 */
export const createNewNote = (): Note => {
  const now = Date.now();
  return {
    id: `note-${now}-${Math.random().toString(36).substr(2, 9)}`,
    title: 'Sin título',
    content: '',
    createdAt: now,
    updatedAt: now,
    pinned: false,
  };
};

/**
 * Extrae el título de una nota desde su contenido markdown
 */
export const extractTitleFromContent = (content: string): string => {
  if (!content.trim()) return 'Sin título';
  
  // Buscar el primer encabezado (# título)
  const headingMatch = content.match(/^#+\s+(.+)$/m);
  if (headingMatch) {
    return headingMatch[1].trim();
  }
  
  // Si no hay encabezado, tomar la primera línea
  const firstLine = content.split('\n')[0].trim();
  if (firstLine) {
    // Limitar a 50 caracteres
    return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine;
  }
  
  return 'Sin título';
};

/**
 * Actualiza el contenido de una nota y extrae el título automáticamente
 */
export const updateNoteContent = (id: string, content: string): Note | null => {
  const note = getNoteById(id);
  if (!note) return null;
  
  const title = extractTitleFromContent(content);
  const updatedNote: Note = {
    ...note,
    content,
    title,
    updatedAt: Date.now(),
  };
  
  saveNote(updatedNote);
  return updatedNote;
};

/**
 * Cambia el estado de pin de una nota
 */
export const togglePinNote = (id: string): Note | null => {
  const note = getNoteById(id);
  if (!note) return null;
  
  const updatedNote: Note = {
    ...note,
    pinned: !(note.pinned ?? false),
    updatedAt: Date.now(),
  };
  
  saveNote(updatedNote);
  return updatedNote;
};

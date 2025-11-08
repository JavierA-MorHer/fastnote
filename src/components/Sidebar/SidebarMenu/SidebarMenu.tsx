import styles from './SidebarMenu.module.css'
import { SidebarMenuItem } from './SidebarMenuItem'
import type { Note } from '../../../utils/notesStorage'
import { Pin, Trash2 } from 'lucide-react'

interface SidebarMenuProps {
  notes: Note[];
  currentNoteId: string | null;
  onSelectNote: (noteId: string) => void;
  onCreateNewNote: () => void;
  onTogglePin: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
  formatDate: (timestamp: number) => string;
}

export const SidebarMenu = ({ notes, currentNoteId, onSelectNote, onCreateNewNote, onTogglePin, onDeleteNote, formatDate }: SidebarMenuProps) => {
  const handlePinClick = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation(); // Evitar que se active la selección de la nota
    onTogglePin(noteId);
  };

  const handleDeleteClick = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation(); // Evitar que se active la selección de la nota
    onDeleteNote(noteId);
  };

  return (
    <div className={styles.menuContent}>
      <ul className={styles.menuList}>
        <SidebarMenuItem 
          label="Nueva Nota" 
          onClick={onCreateNewNote}
          isButton={true}
        />
      </ul>
      {notes.length > 0 && (
        <div className={styles.notesList}>
          <div className={styles.notesHeader}>Notas</div>
          <ul className={styles.notesListItems}>
            {notes.map((note) => (
              <li
                key={note.id}
                className={`${styles.noteItem} ${currentNoteId === note.id ? styles.active : ''} ${note.pinned ? styles.pinned : ''}`}
                onClick={() => onSelectNote(note.id)}
              >
                <div className={styles.noteContent}>
                  <div className={styles.noteTitleRow}>
                    <div className={styles.noteTitle}>{note.title}</div>
                    <div className={styles.noteActions}>
                      <button
                        className={styles.pinButton}
                        onClick={(e) => handlePinClick(e, note.id)}
                        title={note.pinned ? "Despinear nota" : "Pinear nota"}
                      >
                        <Pin 
                          size={14} 
                          className={note.pinned ? styles.pinnedIcon : styles.unpinnedIcon}
                          fill={note.pinned ? 'currentColor' : 'none'}
                        />
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={(e) => handleDeleteClick(e, note.id)}
                        title="Eliminar nota"
                      >
                        <Trash2 size={14} className={styles.deleteIcon} />
                      </button>
                    </div>
                  </div>
                  <div className={styles.noteDate}>{formatDate(note.updatedAt)}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

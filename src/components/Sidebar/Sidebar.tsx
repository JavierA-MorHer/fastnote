import { Menu, X } from "lucide-react"
import styles from './Sidebar.module.css'
import { useState, useRef, useEffect } from "react"
import { SidebarMenu } from './SidebarMenu'
import type { Note } from '../../utils/notesStorage'

interface SidebarProps {
  notes: Note[];
  currentNoteId: string | null;
  onSelectNote: (noteId: string) => void;
  onCreateNewNote: () => void;
  onTogglePin: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
}

export const Sidebar = ({ notes, currentNoteId, onSelectNote, onCreateNewNote, onTogglePin, onDeleteNote }: SidebarProps) => {

  const [isExpanded, setIsExpanded] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Hoy';
    } else if (diffDays === 1) {
      return 'Ayer';
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else {
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    }
  };

  return (
    <div className={styles.sidebarMenu} ref={sidebarRef}>
      <button
        className={styles.btnMenu}
        onClick={() => setIsExpanded(!isExpanded)}
      >
      {isExpanded ? <X /> : <Menu />}
      </button>

      {isExpanded && (
        <SidebarMenu 
          notes={notes}
          currentNoteId={currentNoteId}
          onSelectNote={onSelectNote}
          onCreateNewNote={onCreateNewNote}
          onTogglePin={onTogglePin}
          onDeleteNote={onDeleteNote}
          formatDate={formatDate}
        />
      )}
    </div>
  )
}
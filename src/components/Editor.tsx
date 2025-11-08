import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './Editor.module.css';
import { Toolbar } from './Editor/Toolbar/Toolbar';
import type { Note } from '../utils/notesStorage';
import { updateNoteContent } from '../utils/notesStorage';

const placeholder = `# ¡Bienvenido a tu bloc de notas!
## Comienza a escribir en formato Markdown

Aquí hay un ejemplo de una tabla:

| Cabecera 1 | Cabecera 2 |
|------------|------------|
| Celda 1    | Celda 2    |
| Celda 3    | Celda 4    |

Y aquí hay un bloque de código:

\`\`\`javascript
function greet() {
  console.log("¡Hola, mundo!");
}
\`\`\`

- También puedes crear listas.
- Como esta.
`;

interface EditorProps {
  note: Note;
  onNoteUpdate: () => void;
  onCreateNewNote: () => void;
}

export const Editor = ({ note, onNoteUpdate, onCreateNewNote }: EditorProps) => {
  const [markdown, setMarkdown] = useState<string>(note.content);
  const [showMarkdown, setShowMarkdown] = useState<boolean>(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cursorPositionRef = useRef<{ start: number; end: number }>({ start: 0, end: 0 });
  const saveTimeoutRef = useRef<number | null>(null);

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
        const isMod = isMac ? e.metaKey : e.ctrlKey;
        if (isMod && e.key === 'p') {
            e.preventDefault();
            setShowMarkdown(prev => !prev);
        }
        if (isMod && e.key === 'n') {
            e.preventDefault();
            onCreateNewNote();
        }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
        window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [isMac, onCreateNewNote]);

  // Cargar el contenido de la nota cuando cambia
  useEffect(() => {
    setMarkdown(note.content);
    cursorPositionRef.current = { start: 0, end: 0 };
  }, [note.id]);

  // Guardar automáticamente con debounce
  useEffect(() => {
    // Limpiar el timeout anterior si existe
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Solo guardar si el contenido ha cambiado respecto a la nota original
    if (markdown !== note.content) {
      // Guardar después de 500ms de inactividad
      saveTimeoutRef.current = setTimeout(() => {
        updateNoteContent(note.id, markdown);
        onNoteUpdate();
      }, 500);
    }

    // Limpiar el timeout al desmontar o cuando cambie el contenido
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [markdown, note.id, note.content, onNoteUpdate]);

  useEffect(() => {
    if (showMarkdown && textareaRef.current) {
      // Usar setTimeout para asegurar que el DOM se haya actualizado
      setTimeout(() => {
        const textarea = textareaRef.current;
        if (textarea) {
          textarea.focus();
          // Restaurar la posición del cursor donde el usuario lo dejó
          const { start, end } = cursorPositionRef.current;
          textarea.setSelectionRange(start, end);
        }
      }, 0);
    } else if (!showMarkdown && textareaRef.current) {
      // Guardar la posición del cursor antes de ocultar el editor
      const textarea = textareaRef.current;
      cursorPositionRef.current = {
        start: textarea.selectionStart,
        end: textarea.selectionEnd,
      };
    }
  }, [showMarkdown]);

  const textareaClassName = styles.textarea;

  const applyFormat = (before: string, after: string = '', placeholderText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    const textToInsert = selectedText || placeholderText;

    const newText =
      markdown.substring(0, start) +
      before + textToInsert + after +
      markdown.substring(end);

    setMarkdown(newText);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos + textToInsert.length);
    }, 0);
  };
  
  const applyLineFormat = (before: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    let lineStart = start;
    while (lineStart > 0 && markdown[lineStart - 1] !== '\n') {
      lineStart--;
    }

    const newText = markdown.substring(0, lineStart) + before + markdown.substring(lineStart);
    setMarkdown(newText);

    setTimeout(() => {
        textarea.focus();
        const newPos = start + before.length;
        textarea.setSelectionRange(newPos, end + before.length);
    }, 0);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMod = isMac ? e.metaKey : e.ctrlKey;
    if (isMod) {
        switch (e.key) {
            case '1': e.preventDefault(); applyLineFormat('# '); break;
            case '2': e.preventDefault(); applyLineFormat('## '); break;
            case '3': e.preventDefault(); applyLineFormat('### '); break;
            case 'b': e.preventDefault(); applyFormat('**', '**', 'negrita'); break;
            case 'i': e.preventDefault(); applyFormat('*', '*', 'cursiva'); break;
            case 'l': e.preventDefault(); applyLineFormat('- '); break;
        }
    }
  };

  return (
    <>
      <Toolbar
        applyFormat={applyFormat}
        applyLineFormat={applyLineFormat}
        showMarkdown={showMarkdown}
        setShowMarkdown={setShowMarkdown}
        modKey={modKey}
        onCreateNewNote={onCreateNewNote}
      />
      <div className={styles.editorContainer}>
        {showMarkdown ? (
          <textarea
            ref={textareaRef}
            className={textareaClassName}
            value={markdown}
            placeholder={placeholder}
            onChange={(e) => setMarkdown(e.target.value)}
            onKeyDown={handleKeyDown}
            onSelect={(e) => {
              // Guardar la posición del cursor mientras el usuario edita
              const target = e.target as HTMLTextAreaElement;
              cursorPositionRef.current = {
                start: target.selectionStart,
                end: target.selectionEnd,
              };
            }}
            aria-label="Editor de Markdown"
          />
        ) : (
          <div className={styles.preview}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdown}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </>
  );
};

import React from 'react';
import {
  Eye, EyeOff, Heading1, Heading2, Heading3, Bold, Italic, List, Code, Table, FilePlus
} from 'lucide-react';
import { ToolbarItem } from './ToolbarItem';
import styles from './Toolbar.module.css';

interface ToolbarProps {
  applyFormat: (before: string, after?: string, placeholder?: string) => void;
  applyLineFormat: (before: string) => void;
  showMarkdown: boolean;
  setShowMarkdown: (value: boolean | ((prev: boolean) => boolean)) => void;
  modKey: string;
  onCreateNewNote: () => void;
}

export const Toolbar = ({
  applyFormat,
  applyLineFormat,
  showMarkdown,
  setShowMarkdown,
  modKey,
  onCreateNewNote,
}: ToolbarProps) => {
  return (
    <div className={styles.toolbar}>
      <div className={styles.formatButtons}>
        <ToolbarItem onClick={onCreateNewNote} title="Nueva Nota" hotkey={`${modKey}+N`}>
          <FilePlus size={18} />
        </ToolbarItem>
        <div className={styles.separator} />
        <ToolbarItem onClick={() => applyLineFormat('# ')} title="Encabezado 1" hotkey={`${modKey}+1`}>
          <Heading1 size={18} />
        </ToolbarItem>
        <ToolbarItem onClick={() => applyLineFormat('## ')} title="Encabezado 2" hotkey={`${modKey}+2`}>
          <Heading2 size={18} />
        </ToolbarItem>
        <ToolbarItem onClick={() => applyLineFormat('### ')} title="Encabezado 3" hotkey={`${modKey}+3`}>
          <Heading3 size={18} />
        </ToolbarItem>
        <div className={styles.separator} />
        <ToolbarItem onClick={() => applyFormat('**', '**', 'negrita')} title="Negrita" hotkey={`${modKey}+B`}>
          <Bold size={18} />
        </ToolbarItem>
        <ToolbarItem onClick={() => applyFormat('*', '*', 'cursiva')} title="Cursiva" hotkey={`${modKey}+I`}>
          <Italic size={18} />
        </ToolbarItem>
        <div className={styles.separator} />
        <ToolbarItem onClick={() => applyLineFormat('- ')} title="Lista" hotkey={`${modKey}+L`}>
          <List size={18} />
        </ToolbarItem>
        <ToolbarItem onClick={() => applyFormat('```\n', '\n```', 'código')} title="Bloque de código">
          <Code size={18} />
        </ToolbarItem>
        <ToolbarItem onClick={() => applyFormat('| Col 1 | Col 2 |\n|---|---|\n|', ' |', ' Celda ')} title="Tabla">
          <Table size={18} />
        </ToolbarItem>
      </div>
      <ToolbarItem onClick={() => setShowMarkdown(p => !p)} title={showMarkdown ? "Mostrar vista previa" : "Mostrar markdown"} hotkey={`${modKey}+P`}>
        {showMarkdown ? <Eye size={18} /> : <EyeOff size={18} />}
      </ToolbarItem>
    </div>
  );
};

import React from 'react';
import styles from './ToolbarItem.module.css';

interface ToolbarItemProps {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  hotkey?: string;
}

export const ToolbarItem = ({ onClick, title, children, hotkey }: ToolbarItemProps) => {
  return (
    <div className={styles.toolItem}>
      <button className={styles.formatButton} onClick={onClick} title={title}>
        {children}
      </button>
      {hotkey && <span className={styles.hotkeyHint}>{hotkey}</span>}
    </div>
  );
};

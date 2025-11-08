import styles from './SidebarMenuItem.module.css'

interface SidebarMenuItemProps {
  label: string
  onClick?: () => void
  isButton?: boolean
}

export const SidebarMenuItem = ({ label, onClick, isButton }: SidebarMenuItemProps) => {
  return (
    <li className={`${styles.menuItem} ${isButton ? styles.button : ''}`} onClick={onClick}>
      {label}
    </li>
  )
}

export interface NavItem {
  id: string;
  label: string;
  icon?: string;
  value?: any;
  type?: 'link' | 'button' | 'search' | 'badge' | 'divider' | 'submenu';
  children?: NavItem[];
  align?: 'left' | 'right';
  action?: string;
  props?: any;
  count?: number;
  hidden?: boolean;
}

export interface NavBarProps {
  items: NavItem[];
  type?: 'top' | 'side';
  logo?: {
    icon?: string;
    text?: string;
    hidden?: boolean;
  };
}

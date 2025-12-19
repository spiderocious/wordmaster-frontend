import { ReactNode } from 'react';

export interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function SidebarItem({ icon, label, isActive = false, onClick }: SidebarItemProps) {
  const baseStyles = 'flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer';
  const activeStyles = isActive
    ? 'bg-primary/10 text-primary'
    : 'text-gray-700 hover:bg-gray-100';

  return (
    <div className={`${baseStyles} ${activeStyles}`} onClick={onClick}>
      <div className="text-2xl">{icon}</div>
      <span className="font-semibold text-base">{label}</span>
    </div>
  );
}

export interface SidebarProps {
  items: SidebarItemProps[];
}

export function Sidebar({ items }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 min-h-screen">
      <div className="space-y-2">
        {items.map((item, index) => (
          <SidebarItem key={index} {...item} />
        ))}
      </div>
    </aside>
  );
}

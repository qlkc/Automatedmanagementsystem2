import React from 'react';
import { 
  LayoutDashboard,
  Shield,
  Package, 
  Tag,
  ArrowRightLeft,
  ClipboardList,
  FileText,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
  userRole: 'Admin' | 'Staff';
}

const adminMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'inventory', label: 'Products / Inventory', icon: Package },
  { id: 'tagging', label: 'Tagging', icon: Tag },
  { id: 'borrowing', label: 'Borrowing & Return', icon: ArrowRightLeft },
  { id: 'tracking', label: 'Tracking & Accountability', icon: ClipboardList },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'maintenance', label: 'Maintenance', icon: Settings },
  { id: 'roles', label: 'Role Management', icon: Shield },
  { id: 'help', label: 'Help', icon: HelpCircle },
  { id: 'exit', label: 'Exit', icon: LogOut },
];

const staffMenuItems = [
  { id: 'inventory', label: 'Products / Inventory', icon: Package },
  { id: 'borrowing', label: 'Borrowing & Return', icon: ArrowRightLeft },
  { id: 'tracking', label: 'Tracking & Accountability', icon: ClipboardList },
  { id: 'help', label: 'Help', icon: HelpCircle },
];

export function Sidebar({ activeModule, onModuleChange, userRole }: SidebarProps) {
  const menuItems = userRole === 'Admin' ? adminMenuItems : staffMenuItems;
  
  return (
    <aside className="w-[260px] h-full bg-[#1a3b1c] pt-4">
      <nav className="flex flex-col">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onModuleChange(item.id)}
              className={`
                flex items-center gap-3 px-6 py-4 transition-all relative
                ${isActive 
                  ? 'bg-[#F5D000]/10 text-white' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#F5D000]" />
              )}
              <Icon size={24} />
              <span className="label-section">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

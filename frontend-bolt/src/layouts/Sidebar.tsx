import { ReactNode } from 'react';
import {
  LayoutDashboard,
  FileText,
  Layers,
  Boxes,
  Rocket,
  Settings,
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: ReactNode;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: 'New App Request', path: '/new-request', icon: <FileText className="w-5 h-5" /> },
  { name: 'Applications', path: '/applications', icon: <Layers className="w-5 h-5" /> },
  { name: 'Templates', path: '/templates', icon: <Boxes className="w-5 h-5" /> },
  { name: 'Deployments', path: '/deployments', icon: <Rocket className="w-5 h-5" /> },
  { name: 'Admin', path: '/admin', icon: <Settings className="w-5 h-5" /> },
];

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function Sidebar({ currentPath, onNavigate }: SidebarProps) {
  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-full border-r border-slate-800 shadow-xl">
      <div className="px-6 py-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">app-deploy</h1>
            <p className="text-xs text-slate-400 font-medium">Internal Developer Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center text-sm font-medium border border-slate-700">
            PE
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Platform Engineering</p>
            <p className="text-xs text-slate-400 truncate">platform@company.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function MainLayout({ children, title, subtitle, currentPath, onNavigate }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar currentPath={currentPath} onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} subtitle={subtitle} />

        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="px-8 py-6 max-w-[1800px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
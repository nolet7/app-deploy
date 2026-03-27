import { useState } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { NewAppRequest } from './pages/NewAppRequest';
import { Applications } from './pages/Applications';
import { Templates } from './pages/Templates';
import { Deployments } from './pages/Deployments';
import { Admin } from './pages/Admin';
import { PromptViewer } from './components/PromptViewer';
import { useRouter } from './hooks/useRouter';

interface PageConfig {
  title: string;
  subtitle?: string;
  component: React.ReactNode;
}

function App() {
  const { currentPath, navigate } = useRouter();
  const [promptViewerOpen, setPromptViewerOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  function handleViewPrompt(requestId: string) {
    setSelectedRequestId(requestId);
    setPromptViewerOpen(true);
  }

  const pages: Record<string, PageConfig> = {
    '/': {
      title: 'Dashboard',
      subtitle: 'Platform overview and recent activity',
      component: <Dashboard />,
    },
    '/new-request': {
      title: 'New App Request',
      subtitle: 'Create a new application deployment request',
      component: <NewAppRequest />,
    },
    '/applications': {
      title: 'Applications',
      subtitle: 'Manage and monitor all application requests',
      component: <Applications onViewPrompt={handleViewPrompt} />,
    },
    '/templates': {
      title: 'Templates',
      subtitle: 'Browse available application templates',
      component: <Templates />,
    },
    '/deployments': {
      title: 'Deployments',
      subtitle: 'Track deployment history and status',
      component: <Deployments />,
    },
    '/admin': {
      title: 'Administration',
      subtitle: 'Platform configuration and management',
      component: <Admin />,
    },
  };

  const currentPage = pages[currentPath] || pages['/'];

  return (
    <>
      <MainLayout
        title={currentPage.title}
        subtitle={currentPage.subtitle}
        currentPath={currentPath}
        onNavigate={navigate}
      >
        {currentPage.component}
      </MainLayout>

      <PromptViewer
        requestId={selectedRequestId}
        isOpen={promptViewerOpen}
        onClose={() => setPromptViewerOpen(false)}
      />
    </>
  );
}

export default App;
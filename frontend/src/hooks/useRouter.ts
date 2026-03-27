import { useEffect, useState } from 'react';

export function useRouter() {
  const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || '/');

  useEffect(() => {
    function handleHashChange() {
      setCurrentPath(window.location.hash.slice(1) || '/');
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  function navigate(path: string) {
    window.location.hash = path;
  }

  return { currentPath, navigate };
}
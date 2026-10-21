import React, { createContext, useContext, useEffect, useState } from 'react';

export type RoutePath = '/' | '/chat' | '/about' | '/features' | '/privacy' | '/terms';

interface RouterContextType {
  currentPath: string;
  navigate: (path: string) => void;
  isChatPage: boolean;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

function normalizePath(rawPath: string): string {
  // Check hash first: e.g. #/chat or #chat
  if (window.location.hash) {
    const hash = window.location.hash.replace(/^#\/?/, '/');
    if (hash.startsWith('/chat')) return '/chat';
    if (hash.startsWith('/privacy')) return '/privacy';
    if (hash.startsWith('/terms')) return '/terms';
    if (hash.startsWith('/features')) return '/features';
    if (hash.startsWith('/about')) return '/about';
  }

  // Check URL pathname (strip base path if present)
  let path = rawPath.toLowerCase();
  // Strip trailing slash if not root
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }

  if (path.endsWith('/chat')) return '/chat';
  if (path.endsWith('/privacy')) return '/privacy';
  if (path.endsWith('/terms')) return '/terms';
  if (path.endsWith('/features')) return '/features';
  if (path.endsWith('/about')) return '/about';

  return '/';
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(() =>
    normalizePath(window.location.pathname)
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    // Check if there was a redirected path from GitHub Pages 404.html (e.g. ?p=/chat)
    const params = new URLSearchParams(window.location.search);
    const redirectParam = params.get('p');
    if (redirectParam) {
      const target = normalizePath(redirectParam);
      window.history.replaceState(null, '', target);
      setCurrentPath(target);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (path: string) => {
    const normalized = normalizePath(path);
    // Push state and update hash for GitHub Pages safety
    if (window.location.protocol === 'file:' || window.location.hostname.endsWith('github.io')) {
      window.location.hash = normalized === '/' ? '' : normalized;
    } else {
      window.history.pushState(null, '', normalized);
    }
    setCurrentPath(normalized);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isChatPage = currentPath === '/chat';

  return (
    <RouterContext.Provider value={{ currentPath, navigate, isChatPage }}>
      {children}
    </RouterContext.Provider>
  );
};

export function useRouter(): RouterContextType {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return ctx;
}

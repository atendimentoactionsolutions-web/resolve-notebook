import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import Catalog from './components/Catalog';
import Admin from './components/Admin';

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => {
    return window.location.pathname.toLowerCase();
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname.toLowerCase());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path.split('?')[0].toLowerCase());
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Atalho secreto de teclado: Ctrl + Shift + A ou Alt + A
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        handleNavigate('/admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Roteamento
  if (currentPath === '/admin' || currentPath.startsWith('/admin') || currentPath.startsWith('/painel')) {
    return <Admin onNavigate={handleNavigate} />;
  }

  if (currentPath === '/produtos' || currentPath.startsWith('/produtos') || currentPath.startsWith('/catalogo')) {
    return <Catalog onNavigate={handleNavigate} />;
  }

  return <Home onNavigate={handleNavigate} />;
}

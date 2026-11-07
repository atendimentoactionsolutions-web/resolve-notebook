import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import Catalog from './components/Catalog';
import Admin from './components/Admin';

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => {
    return window.location.pathname.toLowerCase();
  });

  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem('resolve_theme') !== 'light';
    } catch (e) {
      return true;
    }
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark-mode');
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      document.body.style.background = '#08080a';
      document.body.style.color = '#f4f4f5';
      try { localStorage.setItem('resolve_theme', 'dark'); } catch (e) {}
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) metaTheme.setAttribute('content', '#08080a');
    } else {
      document.documentElement.classList.remove('dark-mode');
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      document.body.style.background = '#f6f8f8';
      document.body.style.color = '#17201f';
      try { localStorage.setItem('resolve_theme', 'light'); } catch (e) {}
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) metaTheme.setAttribute('content', '#f6f8f8');
    }
  }, [isDark]);

  const toggleDark = () => setIsDark(prev => !prev);

  // Atalho de teclado para alternar modo escuro: Alt + D ou Ctrl + Shift + D
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.altKey && e.key.toLowerCase() === 'd') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd')) {
        e.preventDefault();
        toggleDark();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

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
    return <Admin onNavigate={handleNavigate} isDark={isDark} onToggleDark={toggleDark} />;
  }

  if (currentPath === '/produtos' || currentPath.startsWith('/produtos') || currentPath.startsWith('/catalogo')) {
    return <Catalog onNavigate={handleNavigate} isDark={isDark} onToggleDark={toggleDark} />;
  }

  return <Home onNavigate={handleNavigate} isDark={isDark} onToggleDark={toggleDark} />;
}

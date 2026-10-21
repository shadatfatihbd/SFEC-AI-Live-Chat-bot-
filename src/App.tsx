import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { ChatPage } from './pages/ChatPage';
import { PrivacyModal } from './components/PrivacyModal';
import { TermsModal } from './components/TermsModal';

const AppContent: React.FC = () => {
  const { currentPath, isChatPage } = useRouter();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  // If user opens direct route for privacy or terms
  React.useEffect(() => {
    if (currentPath === '/privacy') {
      setPrivacyOpen(true);
    } else if (currentPath === '/terms') {
      setTermsOpen(true);
    }
  }, [currentPath]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {!isChatPage && <Navbar />}

      <div className="flex-1 flex flex-col">
        {isChatPage ? <ChatPage /> : <HomePage />}
      </div>

      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </ThemeProvider>
  );
}

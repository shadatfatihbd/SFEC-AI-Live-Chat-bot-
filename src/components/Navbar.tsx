import React, { useState } from 'react';
import { MessageSquare, Moon, Sun, Menu, X, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useRouter } from '../context/RouterContext';
import { MESSENGER_URL } from '../services/gasApi';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentPath, navigate, isChatPage } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-[#E5E5EA] dark:border-[#303036] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single clean text element, no subtitle in header per contract) */}
        <button
          onClick={() => handleNavClick('/')}
          className="text-xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] whitespace-nowrap shrink-0 hover:opacity-85 transition-opacity text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] rounded-md"
          aria-label="SFEC AI Live Chat Home"
        >
          SFEC
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#6E6E73] dark:text-[#A1A1AA]">
          <button
            onClick={() => handleNavClick('/')}
            className={`hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors whitespace-nowrap shrink-0 ${
              currentPath === '/' ? 'text-[#1D1D1F] dark:text-[#F5F5F7] font-semibold' : ''
            }`}
          >
            মূল পাতা
          </button>
          <a
            href="#features"
            onClick={(e) => {
              if (isChatPage) {
                e.preventDefault();
                navigate('/');
                setTimeout(() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors whitespace-nowrap shrink-0"
          >
            সুবিধাসমূহ
          </a>
          <a
            href="#guidance"
            onClick={(e) => {
              if (isChatPage) {
                e.preventDefault();
                navigate('/');
                setTimeout(() => {
                  document.getElementById('guidance')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors whitespace-nowrap shrink-0"
          >
            ভর্তি নির্দেশিকা
          </a>
          <a
            href="#trust"
            onClick={(e) => {
              if (isChatPage) {
                e.preventDefault();
                navigate('/');
                setTimeout(() => {
                  document.getElementById('trust')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors whitespace-nowrap shrink-0"
          >
            নির্ভরযোগ্যতা
          </a>
          <a
            href={MESSENGER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-[#007AFF] dark:hover:text-[#0A84FF] transition-colors whitespace-nowrap shrink-0"
          >
            <span>মানব পরামর্শ</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
          </a>
        </nav>

        {/* Zone 3: 1 Primary CTA + Theme switch */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleTheme}
            className="p-2 text-[#6E6E73] dark:text-[#A1A1AA] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {!isChatPage ? (
            <button
              onClick={() => handleNavClick('/chat')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#007AFF] hover:bg-[#0062cc] dark:bg-[#0A84FF] dark:hover:bg-[#0070df] rounded-full shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>AI চ্যাট শুরু করুন</span>
            </button>
          ) : (
            <button
              onClick={() => handleNavClick('/')}
              className="px-3.5 py-1.5 text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7] bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 rounded-full transition-colors whitespace-nowrap shrink-0"
            >
              মূল পাতায় ফিরুন
            </button>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#6E6E73] dark:text-[#A1A1AA] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E5EA] dark:border-[#303036] bg-[#FFFFFF] dark:bg-[#17171B] px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in fade-in duration-150">
          <button
            onClick={() => handleNavClick('/')}
            className="block w-full text-left py-2 px-3 text-sm font-medium text-[#1D1D1F] dark:text-[#F5F5F7] rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
          >
            মূল পাতা
          </button>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left py-2 px-3 text-sm font-medium text-[#6E6E73] dark:text-[#A1A1AA] rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
          >
            সুবিধাসমূহ
          </a>
          <a
            href="#guidance"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left py-2 px-3 text-sm font-medium text-[#6E6E73] dark:text-[#A1A1AA] rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
          >
            ভর্তি নির্দেশিকা
          </a>
          <a
            href="#trust"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left py-2 px-3 text-sm font-medium text-[#6E6E73] dark:text-[#A1A1AA] rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
          >
            নির্ভরযোগ্যতা ও যাচাই
          </a>
          <a
            href={MESSENGER_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between w-full py-2 px-3 text-sm font-medium text-[#007AFF] dark:text-[#0A84FF] rounded-lg hover:bg-[#007AFF]/5"
          >
            <span>মানব পরামর্শ (Messenger)</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
          <div className="pt-2">
            <button
              onClick={() => handleNavClick('/chat')}
              className="w-full py-2.5 px-4 text-center text-sm font-semibold text-white bg-[#007AFF] hover:bg-[#0062cc] dark:bg-[#0A84FF] rounded-xl shadow-sm"
            >
              AI চ্যাটে যান
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

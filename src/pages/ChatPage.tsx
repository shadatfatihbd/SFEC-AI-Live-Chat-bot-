import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Plus,
  ArrowLeft,
  Bot,
  User,
  Copy,
  Check,
  RotateCw,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Moon,
  Sun,
  GraduationCap,
  Sparkles,
  BookOpen,
  School,
  Clock,
  Compass,
} from 'lucide-react';
import { ChatMessage } from '../types';
import {
  checkBackendHealth,
  createConversation,
  getActiveConversationId,
  getConversationMessages,
  getOrCreateVisitorId,
  getRecentConversations,
  MESSENGER_URL,
  recordConversation,
  requestAiReply,
  sendMessage,
  setActiveConversationId,
  StoredConversationMeta,
} from '../services/gasApi';
import { useRouter } from '../context/RouterContext';
import { useTheme } from '../context/ThemeContext';

export const ChatPage: React.FC = () => {
  const { navigate } = useRouter();
  const { theme, toggleTheme } = useTheme();

  // State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [visitorId] = useState<string>(() => getOrCreateVisitorId());
  const [healthStatus, setHealthStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastError, setLastError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [recentConversations, setRecentConversations] = useState<StoredConversationMeta[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Suggested prompt chips for the empty state
  const suggestedPrompts = [
    {
      title: 'অনার্স ২০২৬ ভর্তি যোগ্যতা',
      desc: 'বিজ্ঞান/মানবিক/ব্যবসায় জিপিএ শর্ত',
      prompt: 'জাতীয় বিশ্ববিদ্যালয়ে অনার্স ২০২৬ শিক্ষাবর্ষে ভর্তির জন্য বিজ্ঞান, মানবিক ও ব্যবসায় শিক্ষা শাখার ন্যূনতম জিপিএ ও আবেদনের যোগ্যতা কী?',
      icon: GraduationCap,
    },
    {
      title: 'ডিগ্রি (পাস) কোর্স থেকে মাস্টার্স',
      desc: 'ক্যারিয়ার সুবিধা ও মাস্টার্স প্রিলিমিনারি',
      prompt: 'ডিগ্রি (পাস) কোর্স সম্পন্ন করে কি পরবর্তীতে মাস্টার্স করা সম্ভব? মাস্টার্স প্রিলিমিনারি ভর্তির নিয়ম ও সুবিধা কী?',
      icon: BookOpen,
    },
    {
      title: 'রিলিজ স্লিপ আবেদন পদ্ধতি',
      desc: 'শূন্য আসন ও একাধিক কলেজে আবেদন',
      prompt: 'অনার্স ভর্তিতে প্রথম ও দ্বিতীয় রিলিজ স্লিপে আবেদনের নিয়ম কী? কতটি কলেজে একযোগে আবেদন করা যায়?',
      icon: Compass,
    },
    {
      title: 'মাস্টার্স রেগুলার বনাম প্রাইভেট',
      desc: 'কোনটির মান কেমন এবং ভর্তির নিয়ম',
      prompt: 'জাতীয় বিশ্ববিদ্যালয়ে মাস্টার্স রেগুলার ও মাস্টার্স প্রাইভেটের মধ্যে পার্থক্য কী? প্রাইভেটে ভর্তি হতে কী কী যোগ্যতা লাগে?',
      icon: School,
    },
  ];

  // Auto scroll to bottom
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, isLoading]);

  // Load initial health status and previous conversation if available
  useEffect(() => {
    const init = async () => {
      // 1. Health check
      try {
        const health = await checkBackendHealth();
        setHealthStatus(health.success && health.status === 'online' ? 'online' : 'offline');
      } catch {
        setHealthStatus('offline');
      }

      // 2. Load recent conversations list from storage
      setRecentConversations(getRecentConversations());

      // 3. Check if there was an active conversation stored
      const savedConvId = getActiveConversationId();
      if (savedConvId) {
        setConversationId(savedConvId);
        try {
          const res = await getConversationMessages(savedConvId);
          if (res.success && res.messages && res.messages.length > 0) {
            setMessages(res.messages);
          }
        } catch {
          // If restoring fails, continue with fresh state
        }
      }

      // 4. Check for prefill prompt from homepage
      try {
        const prefill = sessionStorage.getItem('sfec_prefill_prompt');
        if (prefill) {
          setInputText(prefill);
          sessionStorage.removeItem('sfec_prefill_prompt');
          textareaRef.current?.focus();
        }
      } catch {
        // Ignore
      }
    };

    init();
  }, []);

  // Adjust textarea height dynamically
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  // Start new conversation
  const handleNewChat = () => {
    setActiveConversationId(null);
    setConversationId(null);
    setMessages([]);
    setLastError(null);
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // Switch to a previous conversation
  const handleSelectConversation = async (convId: string) => {
    if (convId === conversationId || isLoading) return;
    setIsLoading(true);
    setLastError(null);
    try {
      setConversationId(convId);
      setActiveConversationId(convId);
      const res = await getConversationMessages(convId);
      if (res.success && res.messages) {
        setMessages(res.messages);
      } else {
        setMessages([]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'কথোপকথন লোড করা সম্ভব হয়নি।';
      setLastError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Copy message text to clipboard
  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Retry sending / AI reply
  const handleRetryAi = async () => {
    if (!conversationId || isLoading) return;
    setIsLoading(true);
    setLastError(null);

    try {
      const aiRes = await requestAiReply(conversationId, visitorId);
      if (aiRes.success && aiRes.message) {
        setMessages((prev) => [...prev, aiRes.message!]);
      } else {
        const errText = aiRes.error || 'এআই উত্তর তৈরিতে সাময়িক ত্রুটি হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।';
        setLastError(errText);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি।';
      setLastError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Full Send Message Workflow
  const handleSendMessage = async (textToSend?: string) => {
    const rawContent = textToSend !== undefined ? textToSend : inputText;
    const content = rawContent.trim();
    if (!content || isLoading) return;

    if (content.length > 1000) {
      setLastError('বার্তাটি ১০০০ অক্ষরের কম হতে হবে।');
      return;
    }

    setLastError(null);
    setIsLoading(true);
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Temporary optimistic visitor message for immediate responsive UI
    const tempVisitorMsgId = `temp_vis_${Date.now()}`;
    const optimisticVisitorMsg: ChatMessage = {
      messageId: tempVisitorMsgId,
      conversationId: conversationId || 'pending',
      sender: 'visitor',
      message: content,
      createdAt: new Date().toISOString(),
      isPending: true,
    };

    setMessages((prev) => [...prev, optimisticVisitorMsg]);

    let activeId = conversationId;

    try {
      // Step 1 & 2: Create conversation if none exists
      if (!activeId) {
        const createRes = await createConversation(visitorId, 'শিক্ষার্থী');
        if (!createRes.success || !createRes.conversation) {
          throw new Error(createRes.error || 'নতুন কথোপকথন শুরু করতে ব্যর্থ হয়েছে।');
        }
        activeId = createRes.conversation.conversationId;
        setConversationId(activeId);
        setActiveConversationId(activeId);

        // Record in recent list
        const meta: StoredConversationMeta = {
          conversationId: activeId,
          titleSnippet: content.slice(0, 35) + (content.length > 35 ? '...' : ''),
          createdAt: new Date().toISOString(),
          lastMessageAt: new Date().toISOString(),
        };
        recordConversation(meta);
        setRecentConversations(getRecentConversations());
      }

      // Step 3 & 4: Call sendMessage to Apps Script
      const sendRes = await sendMessage(activeId, visitorId, content);
      if (!sendRes.success || !sendRes.message) {
        throw new Error(sendRes.error || 'বার্তাটি সার্ভারে সংরক্ষণ করা সম্ভব হয়নি।');
      }

      // Replace optimistic message with confirmed server message
      setMessages((prev) =>
        prev.map((m) => (m.messageId === tempVisitorMsgId ? sendRes.message! : m))
      );

      // Step 5: Call aiReply to trigger real backend Gemini reply
      const aiRes = await requestAiReply(activeId, visitorId);

      // Step 6: Handle real backend response
      if (aiRes.success && aiRes.message) {
        setMessages((prev) => [...prev, aiRes.message!]);
      } else {
        // Backend returned error (e.g. "AI service is temporarily unavailable. Please try again.")
        // As strictly required: Never fabricate a fake answer! Show the real error and offer Messenger link.
        const errText = aiRes.error || 'এআই উত্তর প্রদানে সাময়িক সমস্যা দেখা দিয়েছে।';
        setLastError(errText);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'সার্ভার সংযোগে ত্রুটি দেখা দিয়েছে।';
      setLastError(errMsg);
      // Mark temporary message as error
      setMessages((prev) =>
        prev.map((m) => (m.messageId === tempVisitorMsgId ? { ...m, isPending: false, isError: true } : m))
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#F5F5F7] dark:bg-[#09090B] text-[#1D1D1F] dark:text-[#F5F5F7] overflow-hidden">
      {/* Desktop Sidebar (Apple-inspired minimalist sidebar) */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-[#E5E5EA] dark:border-[#303036] bg-[#FFFFFF] dark:bg-[#17171B] shrink-0 justify-between transition-colors">
        {/* Top Header & New Chat */}
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E6E73] dark:text-[#A1A1AA] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors focus-visible:outline-none"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>মূল পাতায় ফিরে যান</span>
            </button>

            {/* Health status badge */}
            <div className="flex items-center gap-1.5 text-[11px] text-[#6E6E73] dark:text-[#A1A1AA]">
              <span
                className={`w-2 h-2 rounded-full ${
                  healthStatus === 'online'
                    ? 'bg-[#248A3D] dark:bg-[#30D158]'
                    : healthStatus === 'checking'
                    ? 'bg-amber-400'
                    : 'bg-[#D70015]'
                }`}
              />
              <span>{healthStatus === 'online' ? 'অনলাইন' : healthStatus === 'checking' ? 'যাচাই হচ্ছে' : 'অফলাইন'}</span>
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
              SFEC AI Live Chat
            </h2>
            <p className="text-[11px] text-[#6E6E73] dark:text-[#A1A1AA]">
              জাতীয় বিশ্ববিদ্যালয় ও শিক্ষা সহায়ক
            </p>
          </div>

          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-[#007AFF] hover:bg-[#0062cc] dark:bg-[#0A84FF] rounded-xl shadow-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন চ্যাট শুরু করুন</span>
          </button>
        </div>

        {/* Middle: Recent conversations list */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-2 py-1 text-[11px] font-semibold text-[#6E6E73] dark:text-[#A1A1AA] uppercase tracking-wider">
            সাম্প্রতিক চ্যাট তালিকা
          </div>
          {recentConversations.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-[#6E6E73] dark:text-[#A1A1AA]">
              এখনও কোনো পূর্ববর্তী চ্যাট নেই
            </div>
          ) : (
            recentConversations.map((c) => (
              <button
                key={c.conversationId}
                onClick={() => handleSelectConversation(c.conversationId)}
                className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors truncate flex items-center gap-2 ${
                  c.conversationId === conversationId
                    ? 'bg-[#007AFF]/10 dark:bg-[#0A84FF]/15 text-[#007AFF] dark:text-[#0A84FF] font-medium'
                    : 'text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <Clock className="w-3.5 h-3.5 opacity-60 shrink-0" />
                <span className="truncate">{c.titleSnippet || 'শিক্ষামূলক প্রশ্ন'}</span>
              </button>
            ))
          )}
        </div>

        {/* Bottom Sidebar: Human Support Card & Theme Switcher */}
        <div className="p-4 border-t border-[#E5E5EA] dark:border-[#303036] space-y-3 bg-[#F5F5F7]/50 dark:bg-[#1A1A20]/50">
          <div className="p-3 rounded-xl border border-[#E5E5EA] dark:border-[#303036] bg-[#FFFFFF] dark:bg-[#17171B] space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              <MessageCircle className="w-3.5 h-3.5 text-[#007AFF] dark:text-[#0A84FF]" />
              <span>মানব বিশেষজ্ঞ পরামর্শ</span>
            </div>
            <p className="text-[11px] text-[#6E6E73] dark:text-[#A1A1AA] leading-relaxed">
              সরাসরি Shadat Fatih Education Consultant এর সাথে মেসেঞ্জারে কথা বলুন।
            </p>
            <a
              href={MESSENGER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 text-[11px] font-semibold text-[#007AFF] dark:text-[#0A84FF] bg-[#007AFF]/10 dark:bg-[#0A84FF]/15 hover:bg-[#007AFF]/20 rounded-lg transition-colors"
            >
              <span>মানব পরামর্শ নিন</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center justify-between text-xs text-[#6E6E73] dark:text-[#A1A1AA] pt-1">
            <span>থিম পরিবর্তন</span>
            <button
              onClick={toggleTheme}
              className="p-1.5 hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] rounded-md transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Chat Panel */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile / Desktop Top Bar */}
        <header className="h-14 px-4 sm:px-6 flex items-center justify-between border-b border-[#E5E5EA] dark:border-[#303036] bg-[#FFFFFF]/80 dark:bg-[#17171B]/80 backdrop-blur-md shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-1.5 text-[#6E6E73] dark:text-[#A1A1AA] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] rounded-lg transition-colors focus-visible:outline-none"
              aria-label="Go to Homepage"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  SFEC AI Live Assistant
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    healthStatus === 'online'
                      ? 'bg-[#248A3D] dark:bg-[#30D158]'
                      : healthStatus === 'checking'
                      ? 'bg-amber-400'
                      : 'bg-[#D70015]'
                  }`}
                  title={`Status: ${healthStatus}`}
                />
              </div>
              <p className="text-[10px] text-[#6E6E73] dark:text-[#A1A1AA] hidden sm:block">
                জাতীয় বিশ্ববিদ্যালয় ও উচ্চশিক্ষা পরামর্শক
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNewChat}
              className="lg:hidden p-2 text-xs font-semibold text-[#007AFF] dark:text-[#0A84FF] hover:bg-[#007AFF]/10 rounded-lg transition-colors"
              title="নতুন চ্যাট"
            >
              <Plus className="w-4 h-4" />
            </button>

            <a
              href={MESSENGER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#007AFF] dark:text-[#0A84FF] bg-[#007AFF]/10 dark:bg-[#0A84FF]/15 hover:bg-[#007AFF]/20 rounded-full transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">মানব পরামর্শ</span>
              <span className="sm:hidden">মেসেঞ্জার</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>

            <button
              onClick={toggleTheme}
              className="lg:hidden p-2 text-[#6E6E73] dark:text-[#A1A1AA] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Message Thread Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {messages.length === 0 ? (
            /* Empty State: Apple-style Welcome & Starter Prompts */
            <div className="max-w-2xl mx-auto py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
              <div className="text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#007AFF]/20 to-[#5856D6]/20 text-[#007AFF] dark:text-[#0A84FF] flex items-center justify-center shadow-xs">
                  <Bot className="w-7 h-7" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
                  কীভাবে আপনাকে সাহায্য করতে পারি?
                </h1>
                <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#A1A1AA] max-w-lg mx-auto leading-relaxed">
                  জাতীয় বিশ্ববিদ্যালয় অনার্স ১ম বর্ষ, ডিগ্রি (পাস), মাস্টার্স প্রিলিমিনারি/রেগুলার ভর্তি ও বিষয় নির্বাচন সম্পর্কিত যেকোনো তথ্য জানতে নিচে প্রশ্ন লিখুন অথবা যেকোনো উদাহরণে ক্লিক করুন।
                </p>
              </div>

              {/* Starter Prompt Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {suggestedPrompts.map((sp, idx) => {
                  const Icon = sp.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(sp.prompt)}
                      className="text-left p-4 rounded-2xl border border-[#E5E5EA] dark:border-[#303036] bg-[#FFFFFF] dark:bg-[#17171B] hover:border-[#007AFF]/50 dark:hover:border-[#0A84FF]/50 hover:shadow-xs transition-all duration-150 space-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]"
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                        <Icon className="w-4 h-4 text-[#007AFF] dark:text-[#0A84FF] shrink-0" />
                        <span>{sp.title}</span>
                      </div>
                      <p className="text-[11px] text-[#6E6E73] dark:text-[#A1A1AA]">
                        {sp.desc}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Messenger Alternative Card in Empty State */}
              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#E5E5EA] dark:border-[#303036] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                    সরাসরি মানব পরামর্শকের সাথে কথা বলতে চান?
                  </span>
                  <p className="text-[11px] text-[#6E6E73] dark:text-[#A1A1AA]">
                    Shadat Fatih Education Consultant এর অফিশিয়াল মেসেঞ্জারে যোগাযোগ করুন।
                  </p>
                </div>
                <a
                  href={MESSENGER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#007AFF] hover:bg-[#0062cc] dark:bg-[#0A84FF] rounded-full shadow-xs whitespace-nowrap"
                >
                  মানব পরামর্শ নিন
                </a>
              </div>
            </div>
          ) : (
            /* Message Stream */
            <div className="max-w-3xl mx-auto space-y-5">
              {messages.map((msg, index) => {
                const isVisitor = msg.sender === 'visitor';
                const formattedTime = new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={msg.messageId || index}
                    className={`flex items-start gap-3 ${
                      isVisitor ? 'justify-end pl-10' : 'justify-start pr-6'
                    }`}
                  >
                    {!isVisitor && (
                      <div className="w-7 h-7 rounded-full bg-[#5856D6]/15 dark:bg-[#5856D6]/25 text-[#5856D6] dark:text-[#9D9BFF] flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`relative group max-w-xl rounded-2xl p-4 sm:p-5 shadow-xs text-xs sm:text-sm leading-relaxed ${
                        isVisitor
                          ? 'bg-[#007AFF] text-white rounded-tr-xs'
                          : 'bg-[#FFFFFF] dark:bg-[#17171B] border border-[#E5E5EA] dark:border-[#303036] text-[#1D1D1F] dark:text-[#F5F5F7] rounded-tl-xs'
                      } ${msg.isError ? 'border-red-400 bg-red-500/10' : ''}`}
                    >
                      {/* Message header */}
                      <div
                        className={`flex items-center justify-between text-[11px] pb-1.5 mb-2 border-b ${
                          isVisitor
                            ? 'border-white/15 text-white/80'
                            : 'border-black/5 dark:border-white/5 text-[#6E6E73] dark:text-[#A1A1AA]'
                        }`}
                      >
                        <span className="font-semibold">
                          {isVisitor ? 'আপনি (শিক্ষার্থী)' : 'SFEC AI শিক্ষা সহায়ক'}
                        </span>
                        <div className="flex items-center gap-2">
                          <span>{formattedTime}</span>
                          <button
                            onClick={() => handleCopyMessage(msg.messageId, msg.message)}
                            className="opacity-70 hover:opacity-100 transition-opacity p-0.5"
                            title="কপি করুন"
                          >
                            {copiedId === msg.messageId ? (
                              <Check className="w-3.5 h-3.5 text-emerald-300" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Message Content */}
                      <div className="whitespace-pre-wrap break-words leading-relaxed">
                        {msg.message}
                      </div>

                      {/* Official Verification Reminder under AI replies */}
                      {!isVisitor && (
                        <div className="mt-3 pt-2 text-[10px] text-[#6E6E73] dark:text-[#A1A1AA] border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                          <span>* ভর্তি সংক্রান্ত চূড়ান্ত সিদ্ধান্তের জন্য অফিশিয়াল নোটিশ (nu.ac.bd) দেখুন।</span>
                        </div>
                      )}
                    </div>

                    {isVisitor && (
                      <div className="w-7 h-7 rounded-full bg-[#007AFF]/20 text-[#007AFF] dark:text-[#0A84FF] flex items-center justify-center shrink-0 text-xs font-semibold mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing / Loading indicator */}
              {isLoading && (
                <div className="flex items-start gap-3 justify-start pr-6 animate-in fade-in duration-200">
                  <div className="w-7 h-7 rounded-full bg-[#5856D6]/15 dark:bg-[#5856D6]/25 text-[#5856D6] dark:text-[#9D9BFF] flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-[#FFFFFF] dark:bg-[#17171B] border border-[#E5E5EA] dark:border-[#303036] rounded-2xl rounded-tl-xs px-4 py-3 flex items-center gap-1.5 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-[#007AFF] animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-[#007AFF] animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-[#007AFF] animate-bounce" />
                    <span className="ml-2 text-xs text-[#6E6E73] dark:text-[#A1A1AA]">
                      SFEC AI উত্তর তৈরি করছে...
                    </span>
                  </div>
                </div>
              )}

              {/* Error State Banner with Honest Notice, Retry & Messenger link */}
              {lastError && (
                <div className="p-4 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 text-[#1D1D1F] dark:text-[#F5F5F7] space-y-3">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-red-700 dark:text-red-400">
                        সার্ভার বা এআই পরিষেবা বার্তা:
                      </span>
                      <p className="text-xs text-[#6E6E73] dark:text-[#A1A1AA] leading-relaxed">
                        {lastError}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      onClick={handleRetryAi}
                      disabled={isLoading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#007AFF] hover:bg-[#0062cc] dark:bg-[#0A84FF] rounded-lg transition-colors disabled:opacity-50"
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                      <span>পুনরায় চেষ্টা করুন</span>
                    </button>

                    <a
                      href={MESSENGER_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] bg-white dark:bg-[#222228] border border-[#E5E5EA] dark:border-[#303036] rounded-lg hover:bg-black/5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#007AFF]" />
                      <span>মানব পরামর্শ নিন (Messenger)</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Responsive Message Composer anchored to the bottom */}
        <div className="border-t border-[#E5E5EA] dark:border-[#303036] bg-[#FFFFFF]/90 dark:bg-[#17171B]/90 backdrop-blur-md p-3 sm:p-4 shrink-0">
          <div className="max-w-3xl mx-auto space-y-2">
            {/* Quick suggestion prompt chips above composer */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs text-[#6E6E73] dark:text-[#A1A1AA]">
              <span className="shrink-0 text-[11px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#007AFF]" />
                <span>পরামর্শ:</span>
              </span>
              <button
                onClick={() => handleSendMessage('অনার্স ১ম বর্ষ ভর্তি যোগ্যতা ২০২৬ কী?')}
                className="shrink-0 px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors whitespace-nowrap"
              >
                অনার্স ভর্তি যোগ্যতা
              </button>
              <button
                onClick={() => handleSendMessage('ডিগ্রি শেষ করে মাস্টার্স প্রিলিমিনারি করার নিয়ম কী?')}
                className="shrink-0 px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors whitespace-nowrap"
              >
                ডিগ্রি থেকে মাস্টার্স
              </button>
              <button
                onClick={() => handleSendMessage('রিলিজ স্লিপে আবেদনের প্রক্রিয়া কী?')}
                className="shrink-0 px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors whitespace-nowrap"
              >
                রিলিজ স্লিপ নিয়ম
              </button>
            </div>

            {/* Input area */}
            <div className="relative flex items-end gap-2 bg-[#F5F5F7] dark:bg-[#222228] border border-[#E5E5EA] dark:border-[#303036] rounded-2xl p-2 focus-within:ring-2 focus-within:ring-[#007AFF] transition-all">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="আপনার শিক্ষা বা ভর্তি বিষয়ক প্রশ্ন লিখুন... (Enter চাপলে সেন্ড হবে)"
                rows={1}
                maxLength={1000}
                className="flex-1 max-h-36 resize-none bg-transparent py-1.5 px-2 text-xs sm:text-sm text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#6E6E73] dark:placeholder-[#A1A1AA] focus:outline-none"
              />

              <div className="flex items-center gap-2 shrink-0 pb-1 pr-1">
                <span className="text-[10px] text-[#6E6E73] dark:text-[#A1A1AA]">
                  {inputText.length}/1000
                </span>
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isLoading}
                  className="p-2 rounded-xl bg-[#007AFF] hover:bg-[#0062cc] dark:bg-[#0A84FF] text-white disabled:opacity-40 disabled:hover:bg-[#007AFF] transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]"
                  aria-label="বার্তা পাঠান"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <p className="text-[10px] text-center text-[#6E6E73] dark:text-[#A1A1AA]">
              SFEC AI একটি শিক্ষামূলক নির্দেশক ব্যবস্থা। আবেদনের পূর্বে সর্বদা অফিসিয়াল গেজেট (nu.ac.bd) যাচাই করুন।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

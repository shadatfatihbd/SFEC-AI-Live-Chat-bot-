import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  GraduationCap,
  BookOpen,
  Languages,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  School,
  Compass,
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { MESSENGER_URL } from '../services/gasApi';
import { HeroChatPreview } from '../components/HeroChatPreview';
import { HumanConsultantBanner } from '../components/HumanConsultantBanner';
import { PrivacyModal } from '../components/PrivacyModal';
import { TermsModal } from '../components/TermsModal';
import { Footer } from '../components/Footer';

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  const academicTopics = [
    {
      title: 'জাতীয় বিশ্ববিদ্যালয় অনার্স ১ম বর্ষ',
      desc: 'বিজ্ঞান, ব্যবসায় শিক্ষা ও মানবিক বিভাগের জিপিএ শর্তাবলী, বিষয় ভিত্তিক যোগ্যতা ও ভর্তি বিজ্ঞপ্তি।',
      icon: GraduationCap,
      prompt: 'অনার্স ১ম বর্ষ ভর্তিতে আমার জিপিএ অনুযায়ী কোন কোন বিষয়ে সুযোগ পেতে পারি?',
    },
    {
      title: 'ডিগ্রি (পাস) কোর্স ক্যারিয়ার রুট',
      desc: 'বিএ, বিএসএস, বিবিএস, বিএসসি ডিগ্রি কোর্সের যোগ্যতা ও পরবর্তীতে মাস্টার্স প্রিলিমিনারি সংক্রান্ত তথ্য।',
      icon: BookOpen,
      prompt: 'ডিগ্রি পাস কোর্সে ভর্তির যোগ্যতা এবং ডিগ্রি শেষ করে মাস্টার্স করার নিয়ম কী?',
    },
    {
      title: 'মাস্টার্স (নিয়মিত ও প্রাইভেট)',
      desc: 'অনার্স ও ডিগ্রি শিক্ষার্থীদের জন্য মাস্টার্স প্রিলিমিনারি ও মাস্টার্স ফাইনাল কোর্সের ভর্তির বিস্তারিত।',
      icon: School,
      prompt: 'মাস্টার্স প্রিলিমিনারি ও মাস্টার্স রেগুলার কোর্সের মধ্যে পার্থক্য এবং ভর্তির নিয়ম কী?',
    },
    {
      title: 'বিষয় নির্বাচন ও রিলিজ স্লিপ',
      desc: 'চাকরির বাজারের উপযোগী বিষয় পছন্দক্রম, প্রথম/দ্বিতীয় রিলিজ স্লিপ ও কোটা ভিত্তিক আবেদন প্রক্রিয়া।',
      icon: Compass,
      prompt: 'রিলিজ স্লিপে আবেদনের ক্ষেত্রে ভালো বিষয় ও কলেজ কীভাবে নির্বাচন করব?',
    },
  ];

  const handleTopicClick = (promptText: string) => {
    // Store prefill question in sessionStorage for ChatPage
    try {
      sessionStorage.setItem('sfec_prefill_prompt', promptText);
    } catch {
      // Ignore
    }
    navigate('/chat');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7] dark:bg-[#09090B] transition-colors">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28">
          {/* Subtle ambient lighting */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#007AFF]/10 via-[#5856D6]/10 to-transparent blur-3xl pointer-events-none rounded-full" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#007AFF] dark:text-[#0A84FF]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>YOUR EDUCATION, OUR GUIDANCE</span>
              </div>

              {/* Main Bengali Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] leading-[1.2]">
                শিক্ষাজীবনের সঠিক সিদ্ধান্তে পাশে আছে SFEC AI
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-[#6E6E73] dark:text-[#A1A1AA] leading-relaxed max-w-2xl mx-auto">
                জাতীয় বিশ্ববিদ্যালয় (NU) অনার্স, ডিগ্রি (পাস), মাস্টার্স প্রিলিমিনারি/রেগুলার ভর্তি, বিষয় নির্বাচন ও রিলিজ স্লিপ সংক্রান্ত তথ্য বাংলায় বা ইংরেজিতে সরাসরি জিজ্ঞাসা করুন।
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => navigate('/chat')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#007AFF] hover:bg-[#0062cc] dark:bg-[#0A84FF] dark:hover:bg-[#0070df] rounded-full shadow-sm hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>AI-এর সঙ্গে কথা বলুন</span>
                </button>

                <a
                  href={MESSENGER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] bg-white dark:bg-[#1C1C22] hover:bg-[#E5E5EA] dark:hover:bg-[#25252D] border border-[#E5E5EA] dark:border-[#303036] rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]"
                >
                  <span>মানব পরামর্শ নিন</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Context metadata note */}
              <p className="text-xs text-[#6E6E73] dark:text-[#A1A1AA] pt-1">
                SFEC — Shadat Fatih Education Consultant কর্তৃক পরিচালিত লাইভ এডুকেশন অ্যাসিস্ট্যান্ট
              </p>
            </div>

            {/* Apple-style Interactive Live Preview Showcase */}
            <div className="mt-12 sm:mt-16 max-w-4xl mx-auto">
              <HeroChatPreview />
            </div>
          </div>
        </section>

        {/* Academic Guidance Programs Grid */}
        <section id="guidance" className="py-16 sm:py-20 border-t border-[#E5E5EA] dark:border-[#303036] bg-[#FFFFFF] dark:bg-[#17171B]/50 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#007AFF] dark:text-[#0A84FF]">
                ACADEMIC DOMAINS
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
                যেসব বিষয়ে শিক্ষার্থীদের দিকনির্দেশনা প্রদান করা হয়
              </h2>
              <p className="text-sm text-[#6E6E73] dark:text-[#A1A1AA]">
                আপনার নির্দিষ্ট শিক্ষাগত প্রশ্নটি বেছে নিয়ে সরাসরি লাইভ চ্যাটে শুরু করতে ক্লিক করুন:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {academicTopics.map((topic, idx) => {
                const Icon = topic.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => handleTopicClick(topic.prompt)}
                    className="group cursor-pointer p-6 sm:p-7 rounded-2xl border border-[#E5E5EA] dark:border-[#303036] bg-[#F5F5F7] dark:bg-[#1C1C22] hover:border-[#007AFF]/40 dark:hover:border-[#0A84FF]/40 hover:shadow-md transition-all duration-200 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#007AFF]/10 dark:bg-[#0A84FF]/15 text-[#007AFF] dark:text-[#0A84FF] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold text-[#007AFF] dark:text-[#0A84FF] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        <span>প্রশ্ন করুন</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                        {topic.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#A1A1AA] leading-relaxed">
                        {topic.desc}
                      </p>
                    </div>

                    <div className="pt-2 text-xs font-medium text-[#1D1D1F]/70 dark:text-[#F5F5F7]/70 italic border-t border-black/5 dark:border-white/5">
                      উদাহরণ: "{topic.prompt}"
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Bento Section */}
        <section id="features" className="py-16 sm:py-20 border-t border-[#E5E5EA] dark:border-[#303036]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#007AFF] dark:text-[#0A84FF]">
                PLATFORM CAPABILITIES
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
                প্রযুক্তি ও শিক্ষার সমন্বয়ে প্রস্তুত SFEC AI
              </h2>
              <p className="text-sm text-[#6E6E73] dark:text-[#A1A1AA]">
                সহজ ব্যবহারযোগ্যতা এবং শিক্ষার্থীদের নির্ভুল তথ্যের চাহিদা মাথায় রেখে সম্পূর্ণ সিস্টেমটি সাজানো হয়েছে।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="md:col-span-2 p-6 sm:p-8 rounded-3xl border border-[#E5E5EA] dark:border-[#303036] bg-[#FFFFFF] dark:bg-[#17171B] space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#007AFF]/10 dark:bg-[#0A84FF]/15 text-[#007AFF] dark:text-[#0A84FF] flex items-center justify-center">
                  <Languages className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  বাংলা ও ইংরেজি দ্বিভাষিক যোগাযোগ
                </h3>
                <p className="text-sm text-[#6E6E73] dark:text-[#A1A1AA] leading-relaxed">
                  শিক্ষার্থীরা তাদের প্রশ্ন মাতৃভাষা বাংলায় বা ইংরেজিতে স্বাচ্ছন্দ্যে লিখতে পারেন। জটিল প্রাতিষ্ঠানিক শর্ত ও ভর্তি নিয়মাবলী সহজ প্রাঞ্জল ভাষায় বুঝিয়ে দেওয়া হয়।
                </p>
                <div className="flex flex-wrap gap-2 pt-2 text-xs text-[#6E6E73] dark:text-[#A1A1AA]">
                  <span>বাংলা ইউনিকোড সহায়তা</span>
                  <span aria-hidden="true">·</span>
                  <span>ইংলিশ সমর্থন</span>
                  <span aria-hidden="true">·</span>
                  <span>স্বাভাবিক ভাষা বিশ্লেষণ</span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="p-6 sm:p-8 rounded-3xl border border-[#E5E5EA] dark:border-[#303036] bg-[#FFFFFF] dark:bg-[#17171B] space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#5856D6]/10 dark:bg-[#5856D6]/20 text-[#5856D6] dark:text-[#9D9BFF] flex items-center justify-center">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  সেশন ও হিস্ট্রি সংরক্ষণ
                </h3>
                <p className="text-sm text-[#6E6E73] dark:text-[#A1A1AA] leading-relaxed">
                  ব্রাউজার রিফ্রেশ করলেও আপনার চলমান আলোচনা হারিয়ে যায় না। লোকালস্টোরেজ ও ক্লাউড ডেটাবেজের সমন্বয়ে কথোপকথন সংরক্ষিত থাকে।
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 sm:p-8 rounded-3xl border border-[#E5E5EA] dark:border-[#303036] bg-[#FFFFFF] dark:bg-[#17171B] space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#34C759]/10 dark:bg-[#34C759]/20 text-[#248A3D] dark:text-[#30D158] flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  গুগল অ্যাপস স্ক্রিপ্ট ব্যাকএন্ড
                </h3>
                <p className="text-sm text-[#6E6E73] dark:text-[#A1A1AA] leading-relaxed">
                  নির্ভরযোগ্য Google Apps Script ও Sheets আর্কিটেকচার দ্বারা চালিত। কোনো গোপন এপিআই কি ব্রাউজারে উন্মুক্ত হয় না।
                </p>
              </div>

              {/* Feature 4 */}
              <div className="md:col-span-2 p-6 sm:p-8 rounded-3xl border border-[#E5E5EA] dark:border-[#303036] bg-[#FFFFFF] dark:bg-[#17171B] space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#007AFF]/10 dark:bg-[#0A84FF]/15 text-[#007AFF] dark:text-[#0A84FF] flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  সরাসরি মানব পরামর্শক এক্সেস (Facebook Messenger)
                </h3>
                <p className="text-sm text-[#6E6E73] dark:text-[#A1A1AA] leading-relaxed">
                  এআই উত্তরের পাশাপাশি যেকোনো জটিল মানবিক সিদ্ধান্ত, বিশেষ পরিস্থিতি কিংবা ব্যক্তিগত কাউন্সেলিংয়ের জন্য সরাসরি Shadat Fatih Education Consultant এর সাথে মেসেঞ্জারে যুক্ত হওয়ার সার্বক্ষণিক ব্যবস্থা রয়েছে।
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Official Verification Policy Section */}
        <section id="trust" className="py-16 sm:py-20 border-t border-[#E5E5EA] dark:border-[#303036] bg-[#FFFFFF] dark:bg-[#17171B]/50 transition-colors">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-amber-600 dark:text-amber-400">
                <ShieldAlert className="w-4 h-4" />
                <span>ACCURACY & TRANSPARENCY</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
                স্বচ্ছতা ও সত্যতা যাচাইয়ের নীতিমালা
              </h2>
              <p className="text-sm text-[#6E6E73] dark:text-[#A1A1AA] max-w-xl mx-auto">
                আমাদের লক্ষ্য শিক্ষার্থীদের সঠিক তথ্য দিয়ে সহায়তা করা, তবে দায়িত্বশীলতার স্বার্থে কিছু বিষয় স্পষ্ট করা প্রয়োজন:
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl border border-[#E5E5EA] dark:border-[#303036] bg-[#F5F5F7] dark:bg-[#1C1C22] space-y-6">
              <div className="space-y-4 text-xs sm:text-sm text-[#1D1D1F]/90 dark:text-[#F5F5F7]/90 leading-relaxed">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <p>
                    <strong>এআই ভুল করতে পারে:</strong> আধুনিক কৃত্রিম বুদ্ধিমত্তা অত্যন্ত দ্রুত তথ্য প্রদান করলেও কোনো কোনো ক্ষেত্রে তারিখ বা সাম্প্রতিক নিয়মের পরিবর্তনে অসঙ্গতি দেখা যেতে পারে।
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <p>
                    <strong>অফিসিয়াল গেজেট বাধ্যতামূলক:</strong> ভর্তির ফি, আবেদনের শেষ তারিখ, কোটা বরাদ্দ এবং বিভাগীয় জিপিএ সংক্রান্ত চূড়ান্ত সিদ্ধান্তের ক্ষেত্রে শিক্ষার্থীকে অবশ্যই জাতীয় বিশ্ববিদ্যালয়ের অফিসিয়াল ওয়েবসাইট (
                    <a
                      href="http://app1.nu.edu.bd"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#007AFF] dark:text-[#0A84FF] underline"
                    >
                      app1.nu.edu.bd
                    </a>{' '}
                    বা{' '}
                    <a
                      href="https://www.nu.ac.bd"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#007AFF] dark:text-[#0A84FF] underline"
                    >
                      nu.ac.bd
                    </a>
                    ) অথবা নিজ কলেজের মূল নোটিশ বোর্ড যাচাই করতে হবে।
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <p>
                    <strong>বাস্তব নিষ্ঠা ও সততা:</strong> আমরা কোনো মনগড়া গ্যারান্টি, ভুয়া প্রশংসাপত্র কিংবা অসত্য সফলতার হার প্রদর্শন করি না। শিক্ষার্থীকে বাস্তবসম্মত পরামর্শ দেওয়াই SFEC-এর অঙ্গীকার।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Human Consultant Escalation Banner Section */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HumanConsultantBanner variant="banner" />
        </section>
      </main>

      {/* Footer */}
      <Footer onOpenPrivacy={() => setPrivacyOpen(true)} onOpenTerms={() => setTermsOpen(true)} />

      {/* Modals */}
      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
    </div>
  );
};

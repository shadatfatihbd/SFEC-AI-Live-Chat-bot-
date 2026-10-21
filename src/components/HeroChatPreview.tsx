import React, { useState } from 'react';
import { Bot, User, Check, Copy, ArrowRight } from 'lucide-react';
import { useRouter } from '../context/RouterContext';

interface SampleConversation {
  id: string;
  tabLabel: string;
  studentQuestion: string;
  aiResponse: string;
  keyPoints: string[];
}

const SAMPLES: SampleConversation[] = [
  {
    id: 'honours',
    tabLabel: 'অনার্স ভর্তি ২০২৬',
    studentQuestion: 'জাতীয় বিশ্ববিদ্যালয়ে অনার্স ভর্তির জন্য ন্যূনতম যোগ্যতা ও বিভাগভিত্তিক শর্ত কী?',
    aiResponse:
      'জাতীয় বিশ্ববিদ্যালয় (NU) অনার্স ১ম বর্ষে ভর্তির জন্য সাধারণত নিম্নরূপ মানদণ্ড অনুসরণ করা হয়:\n\n• বিজ্ঞান বিভাগ: এসএসসি ও এইচএসসি মিলিয়ে ন্যূনতম জিপিএ ৭.০ (উভয় পরীক্ষায় ন্যূনতম ৩.০ থাকতে হবে)।\n• ব্যবসায় শিক্ষা ও মানবিক: এসএসসি ও এইচএসসি মিলিয়ে ন্যূনতম জিপিএ ৬.৫ (উভয়টিতে ন্যূনতম ২.৫ বা ৩.০ বিজ্ঞপ্তি অনুযায়ী নির্ধারিত)।\n• চতুর্থ বিষয়সহ জিপিএ গণনা করা হয়।',
    keyPoints: ['জিপিএ শর্তাবলী', 'বিভাগভিত্তিক যোগ্যতা', 'চতুর্থ বিষয় সমন্বয়'],
  },
  {
    id: 'degree',
    tabLabel: 'ডিগ্রি (পাস) কোর্স',
    studentQuestion: 'অনার্সে চান্স না পেলে ডিগ্রি পাস কোর্সে ভর্তি হলে কি পরবর্তীতে মাস্টার্স করা সম্ভব?',
    aiResponse:
      'হ্যাঁ, অবশ্যই সম্ভব! ডিগ্রি (পাস) কোর্স সফলভাবে সম্পন্ন করার পর আপনি সরাসরি ২ বছর মেয়াদী "মাস্টার্স প্রিলিমিনারি" কোর্সে ভর্তি হতে পারবেন। এরপর প্রিলিমিনারি পাস করে মাস্টার্স ফাইনাল সম্পন্ন করতে পারবেন। শিক্ষাজীবনে কোনো বিরতি ছাড়াই এটি একটি স্বীকৃত ও নির্ভরযোগ্য শিক্ষাধারা।',
    keyPoints: ['মাস্টার্স প্রিলিমিনারি রুট', '৩ বছরের কোর্স স্ট্রাকচার', 'স্বীকৃত ক্যারিয়ার পাথ'],
  },
  {
    id: 'release_slip',
    tabLabel: 'রিলিজ স্লিপ আবেদন',
    studentQuestion: 'রিলিজ স্লিপে কতটি কলেজে আবেদন করা যায় এবং পদ্ধতি কী?',
    aiResponse:
      'জাতীয় বিশ্ববিদ্যালয়ের রিলিজ স্লিপ প্রক্রিয়ায় সাধারণত সর্বোচ্চ ৩টি থেকে ৫টি ভিন্ন ভিন্ন কলেজে পৃথক পৃথক বিষয় পছন্দক্রম দিয়ে একযোগে অনলাইনে আবেদন করা যায়। যেসব কলেজে আসন শূন্য রয়েছে কেবল সেগুলোর তালিকা প্রদর্শিত হয়। মেধার ভিত্তিতে কলেজ কর্তৃপক্ষ শিক্ষার্থী নির্বাচন করে।',
    keyPoints: ['বহু-কলেজ আবেদন সুবিধা', 'শূন্য আসন ভিত্তিক নির্বাচন', 'অনলাইন সাবমিশন'],
  },
];

export const HeroChatPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('honours');
  const [copied, setCopied] = useState<boolean>(false);
  const { navigate } = useRouter();

  const currentSample = SAMPLES.find((s) => s.id === activeTab) || SAMPLES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSample.aiResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-3xl border border-[#E5E5EA] dark:border-[#303036] bg-[#FFFFFF] dark:bg-[#17171B] shadow-xl overflow-hidden transition-all duration-300">
      {/* Top window header bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E5E5EA] dark:border-[#303036] bg-[#F5F5F7]/80 dark:bg-[#1A1A20]/80">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/80" />
          <span className="ml-2 text-xs font-medium text-[#6E6E73] dark:text-[#A1A1AA]">
            SFEC AI Live Assistant — প্রিভিউ
          </span>
        </div>

        {/* Interactive Segmented Tabs */}
        <div className="flex items-center gap-1 p-1 bg-black/5 dark:bg-white/5 rounded-lg">
          {SAMPLES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => setActiveTab(sample.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                activeTab === sample.id
                  ? 'bg-white dark:bg-[#222228] text-[#1D1D1F] dark:text-[#F5F5F7] shadow-xs'
                  : 'text-[#6E6E73] dark:text-[#A1A1AA] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7]'
              }`}
            >
              {sample.tabLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Simulated conversation body */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Student message bubble */}
        <div className="flex items-start justify-end gap-3 pl-8">
          <div className="bg-[#007AFF] text-white px-4 py-3 rounded-2xl rounded-tr-xs shadow-xs text-xs sm:text-sm leading-relaxed max-w-md">
            <p>{currentSample.studentQuestion}</p>
            <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-white/70">
              <span>শিক্ষার্থী</span>
              <span aria-hidden="true">·</span>
              <span>এখনই</span>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-[#007AFF]/20 text-[#007AFF] dark:text-[#0A84FF] flex items-center justify-center shrink-0 text-xs font-medium">
            <User className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* AI response bubble */}
        <div className="flex items-start gap-3 pr-4 sm:pr-8">
          <div className="w-7 h-7 rounded-full bg-[#5856D6]/15 dark:bg-[#5856D6]/25 text-[#5856D6] dark:text-[#9D9BFF] flex items-center justify-center shrink-0">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 bg-[#F5F5F7] dark:bg-[#222228] border border-[#E5E5EA] dark:border-[#303036] p-4 sm:p-5 rounded-2xl rounded-tl-xs space-y-3">
            <div className="flex items-center justify-between text-xs text-[#6E6E73] dark:text-[#A1A1AA] pb-1 border-b border-black/5 dark:border-white/5">
              <span className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">SFEC AI শিক্ষামূলক উত্তর</span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[11px] text-[#6E6E73] dark:text-[#A1A1AA] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors"
                title="উত্তর কপি করুন"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">কপি হয়েছে</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>কপি</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-xs sm:text-sm text-[#1D1D1F] dark:text-[#F5F5F7] whitespace-pre-line leading-relaxed">
              {currentSample.aiResponse}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-[#6E6E73] dark:text-[#A1A1AA]">
              {currentSample.keyPoints.map((pt, idx) => (
                <span key={idx} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#007AFF] dark:bg-[#0A84FF]" />
                  <span>{pt}</span>
                  {idx < currentSample.keyPoints.length - 1 && <span className="opacity-40" aria-hidden="true">·</span>}
                </span>
              ))}
            </div>

            <div className="pt-1 text-[10px] text-[#6E6E73] dark:text-[#A1A1AA] border-t border-black/5 dark:border-white/5">
              * তথ্যের সত্যতা যাচাইয়ে অফিসিয়াল সার্কুলার আবশ্যক।
            </div>
          </div>
        </div>

        {/* Live CTA link to chat */}
        <div className="pt-2 flex items-center justify-between text-xs px-2">
          <span className="text-[#6E6E73] dark:text-[#A1A1AA]">
            আপনার যেকোনো প্রশ্ন সরাসরি করতে পারেন
          </span>
          <button
            onClick={() => navigate('/chat')}
            className="inline-flex items-center gap-1 font-semibold text-[#007AFF] dark:text-[#0A84FF] hover:underline"
          >
            <span>লাইভ চ্যাটে জিজ্ঞাসা করুন</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

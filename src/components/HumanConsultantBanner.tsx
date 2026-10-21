import React from 'react';
import { MessageCircle, ArrowUpRight, UserCheck } from 'lucide-react';
import { MESSENGER_URL } from '../services/gasApi';

interface HumanConsultantBannerProps {
  variant?: 'banner' | 'card' | 'inline';
}

export const HumanConsultantBanner: React.FC<HumanConsultantBannerProps> = ({
  variant = 'banner',
}) => {
  if (variant === 'inline') {
    return (
      <a
        href={MESSENGER_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#007AFF] dark:text-[#0A84FF] bg-[#007AFF]/10 dark:bg-[#0A84FF]/15 hover:bg-[#007AFF]/20 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]"
      >
        <UserCheck className="w-3.5 h-3.5" />
        <span>মানব পরামর্শ নিন</span>
        <ArrowUpRight className="w-3 h-3 opacity-80" />
      </a>
    );
  }

  if (variant === 'card') {
    return (
      <div className="p-4 sm:p-5 rounded-2xl border border-[#E5E5EA] dark:border-[#303036] bg-[#FFFFFF] dark:bg-[#17171B] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#007AFF]/10 dark:bg-[#0A84FF]/15 flex items-center justify-center text-[#007AFF] dark:text-[#0A84FF]">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                সরাসরি মানব পরামর্শক
              </h4>
              <p className="text-[11px] text-[#6E6E73] dark:text-[#A1A1AA]">
                Shadat Fatih Education Consultant
              </p>
            </div>
          </div>
        </div>
        <p className="text-xs text-[#6E6E73] dark:text-[#A1A1AA] leading-relaxed">
          জটিল বা ব্যক্তিগত কোনো বিষয়ে সিদ্ধান্তহীনতায় থাকলে সরাসরি ফেসবুক মেসেঞ্জারে আমাদের সাথে কথা বলতে পারেন।
        </p>
        <div className="pt-1">
          <a
            href={MESSENGER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#007AFF] hover:bg-[#0062cc] dark:bg-[#0A84FF] rounded-xl shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]"
          >
            <span>মানব পরামর্শ নিন</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <p className="text-[10px] text-center text-[#6E6E73] dark:text-[#A1A1AA]">
          * এটি পৃথক মেসেঞ্জার উইন্ডো খুলবে; ওয়েবসাইটের ইতিহাস স্থানান্তর হবে না।
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#E5E5EA] dark:border-[#303036] bg-gradient-to-r from-[#FFFFFF] to-[#F5F5F7] dark:from-[#17171B] dark:to-[#1C1C22] p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#007AFF] dark:text-[#0A84FF]">
            PERSONAL CONSULTATION
          </span>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
            ব্যক্তিগত বা বিশেষ নির্দেশনায় মানব বিশেষজ্ঞের মতামত চান?
          </h3>
          <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#A1A1AA] leading-relaxed">
            জাতীয় বিশ্ববিদ্যালয়ের জটিল কোটা নিয়ম, বিষয় অগ্রাধিকার, কলেজ পরিবর্তন কিংবা মাইগ্রেশন সংক্রান্ত জটিলতায় সরাসরি Shadat Fatih Education Consultant এর সাথে ফেসবুক মেসেঞ্জারে যুক্ত হন।
          </p>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col items-start gap-2 shrink-0">
          <a
            href={MESSENGER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#007AFF] hover:bg-[#0062cc] dark:bg-[#0A84FF] rounded-full shadow-sm hover:shadow transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]"
          >
            <span>মানব পরামর্শ নিন</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
          <span className="text-[11px] text-[#6E6E73] dark:text-[#A1A1AA]">
            Facebook Messenger-এ পৃথক উইন্ডোতে ওপেন হবে
          </span>
        </div>
      </div>
    </div>
  );
};

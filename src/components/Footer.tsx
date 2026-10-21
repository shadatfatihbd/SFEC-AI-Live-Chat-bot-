import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { FACEBOOK_PAGE_URL, MESSENGER_URL } from '../services/gasApi';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenTerms }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[#E5E5EA] dark:border-[#303036] bg-[#FFFFFF] dark:bg-[#17171B] transition-colors py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#E5E5EA] dark:border-[#303036]">
          <div className="space-y-1">
            <span className="text-base font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
              SFEC AI Live Chat
            </span>
            <p className="text-xs text-[#6E6E73] dark:text-[#A1A1AA]">
              Shadat Fatih Education Consultant — বাংলাদেশের শিক্ষার্থীদের ভর্তি ও উচ্চশিক্ষা পরামর্শক প্ল্যাটফর্ম।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs text-[#6E6E73] dark:text-[#A1A1AA]">
            <a
              href={FACEBOOK_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#007AFF] dark:hover:text-[#0A84FF] transition-colors"
            >
              <span>Facebook Page</span>
              <ArrowUpRight className="w-3 h-3 opacity-70" />
            </a>
            <a
              href={MESSENGER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#007AFF] dark:hover:text-[#0A84FF] transition-colors"
            >
              <span>Facebook Messenger</span>
              <ArrowUpRight className="w-3 h-3 opacity-70" />
            </a>
            <button
              onClick={onOpenPrivacy}
              className="hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors focus-visible:outline-none focus-visible:underline"
            >
              গোপনীয়তা নীতি
            </button>
            <button
              onClick={onOpenTerms}
              className="hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors focus-visible:outline-none focus-visible:underline"
            >
              ব্যবহারের শর্তাবলী
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#6E6E73] dark:text-[#A1A1AA]">
          <p>© {currentYear} SFEC — Shadat Fatih Education Consultant. সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="max-w-xl text-[11px] leading-relaxed opacity-85">
            সতর্কবার্তা: SFEC AI একটি শিক্ষামূলক তথ্য ও দিকনির্দেশক সহায়ক ব্যবস্থা। সকল প্রকার ভর্তি বিজ্ঞপ্তি, আবেদনের তারিখ, ন্যূনতম জিপিএ ও ফি সংক্রান্ত তথ্যের জন্য সর্বদা জাতীয় বিশ্ববিদ্যালয় (nu.ac.bd) বা সংশ্লিষ্ট প্রতিষ্ঠানের মূল ওয়েবসাইট ও অফিশিয়াল গেজেট অনুসরণ করুন।
          </p>
        </div>
      </div>
    </footer>
  );
};

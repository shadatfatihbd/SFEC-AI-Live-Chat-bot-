import React, { useEffect } from 'react';
import { X, ShieldCheck, Database, Lock, Eye } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#FFFFFF] dark:bg-[#17171B] rounded-2xl shadow-2xl border border-[#E5E5EA] dark:border-[#303036] p-6 sm:p-8 space-y-6 text-[#1D1D1F] dark:text-[#F5F5F7]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5EA] dark:border-[#303036]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#007AFF] dark:text-[#0A84FF]" />
            <h2 id="privacy-modal-title" className="text-lg font-bold">
              গোপনীয়তা ও তথ্য সংরক্ষণ নীতি (Privacy Policy)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6E6E73] dark:text-[#A1A1AA] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 text-sm leading-relaxed text-[#1D1D1F]/90 dark:text-[#F5F5F7]/90">
          <p>
            SFEC AI Live Chat-এ আপনার তথ্যের নিরাপত্তা ও ব্যক্তিগত গোপনীয়তাকে সর্বোচ্চ অগ্রাধিকার প্রদান করা হয়। Shadat Fatih Education Consultant এর এই প্ল্যাটফর্মটি ব্যবহারের পূর্বে অনুগ্রহ করে নিচের তথ্যাদি মনোযোগ দিয়ে পড়ুন:
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Database className="w-4 h-4 text-[#007AFF] shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-sm">১. গুগল শিটস ও অ্যাপস স্ক্রিপ্ট ডেটা স্টোরেজ</h3>
                <p className="text-xs text-[#6E6E73] dark:text-[#A1A1AA] mt-0.5">
                  শিক্ষার্থীদের প্রশ্নের রেকর্ড ও ধারাবাহিকতা বজায় রাখার উদ্দেশ্যে কথোপকথন গুগল অ্যাপস স্ক্রিপ্ট (Google Apps Script) এর মাধ্যমে নিয়ন্ত্রিত গুগল শিটস (Google Sheets) ডেটাবেজে সংরক্ষিত হয়।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Lock className="w-4 h-4 text-[#007AFF] shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-sm">২. সংবেদনশীল তথ্যের নিরাপত্তা</h3>
                <p className="text-xs text-[#6E6E73] dark:text-[#A1A1AA] mt-0.5">
                  আমরা কোনো পাসওয়ার্ড, জাতীয় পরিচয়পত্র নম্বর বা পেমেন্ট তথ্য সংগ্রহ করি না। ব্রাউজারে একটি স্বতঃস্ফূর্ত ভিজিটর আইডি (Visitor ID) তৈরি হয় যা কেবলমাত্র সেশন ধারাবাহিকতার জন্য ব্যবহৃত হয়।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Eye className="w-4 h-4 text-[#007AFF] shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-sm">৩. কৃত্রিম বুদ্ধিমত্তা ও জেমিনাই এপিআই প্রসেসিং</h3>
                <p className="text-xs text-[#6E6E73] dark:text-[#A1A1AA] mt-0.5">
                  শিক্ষার্থীদের শিক্ষা বিষয়ক প্রশ্নের উত্তর তৈরি করতে গুগল জেমিনাই (Gemini) এআই ব্যবহার করা হয়। এপিআই কি স্ক্রিপ্ট প্রোপার্টিজে সম্পূর্ণ নিরাপদ রাখা হয়েছে এবং ব্রাউজারে কখনোই উন্মুক্ত হয় না।
                </p>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-black/[0.03] dark:bg-white/[0.03] rounded-xl border border-[#E5E5EA] dark:border-[#303036] text-xs text-[#6E6E73] dark:text-[#A1A1AA]">
            কোনো প্রশ্ন বা ডেটা রিমুভালের জন্য সরাসরি আমাদের অফিসিয়াল ফেসবুক পেজ (facebook.com/ShadatFatih.Page) অথবা মেসেঞ্জারে যোগাযোগ করুন।
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#007AFF] hover:bg-[#0062cc] dark:bg-[#0A84FF] rounded-full transition-colors"
          >
            বুঝেছি ও একমত
          </button>
        </div>
      </div>
    </div>
  );
};

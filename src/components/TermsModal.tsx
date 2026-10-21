import React, { useEffect } from 'react';
import { X, FileText, AlertTriangle, ExternalLink } from 'lucide-react';
import { MESSENGER_URL } from '../services/gasApi';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
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
      aria-labelledby="terms-modal-title"
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#FFFFFF] dark:bg-[#17171B] rounded-2xl shadow-2xl border border-[#E5E5EA] dark:border-[#303036] p-6 sm:p-8 space-y-6 text-[#1D1D1F] dark:text-[#F5F5F7]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5EA] dark:border-[#303036]">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-[#007AFF] dark:text-[#0A84FF]" />
            <h2 id="terms-modal-title" className="text-lg font-bold">
              ব্যবহারের শর্তাবলী ও সতর্কবার্তা (Terms & Disclaimer)
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

        <div className="space-y-4 text-sm leading-relaxed text-[#1D1D1F]/90 dark:text-[#F5F5F7]/90">
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>জরুরি শিক্ষামূলক অস্বীকৃতি (Educational Disclaimer)</span>
            </div>
            <p className="text-xs text-amber-900/80 dark:text-amber-200/90 leading-relaxed">
              SFEC AI একটি কৃত্রিম বুদ্ধিমত্তানির্ভর শিক্ষা ও ভর্তি পরামর্শক টুল। এটি বাংলাদেশ শিক্ষা মন্ত্রণালয় বা জাতীয় বিশ্ববিদ্যালয়ের কোনো সরকারি বা দাপ্তরিক সিদ্ধান্ত নির্ধারণকারী মাধ্যম নয়। সকল ভর্তি আবেদনের ক্ষেত্রে মূল গেজেট অনুসরণ করা বাধ্যতামূলক।
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-sm">১. অফিসিয়াল বিজ্ঞপ্তি যাচাইয়ের বাধ্যবাধকতা</h3>
              <p className="text-xs text-[#6E6E73] dark:text-[#A1A1AA] mt-1">
                ভর্তির সময়সীমা, আসন সংখ্যা, বিভাগীয় ন্যূনতম জিপিএ শর্ত এবং ফি সংক্রান্ত তথ্যসমূহ সময়ে সময়ে পরিবর্তন হতে পারে। শিক্ষার্থীকে চূড়ান্ত আবেদনপত্র জমার পূর্বে অবশ্যই জাতীয় বিশ্ববিদ্যালয়ের মূল ওয়েবসাইট (nu.ac.bd) অথবা স্ব-স্ব কলেজের আনুষ্ঠানিক নোটিশের সাথে মিলিয়ে নিতে হবে।
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-sm">২. মানব পরামর্শক (Facebook Messenger) যোগাযোগ</h3>
              <p className="text-xs text-[#6E6E73] dark:text-[#A1A1AA] mt-1">
                জটিল বা বিভ্রান্তিকর বিষয়ে শিক্ষার্থী চাইলে সরাসরি Shadat Fatih Education Consultant এর অফিসিয়াল মেসেঞ্জারে বার্তা পাঠাতে পারেন। মেসেঞ্জারে যোগাযোগ করলে তা পৃথক চ্যাট হিসেবে পরিচালিত হবে এবং ওয়েবসাইটের বার্তা স্বয়ংক্রিয়ভাবে মেসেঞ্জারে স্থানান্তরিত হবে না।
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-sm">৩. নীতিমালার গ্রহণযোগ্যতা</h3>
              <p className="text-xs text-[#6E6E73] dark:text-[#A1A1AA] mt-1">
                SFEC AI ব্যবহার করার মাধ্যমে আপনি নিশ্চিত করছেন যে কৃত্রিম বুদ্ধিমত্তার উত্তরসমূহ আপনি কেবল সহায়ক ধারণা হিসেবে বিবেচনা করবেন এবং কোনো আইনি বা সরকারি গ্যারান্টি হিসেবে গণ্য করবেন না।
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href={MESSENGER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#007AFF] dark:text-[#0A84FF] hover:underline"
          >
            <span>সরাসরি মেসেঞ্জারে কথা বলুন</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 text-xs font-semibold text-white bg-[#007AFF] hover:bg-[#0062cc] dark:bg-[#0A84FF] rounded-full transition-colors"
          >
            শর্তাবলী স্বীকার করলাম
          </button>
        </div>
      </div>
    </div>
  );
};

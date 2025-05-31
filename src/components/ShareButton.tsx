import React, { useState } from 'react';
import { Share2, Check, Copy, Link } from 'lucide-react';
import { SpendingData } from '../types/Spending';

interface ShareButtonProps {
  spending: SpendingData;
  selectedCards: string[];
}

const ShareButton: React.FC<ShareButtonProps> = ({ spending, selectedCards }) => {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const generateShareUrl = () => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams();
    
    // Add spending data
    Object.entries(spending).forEach(([key, value]) => {
      params.append(`spend_${key}`, value.toString());
    });
    
    // Add selected cards
    if (selectedCards.length > 0) {
      params.append('cards', selectedCards.join(','));
    }
    
    return `${baseUrl}?${params.toString()}`;
  };

  const handleShare = async () => {
    const shareUrl = generateShareUrl();
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setShowTooltip(true);
      setTimeout(() => {
        setCopied(false);
        setShowTooltip(false);
      }, 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition-colors"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Share Results
          </>
        )}
      </button>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded">
          Link copied!
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
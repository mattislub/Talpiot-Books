import React, { useState } from 'react';
import { Card } from '../types/Card';
import { ChevronDown, ChevronUp, ExternalLink, CreditCard, Award, Gift, DollarSign, Calculator, Clock, CreditCard as CardIcon, AlertCircle, Shield, Wallet, Building2, Sparkles, Target, Share2, Copy, Check, Info, Star, StarHalf, Scale, Percent } from 'lucide-react';

interface CardItemProps {
  card: Card;
  isFirstCard: boolean;
  onCompare?: (cardId: string) => void;
  isCompared?: boolean;
}

const CardItem: React.FC<CardItemProps> = ({ card, isFirstCard, onCompare, isCompared }) => {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'rewards' | 'benefits' | 'fees' | 'why'>('rewards');
  const [copied, setCopied] = useState(false);

  const formatCurrency = (value: number | undefined): string => {
    if (!value || value === 0) return '';
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const extractWelcomeBonusDetails = (bullets: string[]): { 
    amount: string; 
    spendRequirement?: string; 
    timeLimit?: string;
  } => {
    const bonusBullet = bullets.find(bullet => 
      bullet.toLowerCase().includes('bonus') || 
      bullet.toLowerCase().includes('earn') || 
      bullet.toLowerCase().includes('limited time')
    );

    if (!bonusBullet) return { amount: formatCurrency(card.welcomeBonus) };

    const details = {
      amount: '',
      spendRequirement: '',
      timeLimit: ''
    };

    const amountMatch = bonusBullet.match(/(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:k|,000)?\s*(?:bonus\s*)?(?:points|miles|\$)/i);
    if (amountMatch) {
      const amount = amountMatch[1].replace(/,/g, '');
      details.amount = amount.includes('k') 
        ? `${parseInt(amount) * 1000}` 
        : amount;
    }

    const spendMatch = bonusBullet.match(/spend\s*\$?(\d{1,3}(?:,\d{3})*)/i);
    if (spendMatch) {
      details.spendRequirement = spendMatch[1];
    }

    const timeMatch = bonusBullet.match(/(\d+)\s*(?:month|months|day|days)/i);
    if (timeMatch) {
      details.timeLimit = `${timeMatch[1]} ${timeMatch[0].includes('month') ? 'months' : 'days'}`;
    }

    return details;
  };

  const bonusDetails = extractWelcomeBonusDetails(card.bullets);

  const getCardStrengths = () => {
    const strengths = [];

    // Check for strong rewards rate
    const bestCategory = card.cashbackDetails?.reduce((max, current) => 
      current.rate > (max?.rate || 0) ? current : max
    );
    if (bestCategory && bestCategory.rate > 2) {
      strengths.push(`High rewards rate of ${bestCategory.rate}% on ${bestCategory.category.toLowerCase()}`);
    }

    // Check for welcome bonus
    if (card.welcomeBonus && card.welcomeBonus > 200) {
      strengths.push(`Valuable welcome bonus worth ${formatCurrency(card.welcomeBonus)}`);
    }

    // Check for no annual fee
    if (card.annualFee.includes('$0')) {
      strengths.push('No annual fee');
    } else if (card.annualFee.toLowerCase().includes('intro')) {
      strengths.push('Annual fee waived for the first year');
    }

    // Check for 0% APR
    if (card.purchaseAPR.toLowerCase().includes('0%')) {
      const months = card.purchaseAPR.match(/(\d+)\s*months/i)?.[1];
      strengths.push(`0% intro APR for ${months} months on purchases`);
    }

    return strengths;
  };

  const getValueBreakdown = () => {
    const breakdown = [];

    // Annual rewards value
    if (card.annualCashback && card.annualCashback > 0) {
      breakdown.push({
        title: 'Annual Rewards Value',
        amount: formatCurrency(card.annualCashback),
        description: 'Based on your spending patterns'
      });
    }

    // Welcome bonus
    if (card.welcomeBonus && card.welcomeBonus > 0) {
      breakdown.push({
        title: 'Welcome Bonus Value',
        amount: formatCurrency(card.welcomeBonus),
        description: `After meeting minimum spend requirement`
      });
    }

    // Annual fee
    if (card.effectiveAnnualFee && card.effectiveAnnualFee > 0) {
      breakdown.push({
        title: 'Annual Fee',
        amount: `-${formatCurrency(card.effectiveAnnualFee)}`,
        description: card.annualFee.toLowerCase().includes('intro') ? 'Waived for first year' : 'Required annual cost'
      });
    }

    // Net first-year value
    if (card.netValue) {
      breakdown.push({
        title: 'Net First-Year Value',
        amount: formatCurrency(card.netValue),
        description: 'Total value minus annual fee'
      });
    }

    return breakdown;
  };

  const getKeyBenefits = () => {
    return card.bullets
      .filter(bullet => 
        !bullet.toLowerCase().includes('earn') && 
        !bullet.toLowerCase().includes('bonus') &&
        !bullet.toLowerCase().includes('apr') &&
        !bullet.toLowerCase().includes('annual fee')
      )
      .slice(0, 3);
  };

  return (
    <div 
      className={`relative bg-gray-50 rounded-xl shadow-lg overflow-hidden transition-all duration-300 
        ${isFirstCard ? 'border-2 border-yellow-400' : 'border border-gray-200'} 
        hover:shadow-xl ${expanded ? 'transform-gpu scale-102' : ''}`}
    >
      {isFirstCard && card.netValue > 0 && (
        <div className="absolute inset-x-0 top-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-1.5 px-4 text-center text-sm font-medium">
          BEST MATCH - {formatCurrency(card.netValue)} in First Year Value
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start gap-6">
          {/* Logo Section */}
          <div className="w-48 flex-shrink-0">
            <div className="flex flex-col items-center">
              <div className="w-full h-32 bg-white rounded-lg flex items-center justify-center mb-3 relative group shadow-sm">
                <Building2 className="w-20 h-20 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
              </div>
              <button
                onClick={() => onCompare?.(card.id || '')}
                className={`w-full py-2 px-4 mb-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all
                  ${isCompared 
                    ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' 
                    : 'bg-indigo-200 text-indigo-700 hover:bg-indigo-300 hover:text-indigo-800'}`}
              >
                <Scale className="w-4 h-4" />
                {isCompared ? 'Remove Compare' : 'Compare Card'}
              </button>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-current text-yellow-400" />
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-gray-700">5.0</span>
                  <div className="group relative">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      Our rating based on rewards, benefits, and value
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {card.creditLevel}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">{card.name}</h3>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600 font-medium">{card.bank}</span>
                </div>
                <p className="text-gray-600 leading-relaxed">{card.bullets[0]}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <a
                  href={card.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-2.5 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 gap-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  APPLY NOW <ExternalLink className="h-4 w-4" />
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(card.link);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3" />
                      Link Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3 w-3" />
                      Share
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white rounded-lg p-3 space-y-1 shadow-sm">
                <span className="text-sm font-medium text-gray-700">Estimated First Year Value</span>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-600" />
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      {formatCurrency(card.netValue)}
                    </div>
                    <div className="text-gray-600 text-xs">
                      Including welcome bonus
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 space-y-1 shadow-sm">
                <span className="text-sm font-medium text-gray-700">Annual Rewards</span>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      {formatCurrency(card.annualCashback)}
                    </div>
                    <div className="text-gray-600 text-xs">
                      After first year
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 space-y-1 shadow-sm">
                <span className="text-sm font-medium text-gray-700">Welcome Bonus</span>
                <div className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-purple-600" />
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      {formatCurrency(card.welcomeBonus)}
                    </div>
                    {bonusDetails.spendRequirement && (
                      <div className="text-gray-600 text-xs">
                        Spend ${bonusDetails.spendRequirement} in {bonusDetails.timeLimit}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-6 pt-4 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors border-t border-gray-200 flex items-center justify-center gap-1"
        >
          {expanded ? (
            <>Hide Details <ChevronUp className="h-4 w-4" /></>
          ) : (
            <>View Details <ChevronDown className="h-4 w-4" /></>
          )}
        </button>
      </div>

      {expanded && (
        <div className="px-6 pb-6">
          <div className="flex border-b border-gray-200 mb-6">
            {(['rewards', 'benefits', 'fees', 'why'] as const).map((tab) => (
              <button
                key={tab}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                <div className="flex items-center gap-2">
                  {tab === 'rewards' && <Award className="h-4 w-4" />}
                  {tab === 'benefits' && <Gift className="h-4 w-4" />}
                  {tab === 'fees' && <DollarSign className="h-4 w-4" />}
                  {tab === 'why' && <Target className="h-4 w-4" />}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {activeTab === 'rewards' && (
              <div className="space-y-4">
                {card.cashbackDetails?.map((detail, index) => (
                  <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-indigo-200 transition-colors">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <span className="text-gray-700 font-medium block">
                          {detail.category}
                        </span>
                        <span className="text-sm text-gray-500 block">
                          {detail.rate}x {card.rewardType} ({(detail.rate * 0.015).toFixed(1)}¢ per $1)
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-gray-900 block">
                          {formatCurrency(detail.annualCashback)}
                        </span>
                        <span className="text-sm text-gray-500 block">per year</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'benefits' && (
              <div className="space-y-4">
                {card.bullets.map((bullet, index) => (
                  <div key={index} className="bg-white p-4 rounded-xl border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-indigo-50 rounded-lg">
                        <Sparkles className="h-4 w-4 text-indigo-600" />
                      </div>
                      <p className="text-gray-700 leading-relaxed">{bullet}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'fees' && (
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Annual Fee</h4>
                  <p className="text-lg font-semibold text-gray-900">{card.annualFee}</p>
                </div>
                
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Purchase APR</h4>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <Percent className="h-4 w-4 text-indigo-600" />
                    </div>
                    <p className="text-gray-700">{card.purchaseAPR}</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Balance Transfer APR</h4>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <Percent className="h-4 w-4 text-indigo-600" />
                    </div>
                    <p className="text-gray-700">{card.balanceTransferAPR}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'why' && (
              <div className="space-y-6">
                {/* Card Strengths */}
                <div className="bg-gradient-to-br from-indigo-50 via-white to-indigo-50 rounded-xl p-6 border border-indigo-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Target className="h-5 w-5 text-indigo-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-indigo-900">
                      Key Card Strengths
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {getCardStrengths().map((strength, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="p-1 bg-green-100 rounded-full mt-1">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <p className="text-gray-700">{strength}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Value Breakdown */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800">Value Breakdown</h4>
                  </div>
                  <div className="p-6 space-y-4">
                    {getValueBreakdown().map((item, index) => (
                      <div key={index} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div>
                          <h5 className="font-medium text-gray-900">{item.title}</h5>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                        <span className={`text-lg font-semibold ${
                          item.amount.startsWith('-') ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {item.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Benefits */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800">Notable Benefits</h4>
                  </div>
                  <div className="p-6 space-y-4">
                    {getKeyBenefits().map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                          <Gift className="h-4 w-4 text-indigo-600" />
                        </div>
                        <p className="text-gray-700">{benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-yellow-800">
                        These recommendations are based on your spending patterns and current card offers. 
                        Always review the full terms and conditions before applying. Card offers and terms 
                        are subject to change.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardItem;
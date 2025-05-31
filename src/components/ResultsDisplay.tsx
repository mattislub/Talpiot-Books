import React, { useState } from 'react';
import { Card } from '../types/Card';
import { SpendingData } from '../types/Spending';
import CardItem from './CardItem';
import { ChevronDown, ChevronUp, ArrowUpDown, TrendingUp, Filter, Sparkles, Info } from 'lucide-react';
import ShareButton from './ShareButton';
import ComparisonPopup from './ComparisonPopup';

interface ResultsDisplayProps {
  cards: Card[];
  loading: boolean;
  error: string | null;
  spending: SpendingData;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  cards, 
  loading, 
  error,
  spending 
}) => {
  const [sortBy, setSortBy] = useState<'value' | 'cashback' | 'fee' | 'bonus'>('value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [visibleCards, setVisibleCards] = useState(5);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [isComparisonExpanded, setIsComparisonExpanded] = useState(true);
  const [showDetailedComparison, setShowDetailedComparison] = useState(false);

  const handleSort = (criteria: 'value' | 'cashback' | 'fee' | 'bonus') => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criteria);
      setSortOrder('desc');
    }
  };

  const handleCompare = (cardId: string) => {
    setSelectedCards(prev => {
      if (prev.includes(cardId)) {
        return prev.filter(id => id !== cardId);
      }
      if (prev.length < 3) {
        return [...prev, cardId];
      }
      return prev;
    });
  };

  const handleCloseComparison = () => {
    setSelectedCards([]);
  };

  const selectedCardObjects = selectedCards.map(id => 
    cards.find(card => card.id === id)
  ).filter((card): card is Card => card !== undefined);

  const sortedCards = [...cards].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'value':
        comparison = (a.netValue || 0) - (b.netValue || 0);
        break;
      case 'cashback':
        comparison = (a.annualCashback || 0) - (b.annualCashback || 0);
        break;
      case 'fee':
        comparison = (a.effectiveAnnualFee || 0) - (b.effectiveAnnualFee || 0);
        break;
      case 'bonus':
        comparison = (a.welcomeBonus || 0) - (b.welcomeBonus || 0);
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const totalMonthlySpend = Object.values(spending).reduce((sum, value) => sum + value, 0);

  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Calculating Best Cards...</h2>
        <div className="grid grid-cols-1 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-24 bg-gray-200 rounded mb-4"></div>
              <div className="h-12 bg-gray-200 rounded mb-3"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Cards</h2>
        <p className="text-red-600">{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 w-full pb-32">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-blue-600 text-center">
              Your Top Credit Card Matches
            </h2>
          </div>
          <p className="text-lg text-blue-600 mb-4">
            Based on your {totalMonthlySpend.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} monthly spending
          </p>
          
          <div className="flex items-center gap-4 mb-6">
            <ShareButton spending={spending} selectedCards={selectedCards} />
            
            <div className="flex flex-wrap gap-2">
              <button 
                className={`px-3 py-1.5 text-sm rounded-full flex items-center gap-1 ${
                  sortBy === 'value' 
                    ? 'bg-indigo-100 text-indigo-800 font-medium' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => handleSort('value')}
              >
                First Year Value
                {sortBy === 'value' && (
                  sortOrder === 'desc' ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />
                )}
                {sortBy !== 'value' && <ArrowUpDown className="h-3 w-3" />}
              </button>
              
              <button 
                className={`px-3 py-1.5 text-sm rounded-full flex items-center gap-1 ${
                  sortBy === 'cashback' 
                    ? 'bg-indigo-100 text-indigo-800 font-medium' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => handleSort('cashback')}
              >
                Annual Rewards
                {sortBy === 'cashback' && (
                  sortOrder === 'desc' ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />
                )}
                {sortBy !== 'cashback' && <ArrowUpDown className="h-3 w-3" />}
              </button>
              
              <button 
                className={`px-3 py-1.5 text-sm rounded-full flex items-center gap-1 ${
                  sortBy === 'bonus' 
                    ? 'bg-indigo-100 text-indigo-800 font-medium' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => handleSort('bonus')}
              >
                Welcome Bonus
                {sortBy === 'bonus' && (
                  sortOrder === 'desc' ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />
                )}
                {sortBy !== 'bonus' && <ArrowUpDown className="h-3 w-3" />}
              </button>
              
              <button 
                className={`px-3 py-1.5 text-sm rounded-full flex items-center gap-1 ${
                  sortBy === 'fee' 
                    ? 'bg-indigo-100 text-indigo-800 font-medium' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => handleSort('fee')}
              >
                Annual Fee
                {sortBy === 'fee' && (
                  sortOrder === 'desc' ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />
                )}
                {sortBy !== 'fee' && <ArrowUpDown className="h-3 w-3" />}
              </button>
            </div>
          </div>
        </div>

        {totalMonthlySpend === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">Enter Your Spending</h3>
            <p className="text-yellow-700">
              Enter your monthly spending in the form above to see personalized card recommendations.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
              {sortedCards.slice(0, visibleCards).map((card, index) => (
                <CardItem 
                  key={card.id} 
                  card={card} 
                  isFirstCard={index === 0} 
                  onCompare={handleCompare}
                  isCompared={selectedCards.includes(card.id || '')}
                />
              ))}
            </div>

            {visibleCards < sortedCards.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setVisibleCards(prev => prev + 5)}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors font-medium"
                >
                  Show More Cards
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            )}
            
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">How We Calculate Value</h3>
              <p className="text-blue-800 leading-relaxed">
                Our algorithm analyzes your spending patterns across all categories and calculates the total rewards value based on each card's reward rates. We factor in sign-up bonuses (for first year value), subtract annual fees, and consider the actual dollar value of points/miles based on typical redemption rates.
              </p>
            </div>
          </div>
        )}
      </div>

      <ComparisonPopup
        selectedCards={selectedCardObjects}
        onClose={handleCloseComparison}
        onRemoveCard={handleCompare}
        isExpanded={isComparisonExpanded}
        showDetailed={showDetailedComparison}
        onToggleExpand={() => setShowDetailedComparison(!showDetailedComparison)}
      />
    </>
  );
};

export default ResultsDisplay;
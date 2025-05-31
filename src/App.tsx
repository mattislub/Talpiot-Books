import React, { useState, useEffect } from 'react';
import { parseCards } from './utils/cardParser';
import { Card } from './types/Card';
import SpendingForm from './components/SpendingForm';
import ResultsDisplay from './components/ResultsDisplay';
import { SpendingData } from './types/Spending';
import Header from './components/Header';
import Footer from './components/Footer';
import { calculateCardValue } from './utils/rewardsCalculator';
import FilterSidebar from './components/FilterSidebar';
import { filterCards } from './utils/filterCards';

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [spending, setSpending] = useState<SpendingData>({
    dining: 0,
    groceries: 0,
    gas: 0,
    travel: 0,
    streaming: 0,
    other: 0,
  });
  const [calculatedCards, setCalculatedCards] = useState<Card[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  useEffect(() => {
    // Parse URL parameters on load
    const params = new URLSearchParams(window.location.search);
    const spendingFromUrl: Partial<SpendingData> = {};
    
    // Extract spending values
    Object.keys(spending).forEach(key => {
      const value = params.get(`spend_${key}`);
      if (value) {
        spendingFromUrl[key as keyof SpendingData] = parseFloat(value);
      }
    });
    
    // Update spending if URL parameters exist
    if (Object.keys(spendingFromUrl).length > 0) {
      setSpending(prev => ({ ...prev, ...spendingFromUrl }));
    }

    const fetchCards = async () => {
      try {
        setLoading(true);
        const cardData = await parseCards();
        setCards(cardData);
        setCalculatedCards(
          cardData.map(card => calculateCardValue(card, spending))
            .sort((a, b) => b.calculatedValue - a.calculatedValue)
        );
      } catch (err) {
        setError('Failed to load card data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  useEffect(() => {
    if (cards.length > 0) {
      const calculated = cards.map(card => calculateCardValue(card, spending))
        .sort((a, b) => b.calculatedValue - a.calculatedValue);
      const filtered = filterCards(calculated, selectedFilters);
      setCalculatedCards(filtered);
    }
  }, [spending, cards, selectedFilters]);

  const handleSpendingChange = (newSpending: SpendingData) => {
    setSpending(newSpending);
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Credit Card Rewards Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter your monthly spending to find the most rewarding credit cards. We'll calculate 
            potential rewards based on your spending habits and show you the best options.
          </p>
        </div>
        
        <SpendingForm spending={spending} onSpendingChange={handleSpendingChange} />
        
        <div className="flex gap-8 mt-12">
          <FilterSidebar 
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />
          <div className="flex-1">
            <ResultsDisplay 
              cards={calculatedCards} 
              loading={loading} 
              error={error} 
              spending={spending}
            />
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500 max-w-2xl mx-auto">
          <p className="mb-2">
            * Calculations are estimates based on the information provided. Actual rewards may vary.
          </p>
          <p>
            Always review the full terms and conditions before applying for a credit card.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
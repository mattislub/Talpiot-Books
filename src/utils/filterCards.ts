import { Card } from '../types/Card';

export const filterCards = (cards: Card[], selectedFilters: string[]): Card[] => {
  if (selectedFilters.length === 0) return cards;

  return cards.filter(card => {
    return selectedFilters.every(filter => {
      // Helper function to check if any bullet point contains all keywords
      const hasBenefit = (keywords: string[]): boolean => {
        return card.bullets?.some(bullet => 
          keywords.every(keyword => 
            bullet.toLowerCase().includes(keyword.toLowerCase())
          )
        ) || false;
      };

      switch (filter) {
        // Card Benefits
        case 'rental-car-insurance':
          return hasBenefit(['rental', 'car', 'insurance']);
        case 'flight-delay-protection':
          return hasBenefit(['flight', 'delay']);
        case 'baggage-delay-coverage':
          return hasBenefit(['baggage', 'delay']);
        case 'airport-lounge-access':
          return hasBenefit(['airport', 'lounge']);
        case 'purchase-protection':
          return hasBenefit(['purchase', 'protection']);
        case 'return-protection':
          return hasBenefit(['return', 'protection']);
        case 'price-protection':
          return hasBenefit(['price', 'protection']);
        case 'extended-warranty':
          return hasBenefit(['extended', 'warranty']);
        case 'anniversary-bonus':
          return hasBenefit(['anniversary']);
        case 'cell-phone-protection':
          return hasBenefit(['cell', 'phone', 'protection']);
        case 'global-entry-tsa':
          return hasBenefit(['global entry']) || hasBenefit(['tsa']);
        case 'lost-luggage-insurance':
          return hasBenefit(['lost', 'luggage']);
        case 'lounge-access':
          return hasBenefit(['lounge']);
        case 'no-foreign-transaction-fee':
          return hasBenefit(['foreign', 'transaction']);
        case 'travel-accident-insurance':
          return hasBenefit(['travel', 'accident']);
        case 'travel-medical-insurance':
          return hasBenefit(['travel', 'medical']);
        case 'trip-cancellation-insurance':
          return hasBenefit(['trip', 'cancellation']);
        case 'trip-delay-insurance':
          return hasBenefit(['trip', 'delay']);

        // Interest Rates
        case 'zero-apr-purchase':
          return (card.purchaseAPR?.toLowerCase() || '').includes('0%');
        case 'low-interest':
          return parseFloat(card.purchaseAPR || '100') < 18;

        // Balance Transfers
        case 'zero-apr-transfer':
          return (card.balanceTransferAPR?.toLowerCase() || '').includes('0%');
        case 'no-transfer-fee':
          return hasBenefit(['balance', 'transfer', 'fee']);

        // Annual Fee
        case 'no-annual-fee':
          return card.annualFee === '$0';
        case 'no-first-year-fee':
          return (card.annualFee?.toLowerCase() || '').includes('intro') || 
                 (card.annualFee?.toLowerCase() || '').includes('first year');

        // Card Types
        case 'personal':
        case 'business':
        case 'student':
        case 'secured':
          return card.cardType === filter;

        // Networks and Banks
        case 'visa':
        case 'mastercard':
        case 'amex':
          return (card.network?.toLowerCase() || '') === filter;
        case 'chase':
        case 'wells-fargo':
        case 'capital-one':
        case 'boa':
        case 'citi':
          return (card.bank?.toLowerCase() || '').includes(filter);

        // Credit Level
        case 'excellent-good':
          return (card.creditLevel?.toLowerCase() || '').includes('excellent') || 
                 (card.creditLevel?.toLowerCase() || '').includes('good');
        case 'limited':
          return (card.creditLevel?.toLowerCase() || '').includes('limited');
        case 'bad':
          return (card.creditLevel?.toLowerCase() || '').includes('bad');

        // Rewards
        case 'cashback':
          return hasBenefit(['cash', 'back']);
        case 'travel':
          return hasBenefit(['travel']) || hasBenefit(['miles']);
        case 'points':
          return hasBenefit(['points']);

        // Signup Bonus
        case 'signup-bonus':
          return card.welcomeBonus !== undefined && card.welcomeBonus > 0;

        default:
          return true;
      }
    });
  });
};
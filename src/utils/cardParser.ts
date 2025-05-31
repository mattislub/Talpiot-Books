import { Card } from '../types/Card';

// Fallback data when API is unavailable
const fallbackCards: Card[] = [
  {
    id: '1',
    name: 'Chase Freedom Unlimited',
    bank: 'Chase',
    link: 'https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited',
    purchaseAPR: '19.74% - 28.49% Variable',
    balanceTransferAPR: '19.74% - 28.49% Variable',
    annualFee: '$0',
    creditLevel: 'Good to Excellent',
    bullets: [
      'Earn unlimited 1.5% cash back on all purchases',
      'Earn 3% cash back at restaurants and drugstores',
      'Earn 5% cash back on travel purchased through Chase Ultimate Rewards®',
      'No minimum to redeem for cash back',
      'No annual fee'
    ],
    calculatedValue: 0,
    cardType: 'personal',
    network: 'visa',
    features: [
      'Earn unlimited 1.5% cash back on all purchases',
      'Earn 3% cash back at restaurants and drugstores',
      'Earn 5% cash back on travel purchased through Chase Ultimate Rewards®',
      'No minimum to redeem for cash back',
      'No annual fee'
    ],
    rewardType: 'cashback'
  },
  {
    id: '2',
    name: 'Citi Double Cash Card',
    bank: 'Citi',
    link: 'https://www.citi.com/credit-cards/citi-double-cash-credit-card',
    purchaseAPR: '18.74% - 28.74% Variable',
    balanceTransferAPR: '18.74% - 28.74% Variable',
    annualFee: '$0',
    creditLevel: 'Good to Excellent',
    bullets: [
      'Earn 2% on every purchase - 1% when you buy and 1% when you pay',
      'No categories to track',
      'No annual fee',
      'Flexible redemption options'
    ],
    calculatedValue: 0,
    cardType: 'personal',
    network: 'mastercard',
    features: [
      'Earn 2% on every purchase - 1% when you buy and 1% when you pay',
      'No categories to track',
      'No annual fee',
      'Flexible redemption options'
    ],
    rewardType: 'cashback'
  }
];

const STORAGE_KEY = 'credit_cards_data';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const getStoredCards = (): { cards: Card[], timestamp: number } | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.warn('Failed to parse stored cards:', error);
    return null;
  }
};

const storeCards = (cards: Card[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      cards,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('Failed to store cards in localStorage:', error);
  }
};

const isStoredDataValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_DURATION;
};

export const parseCards = async (): Promise<Card[]> => {
  // Check localStorage first
  const storedData = getStoredCards();
  if (storedData && isStoredDataValid(storedData.timestamp)) {
    console.log('Using cached card data');
    return storedData.cards;
  }

  try {
    const response = await fetch('/api/cards');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

    const cardElements = Array.from(xmlDoc.getElementsByTagName('card'));

    const cards: Card[] = cardElements.map((el, index) => {
      const get = (tag: string) => el.getElementsByTagName(tag)?.[0]?.textContent?.trim() || '';

      // Collect all bullet points
      const bullets: string[] = [];
      for (let i = 1; i <= 12; i++) {
        const bullet = get(`bullet${i}`);
        if (bullet) bullets.push(bullet);
      }

      // Determine card type based on name/bullets
      const name = get('name').toLowerCase();
      let cardType: 'personal' | 'business' | 'student' | 'secured' = 'personal';
      if (name.includes('business')) cardType = 'business';
      if (name.includes('student')) cardType = 'student';
      if (name.includes('secured')) cardType = 'secured';

      // Determine network based on name
      let network = '';
      if (name.includes('visa')) network = 'visa';
      if (name.includes('mastercard')) network = 'mastercard';
      if (name.includes('amex') || name.includes('american express')) network = 'amex';
      if (name.includes('discover')) network = 'discover';

      // Determine reward type based on bullets
      let rewardType: 'points' | 'miles' | 'cashback' = 'cashback';
      const bulletText = bullets.join(' ').toLowerCase();
      if (bulletText.includes('thankyou') || bulletText.includes('points')) rewardType = 'points';
      if (bulletText.includes('miles')) rewardType = 'miles';

      return {
        id: `${index + 1}`,
        name: get('name'),
        bank: get('bank'),
        link: get('link'),
        purchaseAPR: get('purchaseAPR'),
        balanceTransferAPR: get('balanceTransferAPR'),
        annualFee: get('annualFee'),
        creditLevel: get('creditLevel'),
        bullets,
        calculatedValue: 0,
        cardType,
        network,
        features: bullets,
        rewardType
      };
    });

    if (cards.length > 0) {
      // Store the fetched cards in localStorage
      storeCards(cards);
      return cards;
    }

    console.warn('No cards found in API response, using fallback data');
    return fallbackCards;
  } catch (error) {
    console.warn('Failed to fetch or parse cards from API, using fallback data:', error);
    return fallbackCards;
  }
};
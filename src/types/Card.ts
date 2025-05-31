export interface Card {
  id?: string;
  name: string;
  bank: string;
  link: string;
  purchaseAPR: string;
  balanceTransferAPR: string;
  annualFee: string;
  creditLevel: string;
  bullets: string[];
  cardType: 'personal' | 'business' | 'student' | 'secured';
  network: string;
  features: string[];
  
  // Calculated fields
  calculatedValue: number;
  cashbackDetails?: {
    category: string;
    rate: number;
    monthlySpend: number;
    annualCashback: number;
    pointsEarned?: number; // New field for points earned
  }[];
  annualCashback?: number;
  welcomeBonus?: number;
  effectiveAnnualFee?: number;
  netValue?: number;
  
  // New fields for points/miles
  pointsEarned?: number; // Total points earned annually
  bonusPoints?: number; // Welcome bonus in points
  rewardType?: 'points' | 'miles' | 'cashback';
}
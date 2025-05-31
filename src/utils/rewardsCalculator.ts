import { Card } from '../types/Card';
import { SpendingData } from '../types/Spending';

const POINT_VALUES = {
  'Chase Ultimate Rewards': 0.015, // 1.5 cents per point
  'American Express Membership Rewards': 0.012, // 1.2 cents per point
  'Capital One Miles': 0.011, // 1.1 cents per point
  'Citi ThankYou Points': 0.01, // 1.0 cents per point
  'Hotel Points': 0.01, // 1.0 cents per point
  'Airline Miles': 0.014, // 1.4 cents per point
  'Cash Back': 0.01 // 1.0 cents per dollar (baseline)
};

export const calculateCardValue = (card: Card, spending: SpendingData): Card => {
  // Calculate total monthly spending
  const totalMonthlySpend = Object.values(spending).reduce((sum, value) => sum + value, 0);
  
  // Extract annual fee
  const annualFeeMatch = card.annualFee.match(/\$(\d+)/);
  const annualFee = annualFeeMatch ? parseInt(annualFeeMatch[1]) : 0;
  
  let cashbackDetails = [];
  let annualCashback = 0;
  let welcomeBonus = 0;
  let pointsEarned = 0;
  let bonusPoints = 0;
  let rewardType: 'points' | 'miles' | 'cashback' = 'cashback';
  
  switch (card.id) {
    case '1': // United Explorer Card
      rewardType = 'miles';
      const unitedPoints = spending.travel * 2 * 12; // 2x on United purchases
      const diningPoints = spending.dining * 2 * 12; // 2x on dining
      const hotelPoints = spending.travel * 2 * 12; // 2x on hotels
      const otherPoints = (spending.groceries + spending.gas + spending.streaming + spending.other) * 1 * 12; // 1x on everything else
      
      pointsEarned = unitedPoints + diningPoints + hotelPoints + otherPoints;
      bonusPoints = 60000; // 60,000 mile bonus
      
      annualCashback = pointsEarned * POINT_VALUES['Airline Miles'];
      welcomeBonus = bonusPoints * POINT_VALUES['Airline Miles'];
      
      cashbackDetails = [
        {
          category: 'United Purchases',
          rate: 2,
          monthlySpend: spending.travel,
          pointsEarned: unitedPoints,
          annualCashback: unitedPoints * POINT_VALUES['Airline Miles']
        },
        {
          category: 'Dining',
          rate: 2,
          monthlySpend: spending.dining,
          pointsEarned: diningPoints,
          annualCashback: diningPoints * POINT_VALUES['Airline Miles']
        },
        {
          category: 'Hotels',
          rate: 2,
          monthlySpend: spending.travel,
          pointsEarned: hotelPoints,
          annualCashback: hotelPoints * POINT_VALUES['Airline Miles']
        },
        {
          category: 'Other Purchases',
          rate: 1,
          monthlySpend: spending.groceries + spending.gas + spending.streaming + spending.other,
          pointsEarned: otherPoints,
          annualCashback: otherPoints * POINT_VALUES['Airline Miles']
        }
      ];
      break;
      
    case '2': // Chase Sapphire Preferred
      rewardType = 'points';
      const travelPoints = spending.travel * 5 * 12; // 5x on Chase travel
      const diningPoints2 = spending.dining * 3 * 12; // 3x on dining
      const streamingPoints = spending.streaming * 3 * 12; // 3x on streaming
      const groceryPoints = spending.groceries * 3 * 12; // 3x on online groceries
      const otherTravelPoints = spending.travel * 2 * 12; // 2x on other travel
      const otherPoints2 = spending.other * 1 * 12; // 1x on everything else
      
      pointsEarned = travelPoints + diningPoints2 + streamingPoints + groceryPoints + otherTravelPoints + otherPoints2;
      bonusPoints = 60000; // 60,000 point bonus
      
      annualCashback = pointsEarned * POINT_VALUES['Chase Ultimate Rewards'];
      welcomeBonus = bonusPoints * POINT_VALUES['Chase Ultimate Rewards'];
      
      cashbackDetails = [
        {
          category: 'Chase Travel',
          rate: 5,
          monthlySpend: spending.travel,
          pointsEarned: travelPoints,
          annualCashback: travelPoints * POINT_VALUES['Chase Ultimate Rewards']
        },
        {
          category: 'Dining',
          rate: 3,
          monthlySpend: spending.dining,
          pointsEarned: diningPoints2,
          annualCashback: diningPoints2 * POINT_VALUES['Chase Ultimate Rewards']
        },
        {
          category: 'Streaming',
          rate: 3,
          monthlySpend: spending.streaming,
          pointsEarned: streamingPoints,
          annualCashback: streamingPoints * POINT_VALUES['Chase Ultimate Rewards']
        },
        {
          category: 'Online Groceries',
          rate: 3,
          monthlySpend: spending.groceries,
          pointsEarned: groceryPoints,
          annualCashback: groceryPoints * POINT_VALUES['Chase Ultimate Rewards']
        },
        {
          category: 'Other Travel',
          rate: 2,
          monthlySpend: spending.travel,
          pointsEarned: otherTravelPoints,
          annualCashback: otherTravelPoints * POINT_VALUES['Chase Ultimate Rewards']
        },
        {
          category: 'Other Purchases',
          rate: 1,
          monthlySpend: spending.other,
          pointsEarned: otherPoints2,
          annualCashback: otherPoints2 * POINT_VALUES['Chase Ultimate Rewards']
        }
      ];
      break;
      
    case '3': // Blue Cash Everyday
      rewardType = 'cashback';
      const groceryCashback3 = Math.min(spending.groceries * 12, 6000) * 0.03; // 3% up to $6,000
      const remainingGroceries3 = Math.max(0, spending.groceries * 12 - 6000) * 0.01;
      const onlineRetailCashback = Math.min(spending.other * 12 * 0.5, 6000) * 0.03; // Assuming 50% of other spending is online retail
      const remainingOnlineRetail = Math.max(0, spending.other * 12 * 0.5 - 6000) * 0.01;
      const gasCashback3 = Math.min(spending.gas * 12, 6000) * 0.03;
      const remainingGas3 = Math.max(0, spending.gas * 12 - 6000) * 0.01;
      const otherCashback3 = (spending.dining + spending.travel + spending.streaming + spending.other * 0.5) * 0.01 * 12;
      
      annualCashback = groceryCashback3 + remainingGroceries3 + onlineRetailCashback + remainingOnlineRetail + gasCashback3 + remainingGas3 + otherCashback3;
      welcomeBonus = 200;
      
      cashbackDetails = [
        {
          category: 'U.S. Supermarkets',
          rate: 3,
          monthlySpend: spending.groceries,
          annualCashback: groceryCashback3 + remainingGroceries3
        },
        {
          category: 'U.S. Online Retail',
          rate: 3,
          monthlySpend: spending.other * 0.5,
          annualCashback: onlineRetailCashback + remainingOnlineRetail
        },
        {
          category: 'U.S. Gas Stations',
          rate: 3,
          monthlySpend: spending.gas,
          annualCashback: gasCashback3 + remainingGas3
        },
        {
          category: 'Other Purchases',
          rate: 1,
          monthlySpend: spending.dining + spending.travel + spending.streaming + spending.other * 0.5,
          annualCashback: otherCashback3
        }
      ];
      break;
      
    case '4': // Blue Cash Preferred
      rewardType = 'cashback';
      const groceryCashback6 = Math.min(spending.groceries * 12, 6000) * 0.06;
      const remainingGroceries6 = Math.max(0, spending.groceries * 12 - 6000) * 0.01;
      const streamingCashback6 = spending.streaming * 0.06 * 12;
      const transitCashback = (spending.gas + spending.other * 0.1) * 0.03 * 12; // Assuming 10% of other spending is transit
      const otherCashback6 = (spending.dining + spending.travel + spending.other * 0.9) * 0.01 * 12;
      
      annualCashback = groceryCashback6 + remainingGroceries6 + streamingCashback6 + transitCashback + otherCashback6;
      welcomeBonus = 250;
      
      cashbackDetails = [
        {
          category: 'U.S. Supermarkets',
          rate: 6,
          monthlySpend: spending.groceries,
          annualCashback: groceryCashback6 + remainingGroceries6
        },
        {
          category: 'U.S. Streaming',
          rate: 6,
          monthlySpend: spending.streaming,
          annualCashback: streamingCashback6
        },
        {
          category: 'Transit & Gas',
          rate: 3,
          monthlySpend: spending.gas + spending.other * 0.1,
          annualCashback: transitCashback
        },
        {
          category: 'Other Purchases',
          rate: 1,
          monthlySpend: spending.dining + spending.travel + spending.other * 0.9,
          annualCashback: otherCashback6
        }
      ];
      break;
      
    default:
      rewardType = 'cashback';
      cashbackDetails = [{
        category: 'All purchases',
        rate: 1,
        monthlySpend: totalMonthlySpend,
        annualCashback: totalMonthlySpend * 0.01 * 12
      }];
      annualCashback = totalMonthlySpend * 0.01 * 12;
      welcomeBonus = 0;
  }
  
  const netValue = annualCashback + welcomeBonus - annualFee;
  
  return {
    ...card,
    cashbackDetails,
    annualCashback,
    welcomeBonus,
    effectiveAnnualFee: annualFee,
    netValue,
    calculatedValue: netValue,
    pointsEarned,
    bonusPoints,
    rewardType
  };
};
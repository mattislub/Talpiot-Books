import React, { useState, useEffect } from 'react';
import { SpendingData } from '../types/Spending';
import { 
  DollarSign, 
  Info,
  Utensils,
  ShoppingCart, 
  Car,
  Plane,
  MonitorPlay,
  Package2
} from 'lucide-react';
import Tooltip from './Tooltip';

interface SpendingFormProps {
  spending: SpendingData;
  onSpendingChange: (spending: SpendingData) => void;
}

const SpendingForm: React.FC<SpendingFormProps> = ({ spending, onSpendingChange }) => {
  const [localSpending, setLocalSpending] = useState<SpendingData>(spending);
  const [totalMonthly, setTotalMonthly] = useState<number>(0);
  const [totalAnnual, setTotalAnnual] = useState<number>(0);

  useEffect(() => {
    const total = Object.values(localSpending).reduce((sum, value) => sum + value, 0);
    setTotalMonthly(total);
    setTotalAnnual(total * 12);
  }, [localSpending]);

  const handleInputChange = (category: keyof SpendingData, value: string) => {
    const numValue = value === '' ? 0 : Math.max(0, parseFloat(value));
    const newSpending = { ...localSpending, [category]: numValue };
    setLocalSpending(newSpending);
    onSpendingChange(newSpending);
  };

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const categories = [
    {
      id: 'dining',
      label: 'Dining & Restaurants',
      tooltip: 'Include all restaurant spending, food delivery, and coffee shops',
      icon: Utensils
    },
    {
      id: 'groceries',
      label: 'Groceries & Supermarkets',
      tooltip: 'Grocery stores and supermarkets, not including warehouse clubs in some cases',
      icon: ShoppingCart
    },
    {
      id: 'gas',
      label: 'Gas & Transit',
      tooltip: 'Gas stations, public transit, ridesharing, parking, and tolls',
      icon: Car
    },
    {
      id: 'travel',
      label: 'Travel',
      tooltip: 'Airlines, hotels, car rentals, cruises, and travel agencies',
      icon: Plane
    },
    {
      id: 'streaming',
      label: 'Streaming & Subscriptions',
      tooltip: 'Streaming services, subscription boxes, and digital content',
      icon: MonitorPlay
    },
    {
      id: 'other',
      label: 'Everything Else',
      tooltip: 'All other spending not included in the categories above',
      icon: Package2
    }
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-indigo-50 rounded-xl shadow-lg p-8 mb-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Enter Your Monthly Spending</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Enter your average monthly spending in each category to calculate potential rewards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map(({ id, label, tooltip, icon: Icon }) => (
          <div key={id} className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor={id} className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Icon className="h-4 w-4 text-gray-500" />
                {label}
                <Tooltip content={tooltip}>
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                </Tooltip>
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name={id}
                id={id}
                min="0"
                value={localSpending[id as keyof SpendingData] || ''}
                onChange={(e) => handleInputChange(id as keyof SpendingData, e.target.value)}
                className="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
                placeholder="0"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-6 border-t border-gray-200">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600 font-medium">Total Monthly Spending:</span>
            <span className="text-xl font-bold text-gray-800">{formatCurrency(totalMonthly)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Total Annual Spending:</span>
            <span className="text-xl font-bold text-indigo-600">{formatCurrency(totalAnnual)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendingForm;
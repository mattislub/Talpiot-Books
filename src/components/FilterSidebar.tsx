import React from 'react';
import { 
  Filter, 
  Info,
  Search, 
  CreditCard, 
  Sparkles,
  Shield,
  Wallet,
  Gift,
  DollarSign,
  Percent,
  ArrowLeftRight,
  Globe,
  UserCheck,
  Building2,
  Network,
  Award,
  BadgeCheck
} from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  subOptions?: string[];
  description?: string;
}

interface FilterGroup {
  id: string;
  title: string;
  description?: string;
  options: FilterOption[];
  icon: React.ReactNode;
}

interface FilterSidebarProps {
  selectedFilters: string[];
  onFilterChange: (filter: string) => void;
}

const filterGroups: FilterGroup[] = [
  {
    id: 'rewards',
    title: 'Rewards',
    icon: <Wallet className="h-5 w-5 text-indigo-600" />,
    options: [
      { id: 'cashback', label: 'Cash Back' },
      { id: 'travel', label: 'Travel Rewards' },
      { id: 'points', label: 'Points' }
    ]
  },
  {
    id: 'bonus',
    title: 'Bonus',
    icon: <Gift className="h-5 w-5 text-indigo-600" />,
    options: [
      { id: 'signup-bonus', label: 'Sign-up Bonus' }
    ]
  },
  {
    id: 'annual-fee',
    title: 'Annual Fee',
    icon: <DollarSign className="h-5 w-5 text-indigo-600" />,
    options: [
      { id: 'no-annual-fee', label: 'No Annual Fee' },
      { id: 'no-first-year-fee', label: 'No Annual Fee 1st Year' }
    ]
  },
  {
    id: 'interest',
    title: 'Low Interest',
    icon: <Percent className="h-5 w-5 text-indigo-600" />,
    description: 'Find cards with introductory 0% APR offers or low ongoing interest rates',
    options: [
      { 
        id: 'zero-apr-purchase', 
        label: '0% APR on Purchase',
        description: 'Cards offering 0% intro APR on purchases'
      },
      { 
        id: 'low-interest', 
        label: 'Low Interest',
        description: 'Cards with lower than average ongoing APR'
      }
    ]
  },
  {
    id: 'balance-transfer',
    title: 'Balance Transfers',
    icon: <ArrowLeftRight className="h-5 w-5 text-indigo-600" />,
    description: 'Save money by transferring high-interest debt',
    options: [
      { 
        id: 'zero-apr-transfer', 
        label: '0% APR on Balance Transfer',
        description: 'Transfer balances with no interest for an intro period'
      },
      { 
        id: 'no-transfer-fee', 
        label: 'No Balance Transfer Fee',
        description: 'Avoid the typical 3-5% balance transfer fee'
      }
    ]
  },
  {
    id: 'foreign-transaction',
    title: 'Foreign Transaction Fee',
    icon: <Globe className="h-5 w-5 text-indigo-600" />,
    options: [
      { id: 'no-foreign-transaction-fee', label: 'No Foreign Transaction Fee' }
    ]
  },
  {
    id: 'card-type',
    title: 'Card Type',
    icon: <CreditCard className="h-5 w-5 text-indigo-600" />,
    options: [
      {
        id: 'personal', label: 'Personal'
      },
      {
        id: 'business', label: 'Business'
      },
      {
        id: 'student', label: 'Student'
      },
      {
        id: 'secured', label: 'Secured'
      }
    ]
  },
  {
    id: 'network',
    title: 'Network or Issuing Bank',
    icon: <Network className="h-5 w-5 text-indigo-600" />,
    options: [
      { id: 'visa', label: 'Visa' },
      { id: 'mastercard', label: 'MasterCard' },
      { id: 'amex', label: 'American Express' },
      { id: 'boa', label: 'Bank of America' },
      { id: 'citi', label: 'Citibank' },
      { id: 'chase', label: 'Chase' },
      { id: 'wells-fargo', label: 'Wells Fargo' },
      { id: 'capital-one', label: 'Capital One' },
      { id: 'luxury', label: 'Luxury Card' }
    ]
  },
  {
    id: 'credit',
    title: 'My Credit History',
    icon: <BadgeCheck className="h-5 w-5 text-indigo-600" />,
    options: [
      { id: 'excellent-good', label: 'Good or Excellent' },
      { id: 'limited', label: 'Limited or No Credit' },
      { id: 'bad', label: 'Bad Credit' }
    ]
  },
  {
    id: 'benefits',
    title: 'Card Benefits',
    icon: <Award className="h-5 w-5 text-indigo-600" />,
    description: 'Find cards with specific travel and purchase protection benefits',
    options: [
      { 
        id: 'rental-car-insurance', 
        label: 'Rental Car Insurance',
        description: 'Coverage for rental car damage or theft'
      },
      { 
        id: 'flight-delay-protection', 
        label: 'Flight Delay Protection',
        description: 'Reimbursement for expenses during flight delays'
      },
      { 
        id: 'baggage-delay-coverage', 
        label: 'Baggage Delay Coverage',
        description: 'Coverage for delayed or lost baggage'
      },
      { 
        id: 'airport-lounge-access', 
        label: 'Airport Lounge Access',
        description: 'Access to airport lounges worldwide'
      },
       { 
        id: 'return-protection', 
        label: 'Return Protection',
        description: 'Extended return period for purchases'
      },
      { 
        id: 'price-protection', 
        label: 'Price Protection',
        description: 'Refund if item price drops after purchase'
      },
      { 
        id: 'extended-warranty', 
        label: 'Extended Warranty',
        description: 'Additional warranty coverage on purchases'
      },
      { 
        id: 'anniversary-bonus', 
        label: 'Anniversary Bonus',
        description: 'Annual bonus points or miles'
      },
      { 
        id: 'cell-phone-protection', 
        label: 'Cell Phone Protection',
        description: 'Coverage for cell phone damage or theft'
      },
      { 
        id: 'global-entry-tsa', 
        label: 'Global Entry/TSA PreCheck',
        description: 'Credit for Global Entry or TSA PreCheck application'
      },
      { 
        id: 'lost-luggage-insurance', 
        label: 'Lost Luggage Insurance',
        description: 'Coverage for lost or stolen luggage'
      },
      { 
        id: 'lounge-access', 
        label: 'Lounge Access',
        description: 'Access to airport lounges'
      },
      { 
        id: 'no-foreign-transaction-fee', 
        label: 'No Foreign Transaction Fee',
        description: 'No fees on international purchases'
      },
      { 
        id: 'purchase-protection', 
        label: 'Purchase Protection',
        description: 'Coverage for damaged or stolen purchases'
      },
      { 
        id: 'travel-accident-insurance', 
        label: 'Travel Accident Insurance',
        description: 'Coverage for travel-related accidents'
      },
      { 
        id: 'travel-medical-insurance', 
        label: 'Travel Medical Insurance',
        description: 'Medical coverage while traveling'
      },
      { 
        id: 'trip-cancellation-insurance', 
        label: 'Trip Cancellation Insurance',
        description: 'Coverage for cancelled trips'
      },
      { 
        id: 'trip-delay-insurance', 
        label: 'Trip Delay Insurance',
        description: 'Coverage for delayed trips'
      }
    ]
  }
];

const FilterSidebar: React.FC<FilterSidebarProps> = ({ selectedFilters, onFilterChange }) => {
  return (
    <aside className="w-80 bg-white rounded-xl shadow-lg p-6 h-fit sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-6 w-6 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-900">Filter Cards</h2>
        </div>
        <span className="text-base text-indigo-600 font-medium">
          {selectedFilters.length} active
        </span>
      </div>

      {selectedFilters.length > 0 && (
        <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-medium text-indigo-700">Active Filters</span>
            <button
              onClick={() => selectedFilters.forEach(f => onFilterChange(f))}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedFilters.map(filter => (
              <button
                key={filter}
                onClick={() => onFilterChange(filter)}
                className="text-sm bg-white text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-200 hover:border-indigo-300 flex items-center gap-1"
              >
                {filter}
                <span className="text-indigo-400 text-lg">×</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedFilters.length === 0 && (
        <div className="mb-6 p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Shield className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-medium text-lg text-indigo-900 mb-1">Find Your Perfect Card</h3>
              <p className="text-base text-indigo-700">
                Use filters to narrow down cards that match your needs and preferences.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {filterGroups.map((group) => (
          <div key={group.id} className="border-b border-gray-200 pb-6 last:border-0">
            <div className="flex items-start gap-2 mb-4">
              {group.icon}
              <h3 className="text-base font-medium text-indigo-600">{group.title}</h3>
              {group.description && (
                <div className="group relative">
                  <Info className="h-5 w-5 text-gray-400 cursor-help" />
                  <div className="absolute left-0 top-6 w-64 p-3 bg-gray-900 text-white text-sm rounded hidden group-hover:block z-10">
                    {group.description}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-3">
              {group.options.map((option) => (
                <div key={option.id} className="relative group">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.includes(option.id)}
                      onChange={() => onFilterChange(option.id)}
                      className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-base text-gray-700 group-hover:text-gray-900">
                      {option.label}
                    </span>
                  </label>
                  {option.description && (
                    <div className="hidden group-hover:block absolute left-full ml-2 top-0 w-64 p-3 bg-gray-900 text-white text-sm rounded z-10">
                      {option.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default FilterSidebar;
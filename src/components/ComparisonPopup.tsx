import React from 'react';
import { Card } from '../types/Card';
import { X, ExternalLink, Check } from 'lucide-react';

interface ComparisonPopupProps {
  selectedCards: Card[];
  onClose: () => void;
  onRemoveCard: (cardId: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  showDetailed: boolean;
}

interface ComparisonSection {
  category: string;
  items: {
    title: string;
    getValue: (card: Card) => React.ReactNode;
  }[];
}

const ComparisonPopup: React.FC<ComparisonPopupProps> = ({
  selectedCards,
  onClose,
  onRemoveCard,
  isExpanded,
  onToggleExpand,
  showDetailed
}) => {
  if (selectedCards.length === 0) return null;

  const formatCurrency = (value: number | undefined): string => {
    if (!value || value === 0) return '$0';
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const hasBenefit = (card: Card, keywords: string[]): boolean => {
    return card.bullets.some(bullet => 
      keywords.every(keyword => 
        bullet.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  };

  const comparisonSections: ComparisonSection[] = [
    {
      category: 'Card Issuer & Network',
      items: [
        {
          title: 'Card Issuer',
          getValue: (card) => <div className="text-gray-900">{card.bank}</div>
        },
        {
          title: 'Network',
          getValue: (card) => (
            <div className="text-gray-900">
              {card.name.includes('Visa') ? 'Visa' : 
               card.name.includes('Mastercard') ? 'Mastercard' : 
               card.name.includes('American Express') ? 'American Express' : 
               card.name.includes('Discover') ? 'Discover' : 'Not specified'}
            </div>
          )
        },
        {
          title: 'Credit Score Recommended',
          getValue: (card) => <div className="text-gray-900">{card.creditLevel}</div>
        }
      ]
    },
    {
      category: 'Reward/Cashback Rate',
      items: [
        {
          title: 'Base Rate',
          getValue: (card) => (
            <div className="space-y-2">
              {card.cashbackDetails?.find(detail => detail.category.toLowerCase().includes('other') || detail.category.toLowerCase().includes('all purchases'))?.rate || 1}%
            </div>
          )
        },
        {
          title: 'Bonus Categories',
          getValue: (card) => (
            <div className="space-y-2">
              {card.cashbackDetails?.filter(detail => 
                !detail.category.toLowerCase().includes('other') && 
                !detail.category.toLowerCase().includes('all purchases')
              ).map((detail, index) => (
                <div key={index} className="text-sm text-gray-900">
                  {detail.rate}% on {detail.category}
                </div>
              ))}
            </div>
          )
        }
      ]
    },
    {
      category: 'Welcome Benefit',
      items: [
        {
          title: 'Bonus Amount',
          getValue: (card) => (
            <div className="font-medium text-gray-900">
              {formatCurrency(card.welcomeBonus)}
            </div>
          )
        },
        {
          title: 'Spending Requirement',
          getValue: (card) => (
            <div className="text-gray-900">
              {card.bullets.find(b => b.toLowerCase().includes('spend'))?.match(/spend \$[\d,]+ in.+/i)?.[0] || 'None'}
            </div>
          )
        }
      ]
    },
    {
      category: 'Annual Fee',
      items: [
        {
          title: 'Fee Amount',
          getValue: (card) => (
            <div>
              <div className="font-medium text-gray-900">
                {card.annualFee.includes('$0') ? 'No Annual Fee' : card.annualFee.match(/\$\d+/)?.[0]}
              </div>
            </div>
          )
        },
        {
          title: 'First Year Waived',
          getValue: (card) => (
            <div className="text-gray-900">
              {card.annualFee.toLowerCase().includes('intro') || card.annualFee.toLowerCase().includes('first year') ? (
                <div className="text-green-600">Yes</div>
              ) : (
                'No'
              )}
            </div>
          )
        }
      ]
    },
    {
      category: 'Purchase Intro APR',
      items: [
        {
          title: 'Intro Rate',
          getValue: (card) => (
            <div className="text-gray-900">
              {card.purchaseAPR.toLowerCase().includes('0%') ? (
                <div className="text-green-600">0% Intro APR</div>
              ) : (
                card.purchaseAPR.split(' ')[0]
              )}
            </div>
          )
        },
        {
          title: 'Duration',
          getValue: (card) => (
            <div className="text-gray-900">
              {card.purchaseAPR.toLowerCase().includes('0%') ? (
                <div className="text-gray-600">
                  {card.purchaseAPR.match(/for \d+ months/i)?.[0] || 
                   card.purchaseAPR.match(/\d+ months/i)?.[0] || 'N/A'}
                </div>
              ) : (
                'N/A'
              )}
            </div>
          )
        }
      ]
    },
    {
      category: 'Balance Transfer Intro APR',
      items: [
        {
          title: 'Intro Rate',
          getValue: (card) => (
            <div className="text-gray-900">
              {card.balanceTransferAPR.toLowerCase().includes('0%') ? (
                <div className="text-green-600">0% Intro APR</div>
              ) : (
                card.balanceTransferAPR.split(' ')[0]
              )}
            </div>
          )
        },
        {
          title: 'Duration',
          getValue: (card) => (
            <div className="text-gray-900">
              {card.balanceTransferAPR.toLowerCase().includes('0%') ? (
                <div className="text-gray-600">
                  {card.balanceTransferAPR.match(/for \d+ months/i)?.[0] || 
                   card.balanceTransferAPR.match(/\d+ months/i)?.[0] || 'N/A'}
                </div>
              ) : (
                'N/A'
              )}
            </div>
          )
        }
      ]
    },
    {
      category: 'Regular APR',
      items: [
        {
          title: 'Purchase APR',
          getValue: (card) => (
            <div className="text-gray-900">
              {card.purchaseAPR.includes('Variable') ? card.purchaseAPR : `${card.purchaseAPR} Variable`}
            </div>
          )
        },
        {
          title: 'Balance Transfer APR',
          getValue: (card) => (
            <div className="text-gray-900">
              {card.balanceTransferAPR.includes('Variable') ? card.balanceTransferAPR : `${card.balanceTransferAPR} Variable`}
            </div>
          )
        }
      ]
    },
    {
      category: 'Fees',
      items: [
        {
          title: 'Foreign Transaction Fee',
          getValue: (card) => (
            <div className="text-gray-900">
              {card.foreignTransactionFee || 
               (card.bullets.some(b => b.toLowerCase().includes('no foreign transaction')) ? 
                'None' : '3% of each transaction')}
            </div>
          )
        },
        {
          title: 'Balance Transfer Fee',
          getValue: (card) => (
            <div className="text-gray-900">
              {card.balanceTransferFee || 'Not specified'}
            </div>
          )
        },
        {
          title: 'Cash Advance Fee',
          getValue: (card) => (
            <div className="text-gray-900">
              {card.cashAdvanceFee || 'Not specified'}
            </div>
          )
        }
      ]
    },
    {
      category: 'Additional Benefits',
      items: [
        {
          title: 'Extended Warranty',
          getValue: (card) => (
            <div className="text-gray-900">
              {hasBenefit(card, ['extended', 'warranty']) ? (
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Yes</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <X className="h-5 w-5 text-red-500" />
                  <span>No</span>
                </div>
              )}
            </div>
          )
        },
        {
          title: 'Foreign Transaction Fee',
          getValue: (card) => (
            <div className="text-gray-900">
              {card.foreignTransactionFee === '0%' || card.bullets.some(b => b.toLowerCase().includes('no foreign transaction')) ? (
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>No Fee</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <X className="h-5 w-5 text-red-500" />
                  <span>{card.foreignTransactionFee || '3%'}</span>
                </div>
              )}
            </div>
          )
        },
        {
          title: 'Global Entry/TSA PreCheck',
          getValue: (card) => (
            <div className="text-gray-900">
              {hasBenefit(card, ['global entry']) || hasBenefit(card, ['tsa']) ? (
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Yes</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <X className="h-5 w-5 text-red-500" />
                  <span>No</span>
                </div>
              )}
            </div>
          )
        },
        {
          title: 'Lounge Access',
          getValue: (card) => (
            <div className="text-gray-900">
              {hasBenefit(card, ['lounge']) ? (
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Yes</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <X className="h-5 w-5 text-red-500" />
                  <span>No</span>
                </div>
              )}
            </div>
          )
        },
        {
          title: 'Lost Luggage Insurance',
          getValue: (card) => (
            <div className="text-gray-900">
              {hasBenefit(card, ['lost', 'luggage']) || hasBenefit(card, ['baggage', 'insurance']) ? (
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Yes</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <X className="h-5 w-5 text-red-500" />
                  <span>No</span>
                </div>
              )}
            </div>
          )
        },
        {
          title: 'Baggage Delay Insurance',
          getValue: (card) => (
            <div className="text-gray-900">
              {hasBenefit(card, ['baggage', 'delay']) ? (
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Yes</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <X className="h-5 w-5 text-red-500" />
                  <span>No</span>
                </div>
              )}
            </div>
          )
        },
        {
          title: 'Priority Boarding',
          getValue: (card) => (
            <div className="text-gray-900">
              {hasBenefit(card, ['priority', 'boarding']) ? (
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Yes</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <X className="h-5 w-5 text-red-500" />
                  <span>No</span>
                </div>
              )}
            </div>
          )
        },
        {
          title: 'Purchase Protection',
          getValue: (card) => (
            <div className="text-gray-900">
              {hasBenefit(card, ['purchase', 'protection']) ? (
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Yes</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <X className="h-5 w-5 text-red-500" />
                  <span>No</span>
                </div>
              )}
            </div>
          )
        },
        {
          title: 'Cell Phone Protection',
          getValue: (card) => (
            <div className="text-gray-900">
              {hasBenefit(card, ['cell', 'phone', 'protection']) ? (
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Yes</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <X className="h-5 w-5 text-red-500" />
                  <span>No</span>
                </div>
              )}
            </div>
          )
        },
        {
          title: 'Return Protection',
          getValue: (card) => (
            <div className="text-gray-900">
              {hasBenefit(card, ['return', 'protection']) ? (
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Yes</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <X className="h-5 w-5 text-red-500" />
                  <span>No</span>
                </div>
              )}
            </div>
          )
        },
        {
          title: 'Roadside Assistance',
          getValue: (card) => (
            <div className="text-gray-900">
              {hasBenefit(card, ['roadside']) ? (
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Yes</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <X className="h-5 w-5 text-red-500" />
                  <span>No</span>
                </div>
              )}
            </div>
          )
        },
        {
          title: 'Travel Accident Insurance',
          getValue: (card) => (
            <div className="text-gray-900">
              {hasBenefit(card, ['travel', 'accident']) || hasBenefit(card, ['travel', 'insurance']) ? (
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Yes</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <X className="h-5 w-5 text-red-500" />
                  <span>No</span>
                </div>
              )}
            </div>
          )
        }
      ]
    }
  ];

  if (!showDetailed) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {selectedCards.map(card => (
                <div key={card.id} className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{card.name}</span>
                  <button
                    onClick={() => onRemoveCard(card.id || '')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={onToggleExpand}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Compare Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-7xl max-h-[90vh] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-indigo-700 to-blue-700 z-10 flex items-center justify-between p-6 rounded-t-xl">
          <div className="grid grid-cols-[200px_repeat(3,1fr)] gap-6 w-full">
            <div className="font-bold text-xl text-white">Compare Cards</div>
            {selectedCards.map((card) => (
              <div key={card.id}>
                <h3 className="font-bold text-xl text-white mb-3">{card.name}</h3>
                <a
                  href={card.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors gap-2"
                >
                  Apply Now <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ))}
            {[...Array(3 - selectedCards.length)].map((_, index) => (
              <div key={`empty-${index}`} className="h-full flex items-center">
                <span className="text-gray-400">Select a card to compare</span>
              </div>
            ))}
          </div>
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-300 hover:text-white rounded-lg p-2 hover:bg-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="grid grid-cols-[200px_repeat(3,1fr)] gap-6">
              {comparisonSections.map((section, sectionIndex) => (
                <React.Fragment key={section.category}>
                  {/* Category Header - Spans all columns */}
                  <div className="col-span-4 mt-4 first:mt-0">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{section.category}</h3>
                    <div className="h-px bg-gray-300 w-full"></div>
                  </div>
                  
                  {/* Left column with item titles */}
                  <div className="space-y-8">
                    {section.items.map((item, itemIndex) => (
                      <div key={`${sectionIndex}-${itemIndex}`} className="py-2 font-medium text-gray-700">
                        {item.title}
                      </div>
                    ))}
                  </div>

                  {/* Card columns with values */}
                  {selectedCards.map((card) => (
                    <div key={`${section.category}-${card.id}`} className="space-y-8">
                      {section.items.map((item, itemIndex) => (
                        <div key={`${sectionIndex}-${itemIndex}-${card.id}`} className="py-2 border-b border-gray-100">
                          {item.getValue(card)}
                        </div>
                      ))}
                    </div>
                  ))}

                  {/* Empty columns for missing cards */}
                  {[...Array(3 - selectedCards.length)].map((_, index) => (
                    <div key={`empty-${section.category}-${index}`} className="space-y-8">
                      {section.items.map((_, itemIndex) => (
                        <div key={`empty-${sectionIndex}-${itemIndex}-${index}`} className="py-2 border-b border-gray-100" />
                      ))}
                    </div>
                  ))}
                  
                  {/* Spacer after each section */}
                  <div className="col-span-4 h-6"></div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonPopup;
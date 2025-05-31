import React from 'react';
import { CreditCard } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <CreditCard className="h-7 w-7 mr-2" />
          <h1 className="text-xl font-bold">CardPro.co</h1>
        </div>
        
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a href="#" className="text-white hover:text-indigo-200 transition-colors">
                Calculator
              </a>
            </li>
            <li>
              <a href="#" className="text-white hover:text-indigo-200 transition-colors">
                Card Finder
              </a>
            </li>
            <li>
              <a href="#" className="text-white hover:text-indigo-200 transition-colors">
                Resources
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
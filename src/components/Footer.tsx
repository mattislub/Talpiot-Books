import React, { useState } from 'react';
import { CreditCard, Mail, Phone, FileText, Check, AlertCircle } from 'lucide-react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: 'b0e62fb3-864b-4f43-879c-7399cf6087ea',
          email,
          subject: 'New Credit Card Offers Subscription',
          botcheck: false,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setStatus('success');
        setMessage('Thanks for subscribing! Check your email for the best credit card offers.');
        setEmail('');
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Oops! Something went wrong. Please try again.');
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto mb-12">
          <h4 className="text-center text-lg font-semibold text-white mb-4">
Get the Best Credit Card Offers Delivered To Your Inbox          </h4>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          
          {status === 'success' && (
            <div className="mt-3 flex items-center gap-2 text-green-400 text-sm justify-center">
              <Check className="h-4 w-4" />
              <span>{message}</span>
            </div>
          )}
          
          {status === 'error' && (
            <div className="mt-3 flex items-center gap-2 text-red-400 text-sm justify-center">
              <AlertCircle className="h-4 w-4" />
              <span>{message}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <CreditCard className="h-6 w-6 mr-2 text-indigo-400" />
              <h2 className="text-xl font-bold text-white">CardPro.co</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Find the perfect credit card for your spending habits with our powerful rewards calculator.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://www.cardpro.co/featured-credit-cards/?ref=cdfdghdx" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  Best Credit Cards
                </a>
              </li>
              <li>
                <a href="https://www.cardpro.co/cash-back-credit-cards/?ref=cdfdghdx" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  Cash Back Cards
                </a>
              </li>
              <li>
                <a href="https://www.cardpro.co/travel-rewards-credit-cards/?ref=cdfdghdx" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  Travel Rewards Cards
                </a>
              </li>
              <li>
                <a href="https://www.cardpro.co/no-annual-fee-credit-cards/?ref=cdfdghdx" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  No Annual Fee Cards
                </a>
              </li>
              <li>
                <a href="https://www.cardpro.co/business-credit-cards/?ref=cdfdghdx" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  Business Credit Cards
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-indigo-400" />
                <a href="mailto:info@cardpro.co" className="text-gray-400 hover:text-white transition-colors">
                  info@cardpro.co
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-indigo-400" />
                <a href="tel:+18005551234" className="text-gray-400 hover:text-white transition-colors">
                  (800) 555-1234
                </a>
              </li>
              <li className="flex items-start mt-4">
                <FileText className="h-5 w-5 mr-2 text-indigo-400" />
                <div>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors block mb-1">
                    Terms of Service
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors block">
                    Privacy Policy
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} CardPro.co. All rights reserved.</p>
          <p className="mt-2">
            This site may be compensated through third party advertisers. The information presented is for educational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="w-full shadow-lg font-sans text-right bg-white">
      <div className="bg-[#f8f6f1] text-sm text-[#8b6f1f] px-6 py-2 flex justify-between items-center border-b">
        <nav className="flex gap-6">
          <Link to="/" className="hover:text-[#a48327] transition">ראשי</Link>
          <Link to="/about" className="hover:text-[#a48327] transition">אודותינו</Link>
          <Link to="/categories" className="hover:text-[#a48327] transition">קטגוריות</Link>
          <Link to="/terms" className="hover:text-[#a48327] transition">תנאי שימוש</Link>
          <Link to="/contact" className="hover:text-[#a48327] transition">יצירת קשר</Link>
        </nav>
        <span className="text-xs text-gray-500">מדיניות החזרות וביטולים</span>
      </div>

      <div className="py-6 flex justify-center items-center">
        <img src="/logo.png" alt="לוגו תלפיות" className="h-24" />
      </div>

      <div className="bg-[#112a55] text-white px-6 py-4 flex flex-col lg:flex-row justify-between items-center gap-4">
        <form onSubmit={handleSearch} className="flex w-full max-w-md">
          <input
            type="text"
            placeholder="חפש ספרים..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-r text-black text-sm border-none"
          />
          <button type="submit" className="bg-[#a48327] hover:bg-[#8b6f1f] px-4 py-2 rounded-l">
            🔍
          </button>
        </form>

        <div className="flex items-center gap-6 text-lg">
          <div className="flex items-center gap-2 text-[#f9e79f]">
            <span>📞</span> <span>03-5797390</span>
          </div>
          <button title="התחברות" className="hover:text-yellow-400">👔</button>
          <button title="הזמנות שלי" className="hover:text-yellow-400">📦</button>
          <button title="סל קניות" className="relative hover:text-yellow-400">
            🛍️
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1 rounded-full">0</span>
          </button>
        </div>
      </div>
    </header>
  );
}
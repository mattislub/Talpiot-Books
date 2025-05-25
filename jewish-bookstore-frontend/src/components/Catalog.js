import React, { useEffect, useState } from "react";
import { ShoppingCart, Plus, Eye } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const mockBooks = [
  {
    id: 1,
    title: "שולחן ערוך",
    author: "רבי יוסף קארו",
    description: "ספר יסוד בהלכה",
    price: 120,
    image_url: "https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg",
    status: "available"
  },
  {
    id: 2,
    title: "משנה ברורה",
    author: "החפץ חיים",
    description: "ביאור להלכות שו\"ע",
    price: 110,
    image_url: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg",
    status: "available"
  },
  {
    id: 3,
    title: "תנ\"ך קורן",
    author: "",
    description: "התנ\"ך בניקוד מלא",
    price: 80,
    image_url: "https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg",
    status: "available"
  }
];

export default function Catalog() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("search") || "";

  useEffect(() => {
    // Load books from localStorage or use mock data
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
      setBooks(JSON.parse(storedBooks));
    } else {
      localStorage.setItem('books', JSON.stringify(mockBooks));
      setBooks(mockBooks);
    }
    setLoading(false);
  }, []);

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="text-center py-8">טוען...</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#112a55]">קטלוג הספרים</h2>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transform transition-transform duration-300 hover:scale-105"
          >
            <img
              src={book.image_url}
              alt={book.title}
              className="w-full h-[300px] object-cover bg-white rounded-t-2xl"
            />

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold text-[#112a55] mb-2">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{book.description}</p>
                <p className="text-md font-bold text-[#a48327]">{book.price} ₪</p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <button className="bg-[#7c1c2c] text-white py-2 px-4 rounded-lg hover:bg-[#66121f] flex items-center gap-2">
                  <ShoppingCart size={18} /> <span>קנייה מיידית</span>
                </button>
                <div className="flex gap-2 text-xl">
                  <button className="text-gray-500 hover:text-green-600" title="הוספה לרשימת משאלות">
                    <Plus size={18} />
                  </button>
                  <Link to={`/books/${book.id}`} className="text-gray-500 hover:text-blue-600" title="צפייה בפרטים">
                    <Eye size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
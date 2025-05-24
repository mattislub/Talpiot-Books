import React, { useEffect, useState } from "react";
import { ShoppingCart, Plus, Eye } from "lucide-react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

export default function Catalog() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("search") || "";

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://sr.70-60.com:3010/api/books`, {
          params: { search: searchQuery }
        });
        setBooks(response.data);
        setError(null);
      } catch (error) {
        setError("שגיאה בטעינת ספרים");
        console.error("שגיאה:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [searchQuery]);

  if (loading) return <div className="text-center py-8">טוען...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#112a55]">קטלוג הספרים</h2>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transform transition-transform duration-300 hover:scale-105"
          >
            {book.image_url ? (
              <img
                src={`http://sr.70-60.com:3010${book.image_url}`}
                alt={book.title}
                className="w-full h-[300px] object-contain bg-white rounded-t-2xl"
              />
            ) : (
              <img
                src={`https://via.placeholder.com/300x400.png?text=${encodeURIComponent(book.title)}`}
                alt={book.title}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
            )}

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
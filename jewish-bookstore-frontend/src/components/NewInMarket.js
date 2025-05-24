import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from "react-router-dom";

export const NewInMarket = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const booksPerPage = 3;
  const totalPages = Math.ceil(books.length / booksPerPage);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://sr.70-60.com:3010/api/books", {
          params: { market_new: true }
        });
        setBooks(response.data);
        setError(null);
      } catch (error) {
        setError("שגיאה בטעינת ספרים חדשים בשוק");
        console.error("שגיאה:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const displayedBooks = books.slice(
    page * booksPerPage,
    page * booksPerPage + booksPerPage
  );

  if (loading) return <div className="text-center py-8">טוען...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="w-full py-8 bg-[#fdf6ec]">
      <h2 className="text-xl font-bold mb-4 text-right">חדשים בשוק</h2>
      <div className="flex gap-6 justify-center">
        {displayedBooks.map(book => (
          <Link key={book.id} to={`/books/${book.id}`} className="w-48 cursor-pointer">
            <img
              src={book.image_url ? `http://sr.70-60.com:3010${book.image_url}` : `https://via.placeholder.com/300x400.png?text=${encodeURIComponent(book.title)}`}
              alt={book.title}
              className="w-full h-64 object-cover rounded-xl shadow"
            />
            <p className="text-center mt-2">{book.title}</p>
          </Link>
        ))}
      </div>
      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${idx === page ? 'bg-gray-800' : 'bg-gray-400'} hover:bg-gray-600`}
            onClick={() => setPage(idx)}
          />
        ))}
      </div>
    </div>
  );
};
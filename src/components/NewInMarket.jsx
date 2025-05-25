import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { getMarketNewBooks } from "../data/books";

export const NewInMarket = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const booksPerPage = 3;

  useEffect(() => {
    setLoading(true);
    const marketNewBooks = getMarketNewBooks();
    setBooks(marketNewBooks);
    setLoading(false);
  }, []);

  const totalPages = Math.ceil(books.length / booksPerPage);
  const displayedBooks = books.slice(
    page * booksPerPage,
    page * booksPerPage + booksPerPage
  );

  if (loading) return <div className="text-center py-8">טוען...</div>;

  return (
    <div className="w-full py-8 bg-[#fdf6ec]">
      <h2 className="text-xl font-bold mb-4 text-right">חדשים בשוק</h2>
      <div className="flex gap-6 justify-center">
        {displayedBooks.map(book => (
          <Link key={book.id} to={`/books/${book.id}`} className="w-48 cursor-pointer">
            <img
              src={book.image_url || `https://via.placeholder.com/300x400.png?text=${encodeURIComponent(book.title)}`}
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
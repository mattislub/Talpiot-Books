import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import { getNewBooks } from "../data/books";

export const NewOnSite = () => {
  const scrollRef = useRef(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const newBooks = getNewBooks(8);
    setBooks(newBooks);
    setLoading(false);
  }, []);

  useEffect(() => {
    const scroll = () => {
      if (!scrollRef.current) return;
      scrollRef.current.scrollLeft += 1;
      if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth - scrollRef.current.clientWidth) {
        scrollRef.current.scrollLeft = 0;
      }
    };
    const interval = setInterval(scroll, 30);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-center py-8">טוען...</div>;

  return (
    <div className="w-full overflow-hidden py-4 bg-[#fdf6ec]">
      <h2 className="text-xl font-bold mb-2 text-right">חדשים באתר</h2>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto whitespace-nowrap scroll-smooth">
        {books.map(book => (
          <Link key={book.id} to={`/books/${book.id}`} className="flex-shrink-0 w-48 cursor-pointer">
            <img
              src={book.image_url || `https://via.placeholder.com/300x400.png?text=${encodeURIComponent(book.title)}`}
              alt={book.title}
              className="w-full h-64 object-cover rounded-xl shadow"
            />
            <p className="text-center mt-2">{book.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
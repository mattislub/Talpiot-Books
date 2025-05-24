import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://sr.70-60.com:3010/api/books/${id}`);
        setBook(response.data);
        setError(null);
      } catch (error) {
        setError("שגיאה בטעינת פרטי הספר");
        console.error("שגיאה:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading) return <div className="text-center py-8">טוען...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
  if (!book) return <div className="text-center py-8">הספר לא נמצא</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 text-right">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">← חזרה לקטלוג</Link>
      <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col md:flex-row gap-6">
        <img
          src={book.image_url ? `http://sr.70-60.com:3010${book.image_url}` : `https://via.placeholder.com/300x400.png?text=${encodeURIComponent(book.title)}`}
          alt={book.title}
          className="w-full md:w-1/3 h-[300px] object-contain rounded"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[#112a55] mb-2">{book.title}</h2>
          <p className="text-gray-600 mb-2">{book.author || "מחבר לא ידוע"}</p>
          <p className="text-gray-700 mb-4">{book.description}</p>
          <p className="text-xl font-bold text-[#a48327] mb-4">{book.price} ₪</p>
          <p className="text-sm text-gray-500 mb-4">{book.status === "available" ? "✅ במלאי" : "❌ לא במלאי"}</p>
          <button className="bg-[#7c1c2c] text-white py-2 px-4 rounded-lg hover:bg-[#66121f] flex items-center gap-2">
            <ShoppingCart size={18} /> <span>קנייה מיידית</span>
          </button>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://sr.70-60.com:3010";

export default function AdminBookManager() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    author: "",
    description: "",
    final_price: "",
    availability: "available", // שינוי מ-status ל-availability
    imageFile: null,
    categories: []
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/books`);
      setBooks(res.data);
      setFilteredBooks(res.data);
    } catch (err) {
      setMessage("שגיאה בטעינת ספרים");
      console.error("שגיאה בשליפת ספרים:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      setMessage("שגיאה בטעינת קטגוריות");
      console.error("שגיאה בשליפת קטגוריות:", err);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  useEffect(() => {
    setFilteredBooks(
      books.filter((book) =>
        (book.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.author || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, books]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      setFormData((prev) => ({ ...prev, imageFile: files[0] }));
    } else if (name === "final_price") {
      setFormData((prev) => ({ ...prev, final_price: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCategoryToggle = (e) => {
    const id = parseInt(e.target.value);
    setFormData((prev) => ({
      ...prev,
      categories: e.target.checked
        ? [...prev.categories, id]
        : prev.categories.filter((catId) => catId !== id)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("author", formData.author);
    data.append("description", formData.description);
    data.append("final_price", formData.final_price);
    data.append("availability", formData.availability); // שינוי מ-status ל-availability
    formData.categories.forEach((cat) => data.append("categories[]", cat));
    if (formData.imageFile) data.append("image", formData.imageFile);

    try {
      const url = formData.id ? `${API_BASE}/api/books/${formData.id}` : `${API_BASE}/api/books`;
      const method = formData.id ? "PUT" : "POST";
      const res = await axios({
        url,
        method,
        data
      });

      if (formData.categories.length > 0) {
        await axios.post(`${API_BASE}/api/book-categories`, {
          book_id: formData.id || res.data.id,
          categories: formData.categories
        });
      }

      setMessage(formData.id ? "✅ הספר עודכן בהצלחה!" : "✅ הספר נוסף בהצלחה!");
      setFormData({
        id: null,
        title: "",
        author: "",
        description: "",
        final_price: "",
        availability: "available",
        imageFile: null,
        categories: []
      });
      fetchBooks();
    } catch (err) {
      setMessage(formData.id ? "❌ שגיאה בעדכון הספר" : "❌ שגיאה בהוספת הספר");
      console.error("שגיאה בשמירת ספר:", err);
    }
  };

  const handleEdit = (book) => {
    const final_price = book.final_price != null ? book.final_price.toString() : "";
    const availability = book.availability === "available" || book.availability === "out-of-stock" ? book.availability : "available";

    setFormData({
      id: book.id,
      title: book.title || "",
      author: book.author || "",
      description: book.description || "",
      final_price,
      availability,
      imageFile: null,
      categories: book.categories ? book.categories.map(cat => cat.id) : []
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("האם אתה בטוח שברצונך למחוק את הספר?")) return;
    try {
      await axios.delete(`${API_BASE}/api/books/${id}`);
      setBooks((prev) => prev.filter((b) => b.id !== id));
      setFilteredBooks((prev) => prev.filter((b) => b.id !== id));
      setMessage("✅ הספר נמחק בהצלחה!");
    } catch {
      setMessage("❌ שגיאה במחיקה");
    }
  };

  const handleAI = async () => {
    if (!formData.title) return alert("יש להזין שם ספר");
    setLoadingAI(true);
    try {
      const res = await axios.post(`${API_BASE}/api/ai/complete-book`, {
        title: formData.title
      });
      setFormData((prev) => ({ ...prev, description: res.data.description, author: res.data.author }));
    } catch {
      setMessage("❌ שגיאה ב-AI");
    } finally {
      setLoadingAI(false);
    }
  };

  if (loading) return <div className="text-center py-8">טוען...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 text-right">
      <h2 className="text-2xl font-bold mb-4 text-[#112a55]">➕ ניהול ספרים</h2>

      <input
        type="text"
        placeholder="חפש ספרים לפי כותרת או מחבר..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-4"
      />

      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow p-4 rounded mb-6" encType="multipart/form-data">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="כותרת הספר"
          required
          className="w-full border px-3 py-2 rounded"
        />

        <div className="flex gap-2 items-center">
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="שם מחבר"
            className="w-full border px-3 py-2 rounded"
          />
          <button
            type="button"
            onClick={handleAI}
            className="text-sm bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
          >
            {loadingAI ? "טוען..." : "מלא אוטומטית עם AI"}
          </button>
        </div>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="תיאור"
          required
          rows={2}
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="number"
          name="final_price"
          value={formData.final_price}
          onChange={handleChange}
          placeholder="מחיר"
          required
          min="0"
          step="0.01"
          className="w-full border px-3 py-2 rounded"
        />

        <select
          name="availability"
          value={formData.availability}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="available">✅ במלאי</option>
          <option value="out-of-stock">❌ לא במלאי</option>
        </select>

        <div className="space-y-2">
          <p className="font-semibold">בחר קטגוריות:</p>
          <div className="grid grid-cols-2 gap-1 text-sm">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={cat.id}
                  checked={formData.categories.includes(cat.id)}
                  onChange={handleCategoryToggle}
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>

        <input
          type="file"
          name="imageFile"
          accept="image/*"
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-[#a48327] text-white py-2 rounded hover:bg-[#8b6f1f]"
        >
          {formData.id ? "עדכן ספר" : "שמור ספר"}
        </button>
        {message && <div className="text-sm mt-2">{message}</div>}
      </form>

      <h3 className="text-xl font-bold mb-2 mt-6">📚 ספרים קיימים</h3>
      <div className="space-y-4">
        {filteredBooks.map((book) => (
          <div key={book.id} className="bg-gray-50 border rounded p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="font-bold text-[#112a55]">{book.title}</div>
                <div className="text-sm text-gray-600">
                  {book.author || "אין מחבר"} | {book.final_price ? `${book.final_price} ₪` : "מחיר לא זמין"}
                </div>
                <div className="text-sm text-gray-500">
                  {book.availability === "available" ? "✅ במלאי" : "❌ לא במלאי"}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(book)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  ✏️ ערוך
                </button>
                <button
                  onClick={() => handleDelete(book.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  🗑️ מחק
                </button>
              </div>
            </div>
            {book.image_url && (
              <img
                src={`${API_BASE}${book.image_url}`}
                alt={book.title}
                className="w-32 h-40 object-contain bg-white rounded mb-2"
              />
            )}
            <div className="text-sm text-gray-700">{book.description || "אין תיאור"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
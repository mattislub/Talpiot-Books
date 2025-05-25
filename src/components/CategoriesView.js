import React, { useEffect, useState } from "react";
import axios from "axios";

function buildCategoryTree(categories) {
  const map = {};
  const roots = [];

  categories.forEach(cat => {
    map[cat.id] = { ...cat, children: [] };
  });

  categories.forEach(cat => {
    if (cat.parent_id) {
      map[cat.parent_id]?.children.push(map[cat.id]);
    } else {
      roots.push(map[cat.id]);
    }
  });

  return roots;
}

function CategoryTree({ categories }) {
  return (
    <ul className="list-disc pl-4 text-right">
      {categories.map(cat => (
        <li key={cat.id}>
          {cat.name}
          {cat.children.length > 0 && (
            <CategoryTree categories={cat.children} />
          )}
        </li>
      ))}
    </ul>
  );
}

export default function CategoriesView() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://sr.70-60.com:3010/api/categories");
        setCategories(buildCategoryTree(res.data));
        setError(null);
      } catch (err) {
        setError("שגיאה בטעינת קטגוריות");
        console.error("שגיאה:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <div className="text-center py-8">טוען...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
  if (categories.length === 0) return <div className="text-center py-8">אין קטגוריות זמינות</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 text-right">
      <h2 className="text-2xl font-bold mb-4 text-[#112a55]">עץ קטגוריות</h2>
      <CategoryTree categories={categories} />
    </div>
  );
}
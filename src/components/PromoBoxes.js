import React from "react";
import { Link } from "react-router-dom";

export default function PromoBoxes() {
  return (
    <section className="py-8 px-4 max-w-screen-xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-xl p-6 text-right flex flex-col justify-between">
          <div>
            <img src="/ads/book1.jpg" alt="ספר מבצע" className="w-full h-48 object-cover rounded mb-4" />
            <h2 className="text-xl font-bold text-[#112a55] mb-2">מבצע מיוחד על שולחן ערוך</h2>
            <p className="text-gray-700 text-sm">
              קבלו את הסט המלא במחיר מוזל במיוחד עד סוף השבוע!
            </p>
          </div>
          <Link to="/books/1" className="mt-4 bg-[#a48327] hover:bg-[#8b6f1f] text-white px-4 py-2 rounded inline-block">
            לעמוד המוצר
          </Link>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 text-right flex flex-col justify-between">
          <div>
            <img src="/ads/book2.jpg" alt="ספר שני" className="w-full h-48 object-cover rounded mb-4" />
            <h2 className="text-xl font-bold text-[#112a55] mb-2">משנה ברורה בסט איכותי</h2>
            <p className="text-gray-700 text-sm">
              גרסה מהודרת של משנה ברורה – מתנה מושלמת לחגים.
            </p>
          </div>
          <Link to="/books/2" className="mt-4 bg-[#a48327] hover:bg-[#8b6f1f] text-white px-4 py-2 rounded inline-block">
            לפרטים נוספים
          </Link>
        </div>
      </div>
    </section>
  );
}
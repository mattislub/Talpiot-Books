import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Catalog from "./components/Catalog";
import Header from "./components/Header";
import PromoBoxes from "./components/PromoBoxes";
import { NewOnSite } from './components/NewOnSite';
import { NewInMarket } from './components/NewInMarket';
import CategoriesView from "./components/CategoriesView";
import BookDetails from "./components/BookDetails";
import NotFound from "./components/NotFound";

function App() {
  return (
    <Router>
      <div dir="rtl" className="font-serif bg-[#f8f6f1] min-h-screen">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <NewOnSite />
                <PromoBoxes />
                <NewInMarket />
                <Catalog />
              </div>
            }
          />
          <Route path="/categories" element={<CategoriesView />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <footer className="bg-[#112a55] text-white text-center py-4 mt-8">
          <p>© כל הזכויות שמורות לחנות הספרים שלנו</p>
          <p className="text-sm mt-2">לשירותכם בכל עת - טלפון: 03-1234567</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
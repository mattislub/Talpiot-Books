import seedBooks from './seedBooks';

const STORAGE_KEY = 'bookstore_books';

export function getBooks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedBooks));
    return seedBooks;
  }
  return JSON.parse(stored);
}

export function getBook(id) {
  const books = getBooks();
  return books.find(book => book.id === parseInt(id));
}

export function searchBooks(query) {
  const books = getBooks();
  if (!query) return books;
  
  const searchTerm = query.toLowerCase();
  return books.filter(book => 
    book.title.toLowerCase().includes(searchTerm) ||
    (book.author && book.author.toLowerCase().includes(searchTerm)) ||
    (book.description && book.description.toLowerCase().includes(searchTerm))
  );
}

export function addBook(book) {
  const books = getBooks();
  const newBook = {
    ...book,
    id: Math.max(0, ...books.map(b => b.id)) + 1,
    created_at: new Date().toISOString()
  };
  books.push(newBook);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  return newBook;
}

export function updateBook(id, updates) {
  const books = getBooks();
  const index = books.findIndex(book => book.id === parseInt(id));
  if (index === -1) return null;
  
  books[index] = { ...books[index], ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  return books[index];
}

export function deleteBook(id) {
  const books = getBooks();
  const filtered = books.filter(book => book.id !== parseInt(id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function getNewBooks(limit = 8) {
  const books = getBooks();
  return books
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit);
}

export function getMarketNewBooks() {
  const books = getBooks();
  return books.filter(book => book.market_new);
}
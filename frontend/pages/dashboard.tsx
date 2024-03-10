import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from '@/components/BookCard';
import { FaShoppingCart } from 'react-icons/fa';
import Layout from '../components/Layout';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const booksPerPage = 15;

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/books`);
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  // Pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  // Change page
  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  return (
    <Layout>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        <div>
          <div style={{ backgroundImage: 'url("https://img.freepik.com/premium-vector/set-hand-drawn-book-doodle-elements_253081-8.jpg")', backgroundRepeat: 'repeat', backgroundSize: '550px', padding: '16px', borderRadius: '4px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>Shop</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {currentBooks.map((book, index) => (
                <div key={index} style={{ background: '#f4f4f4', padding: '16px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', position: 'relative', overflow: 'hidden' }}>
                  {/* Use 'item' instead of 'book' */}
                  <BookCard item={book} />
                  <button
                    style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'none', border: '1px solid #3182ce', borderRadius: '50%', padding: '10px', cursor: 'pointer' }}
                    aria-label="Add to Cart"
                  >
                    <div style={{ background: 'white', borderRadius: '50%', padding: '4px' }}>
                      <FaShoppingCart style={{ fontSize: '1.2rem', color: '#3182ce' }} />
                    </div>
                  </button>
                </div>
              ))}
            </div>
            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <button onClick={prevPage} disabled={currentPage === 1} style={{ background: '#3182ce', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '4px', margin: '0 4px', cursor: 'pointer' }}>
                Previous
              </button>
              <button onClick={nextPage} disabled={currentBooks.length < booksPerPage} style={{ background: '#3182ce', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '4px', margin: '0 4px', cursor: 'pointer' }}>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

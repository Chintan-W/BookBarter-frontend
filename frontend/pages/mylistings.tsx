import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import UpdateBook from '../components/UpdateBook';
import AddBook from '../components/addbook';
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/router';

interface Listing {
  ISBN: string;
  img: string;
  title: string;
  author: string;
  inventory: number;
  category: string;
  isExchange: boolean;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const MyListings: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedBook, setSelectedBook] = useState<Listing | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
  const [showUpdateConfirmation, setShowUpdateConfirmation] = useState<boolean>(false);
  const [showAddBook, setShowAddBook] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    fetchUserListings();
  }, []);

  const fetchUserListings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const response = await axios.get<Listing[]>(`${apiUrl}/api/user-listings`, {
        headers: { Authorization: token }
      });
      setListings(response.data);
    } catch (error) {
      console.error('Error fetching user listings:', error);
    }
  };

  const handleUpdateListing = (book: Listing) => {
    setSelectedBook(book);
  };

  const handleDeleteListing = async (isbn: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${apiUrl}/api/delete-user-listing/${isbn}`, {
        headers: { Authorization: token }
      });
      setListings(prevListings => prevListings.filter(listing => listing.ISBN !== isbn));
      setShowDeleteConfirmation(true);
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  const handleCloseForm = () => {
    setSelectedBook(null);
    fetchUserListings();
    setShowUpdateConfirmation(true);
  };

  return (
    <Layout>
      <div className='container'>
      <h1 style={{ fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>My Listings</h1>
        <Button variant="success" onClick={() => setShowAddBook(true)}>Add Book</Button>{' '}
        <br /><br />
        {showAddBook && <AddBook onClose={() => setShowAddBook(false)} />} {/* Close the AddBook form */}
        {listings.map(listing => (
          <div key={listing.ISBN} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
            <img src={listing.img} alt={listing.title} style={{ height: '80px', marginRight: '10px' }} />
            <div>
              <p>Title: {listing.title}</p>
              <p>Author: {listing.author}</p>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <Button variant="primary" onClick={() => handleUpdateListing(listing)}>Update</Button>{' '}
              <Button variant="danger" onClick={() => handleDeleteListing(listing.ISBN)}>Delete</Button>
            </div>
          </div>
        ))}
        {selectedBook && (
          <div style={{ marginTop: '20px' }}>
            <h2>Update Listing</h2>
            <UpdateBook initialValues={selectedBook} onSubmit={handleCloseForm} onClose={handleCloseForm} />
          </div>
        )}
        {showDeleteConfirmation && (
          <div className="alert alert-success" role="alert">
            Listing deleted successfully!
          </div>
        )}
        {showUpdateConfirmation && (
          <div className="alert alert-success" role="alert">
            Listing updated successfully!
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyListings;

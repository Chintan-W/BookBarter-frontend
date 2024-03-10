import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

interface ExchangeRequest {
  _id: string;
  senderEmail: string;
  receiverEmail: string;
  status: string;
  listingIds: [];
  bookId: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const ExchangeRequests: React.FC = () => {
  const [incomingRequests, setIncomingRequests] = useState<ExchangeRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<ExchangeRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [titles, setTitles] = useState<string[]>([]); // Store book titles for incoming requests
  const [selectedBook, setSelectedBook] = useState<string>('');

  useEffect(() => {
    fetchExchangeRequests();
  }, []);

  const fetchExchangeRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication failed');
        return;
      }
      const response = await axios.get<{ incomingRequests: ExchangeRequest[], outgoingRequests: ExchangeRequest[] }>(`${apiUrl}/api/exchange-requests`, {
        headers: { Authorization: token }
      });
      setIncomingRequests(response.data.incomingRequests);
      setOutgoingRequests(response.data.outgoingRequests);

      // Fetch titles for all incoming requests
      const titlesPromises = response.data.incomingRequests.map(request => fetchBookTitle(request.bookId));
      const titles = await Promise.all(titlesPromises);
      setTitles(titles);
    } catch (error) {
      console.error('Error fetching exchange requests:', error);
      setError('Failed to fetch exchange requests');
    }
  };

  const fetchBookTitle = async (bookId: string) => {
    try {
      const response = await axios.get<any[]>(`${apiUrl}/api/all-listings`);
      const listing = response.data.find(listing => listing._id === bookId);
      return listing ? listing.title : 'Title not found';
    } catch (error) {
      console.error('Error fetching book title:', error);
      return 'Title not found';
    }
  };

  const handleAcceptReject = (requestId: string, action: string) => async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication failed');
        return;
      }
      await axios.put(`${apiUrl}/api/update-exchange-request/${requestId}`, { status: action, bookId: selectedBook }, {
        headers: { Authorization: token }
      });
      // After updating status, fetch updated requests
      fetchExchangeRequests();
    } catch (error) {
      console.error(`Error ${action === 'accept' ? 'accepting' : 'rejecting'} exchange request:`, error);
      setError(`Failed to ${action === 'accept' ? 'accept' : 'reject'} exchange request`);
    }
  };

  return (
    <Layout>
      <div>
        <h1>Exchange Requests</h1>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <h2>Incoming Requests</h2>
        {incomingRequests.length > 0 ? (
          incomingRequests.map((request, index) => (
            <div key={request._id} className="card">
              <div className="card-body">
                <h5 className="card-title">Incoming Request</h5>
                <p className="card-text">Sender Email: {request.senderEmail}</p>
                <p className="card-text">Receiver Email: {request.receiverEmail}</p>
                <p className="card-text">Status: {request.status}</p>
                <p className="card-text">Title: {titles[index]}</p>
                {request.status === 'pending' && (
  <>
    <select value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)}>
      <option value="">Select Book</option>
      {request.listingIds.map((listingId, idx) => (
        <option key={listingId} value={listingId}>{listingId.title}</option>
      ))}
    </select>
    <button className="btn btn-success mr-2" onClick={handleAcceptReject(request._id, 'accept')}>Accept</button>
    <button className="btn btn-danger" onClick={handleAcceptReject(request._id, 'reject')}>Reject</button>
  </>
)}


              </div>
            </div>
          ))
        ) : (
          <p>No incoming requests</p>
        )}

        <h2>Outgoing Requests</h2>
        {outgoingRequests.length > 0 ? (
          outgoingRequests.map(request => (
            <div key={request._id} className="card">
              <div className="card-body">
                <h5 className="card-title">Outgoing Request</h5>
                <p className="card-text">Sender Email: {request.senderEmail}</p>
                <p className="card-text">Receiver Email: {request.receiverEmail}</p>
                <p className="card-text">Status: {request.status}</p>
                {/* Add title here if needed */}
              </div>
            </div>
          ))
        ) : (
          <p>No outgoing requests</p>
        )}
      </div>
    </Layout>
  );
};

export default ExchangeRequests;

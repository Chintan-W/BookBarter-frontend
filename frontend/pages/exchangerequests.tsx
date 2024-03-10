import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

interface ExchangeRequest {
  _id: string;
  senderEmail: string;
  receiverEmail: string;
  status: string;
  listingIds: { _id: string, img: string, title: string, ISBN: string }[]; // Include ISBN in the interface
  bookId: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const ExchangeRequests: React.FC = () => {
  const [incomingRequests, setIncomingRequests] = useState<ExchangeRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<ExchangeRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<{ id: string, title: string, ISBN: string } | null>(null); // Store selected book ID and title
  const [isBookSelected, setIsBookSelected] = useState<boolean>(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string>(''); // Track selected request ID

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
      const incomingSorted = response.data.incomingRequests.sort((a, b) => {
        if (a.status === 'pending') return -1;
        if (b.status === 'pending') return 1;
        return 0;
      });
      setIncomingRequests(incomingSorted);
      setOutgoingRequests(response.data.outgoingRequests);
    } catch (error) {
      console.error('Error fetching exchange requests:', error);
      setError('Failed to fetch exchange requests');
    }
  };

  const handleAcceptReject = (action: string) => async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication failed');
        return;
      }
      await axios.put(`${apiUrl}/api/update-exchange-request/${selectedRequestId}`, { status: action, bookId: selectedBook?.id }, {
        headers: { Authorization: token }
      });
      // After updating status, fetch updated requests
      fetchExchangeRequests();
      // Reset selected book and request ID after action
      setSelectedBook(null);
      setIsBookSelected(false);
      setSelectedRequestId('');
    } catch (error) {
      console.error(`Error ${action === 'accepted' ? 'accepting' : 'rejecting'} exchange request:`, error);
      setError(`Failed to ${action === 'accepted' ? 'accepted' : 'rejected'} exchange request`);
    }
  };

  const handleBookSelectionChange = (e: React.ChangeEvent<HTMLInputElement>, requestId: string, title: string, ISBN: string) => {
    setSelectedBook({ id: e.target.value, title, ISBN }); // Store selected book ID and title
    setIsBookSelected(!!e.target.value);
    setSelectedRequestId(requestId);
  };

  return (
    <Layout>
      <div className='container'>
        <h1 style={{ fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>Exchange Requests</h1>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <div style={{ display: 'flex' }}>
          <div style={{ width: '50%', paddingRight: '10px' }}>
            <h2>Incoming Requests</h2>
            {incomingRequests.length > 0 ? (
              incomingRequests.map((request) => (
                <div key={request._id} className="card" style={{ marginBottom: '20px' }}>
                  <div className="card-body" >
                    <p className="card-text">Sender Email: {request.senderEmail}</p>
                    <p className="card-text">Receiver Email: {request.receiverEmail}</p>
                    <p className="card-text" style={{fontWeight:'bold' }}>Status: {request.status}</p>

                    <div className="card-text">
                      <p>Books offered for exchange:</p>
                      {request.listingIds.map((listing) => (
                        <div key={listing._id} className="book-container">
                          <input
                            type="radio"
                            id={listing._id}
                            name="bookSelection"
                            value={listing._id}
                            onChange={(e) => handleBookSelectionChange(e, request._id, listing.title, listing.ISBN)} // Pass listing title and ISBN
                          />
                          <label htmlFor={listing._id}>
                            <img src={listing.img} alt={listing.title} style={{ maxWidth: '100px', marginRight: '10px' }} />
                            <div style={{ display: 'inline-block' }}>
                              <div>{listing.title}</div>
                              <div>ISBN: {listing.ISBN}</div>
                            </div>
                          </label>
                        </div>
                      ))}
                      { request.status === 'pending' && (
                        <div>
                          <button
                            className="btn btn-success m-3"
                            onClick={handleAcceptReject(`accepted ${selectedBook?.title}`)} // Use selectedBook title
                            disabled={!isBookSelected}
                          >
                            Accept
                          </button>
                          <button
                            className="btn btn-danger m-3"
                            onClick={handleAcceptReject('rejected')}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No incoming requests</p>
            )}
          </div>
          <div style={{ width: '50%', paddingLeft: '10px' }}>
            <h2>Outgoing Requests</h2>
            {outgoingRequests.length > 0 ? (
              outgoingRequests.map((request) => (
                <div key={request._id} className="card" style={{ marginBottom: '20px' }}>
                  <div className="card-body">
                    <p className="card-text">Sender Email: {request.senderEmail}</p>
                    <p className="card-text">Receiver Email: {request.receiverEmail}</p>
                    <p className="card-text" style={{fontWeight:'bold'}}>Status: {request.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No outgoing requests</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ExchangeRequests;

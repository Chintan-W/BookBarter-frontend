import React from 'react';
import axios from 'axios';

interface Exchange {
  img: string;
  title: string;
  author: string;
}

interface AcceptedExchangeProps {
  apiUrl: string;
}

const AcceptedExchange: React.FC<AcceptedExchangeProps> = ({ apiUrl }) => {
  const [exchangeListings, setExchangeListings] = React.useState<Exchange[]>([]);

  React.useEffect(() => {
    const fetchExchangeListings = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/all-listings`);
        const allListings: Exchange[] = response.data;
        
        // Filter out only the exchange listings
        const exchangeListings = allListings.filter(listing => listing.isExchange);
        
        setExchangeListings(exchangeListings);
      } catch (error) {
        console.error('Error fetching exchange listings:', error);
      }
    };

    fetchExchangeListings();
  }, [apiUrl]);

  return (
    <div>
      {exchangeListings.map((exchange, index) => (
        <div key={index}>
          {/* Display exchange details */}
          <img src={exchange.img} alt={exchange.title} />
          <h3>{exchange.title}</h3>
          <p>{exchange.author}</p>
        </div>
      ))}
    </div>
  );
};

export default AcceptedExchange;

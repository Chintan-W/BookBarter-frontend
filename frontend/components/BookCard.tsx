import React from 'react';

interface CardItem {
  img: string;
  title: string;
  author?: string;
  price: number;
  inventory: number;
}


interface BookCardProps<T> {
  item: CardItem; 
}

const BookCard: React.FC<BookCardProps<any>> = ({ item }) => {
  const truncateString = (str: string, maxChars: number) => {
    return str.length > maxChars ? str.substring(0, maxChars) + '...' : str;
  };

  return (
    <div> {/* Center everything */}
      <div className="aspect-w-5 aspect-h-6 mb-4">
        <img src={item.img} alt={item.title} style={{ height: '330px', width:'100%' }} />
      </div>
      <div>
        <h6 className="text-lg font-semibold mb-2">{truncateString(item.title, 25)}</h6>
        {/* Display "N/A" if author is not available */}
        <p className="text-gray-600 mb-2">{item.author ? truncateString(item.author, 25) : 'N/A'}</p>
        {/* Display the inventory */}
        <p className="text-gray-600 mb-2">Price: ${item.price || item.inventory || 'N/A'}</p>
      </div>
    </div>
  );
};

export default BookCard;

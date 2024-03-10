import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer mt-auto py-3 bg-dark">
      <div className="container text-center">
        <span className="text-light">&copy; {currentYear} P & C</span>
      </div>
    </footer>
  );
};

export default Footer;

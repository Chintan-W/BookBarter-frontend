import { useState, useEffect } from 'react';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

interface NavbarProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void; // Define setIsLoggedIn prop
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, setIsLoggedIn }) => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link href="/dashboard" className="navbar-brand">
          <img src="/logo.png" alt="Logo" style={{ margin: '0', width: '80px', height: '80px' }} />
          BookBarter
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link href="/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/listings" className="nav-link">
                    Listings
                  </Link>
                </li>
              
                <li>
                  <Link href="/mylistings" className="nav-link">
                    MyListings
                  </Link>
                </li>
                <li>
                  <Link href="/exchangerequests" className="nav-link">
                    Requests
                  </Link>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="nav-link" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link href="/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/login" className="nav-link">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/register" className="nav-link">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

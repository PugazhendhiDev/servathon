import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from "react-router";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (id) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollToId: id } });
    } else {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="bg-black/30 backdrop-blur-lg shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="/" className="flex items-center space-x-2">
          <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35zM7.5 5C5.52 5 4 6.52 4 8.5c0 2.73 2.5 5.05 7 8.88l1 0.92 1-0.92c4.5-3.83 7-6.15 7-8.88C20 6.52 18.48 5 16.5 5c-1.45 0-2.8.68-3.72 1.76L12 7.88l-.78-1.12C10.3 5.68 8.95 5 7.5 5z" /><path d="M8 12.5l-2 2 2 2" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /><path d="M16 12.5l2 2-2 2" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-orange-300">Serve<span className="text-red-500">athon</span></span>
        </a>
        <div className="hidden md:flex space-x-6">
          <button onClick={() => handleNav('about')} className="text-gray-300 hover:text-red-400 transition">About</button>
          <button onClick={() => handleNav('themes')} className="text-gray-300 hover:text-red-400 transition">Theme</button>
          <button onClick={() => handleNav('schedule')} className="text-gray-300 hover:text-red-400 transition">Schedule</button>
          <button onClick={() => handleNav('prizes')} className="text-gray-300 hover:text-red-400 transition">Prizes</button>
          <button onClick={() => handleNav('faq')} className="text-gray-300 hover:text-red-400 transition">FAQ</button>
        </div>
        <Link to="/event-registration" href="#register" className="hidden md:block bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition shadow-lg hover:shadow-red-500/50">Register Now</Link>
        <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
        </button>
      </nav>
      {isMobileMenuOpen && (
        <div className="md:hidden px-6 pb-4 bg-black/50">
          <button onClick={() => handleNav('about')} className="block py-2 text-gray-300 hover:text-red-400">About</button>
          <button onClick={() => handleNav('themes')} className="block py-2 text-gray-300 hover:text-red-400">Theme</button>
          <button onClick={() => handleNav('schedule')} className="block py-2 text-gray-300 hover:text-red-400">Schedule</button>
          <button onClick={() => handleNav('prizes')} className="block py-2 text-gray-300 hover:text-red-400">Prizes</button>
          <button onClick={() => handleNav('faq')} className="block py-2 text-gray-300 hover:text-red-400">FAQ</button>
          <Link
            to="/event-registration"
            className="block mt-2 bg-red-600 text-white text-center px-5 py-2 rounded-full hover:bg-red-700 transition"
          >
            Register Now
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
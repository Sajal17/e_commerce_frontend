import React from "react";
import { Link } from "react-router-dom";
import TopStories from "./TopStories";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  
  return (
    <footer className="bg-gray-900 text-gray-300 mt-5">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-3">M-Mart</h3>
            <p className="text-sm text-gray-400">
              Your one-stop online shop for electronics, fashion, home & more.
            </p>
            <p className="text-sm text-gray-400 mt-2">Download our App:</p>
            <div className="flex gap-2 mt-2">
              <img src="/playstore.png" alt="Play Store" className="h-10" />
              <img src="/appstore.png" alt="App Store" className="h-10" />
            </div>
          </div>

          <div>
            <h4 className="text-white text-md font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/cart" className="hover:text-white transition">Cart</Link></li>
              <li><Link to="/orders" className="hover:text-white transition">Orders</Link></li>
              <li><Link to="/profile" className="hover:text-white transition">Profile</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-md font-semibold mb-3">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="hover:text-white transition">Help Center</Link></li>
              <li><Link to="#" className="hover:text-white transition">Returns</Link></li>
              <li><Link to="#" className="hover:text-white transition">Shipping</Link></li>
              <li><Link to="#" className="hover:text-white transition">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-md font-semibold mb-3">Follow Us</h4>
            <div className="flex gap-4 mt-2 text-gray-400">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white transition">
                <FaFacebookF size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition">
                <FaTwitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition">
                <FaInstagram size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition">
                <FaLinkedinIn size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} M-Mart. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
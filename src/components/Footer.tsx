import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white py-8 mt-4 border-t-2 pt-8">
      <div className="container mx-auto px-4">
        {/* Логотип и основная информация */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            {/*
            <img src="logo.png" alt="Staking Platform Logo" className="h-12 mb-4" />
            */}
            <p className="text-sm text-gray-500">
              Staking platform for managing your blockchain assets securely and efficiently.
            </p>
          </div>

          {/* Навигация */}
          <nav className="mb-6 md:mb-0">
            <ul className="flex space-x-4 font-bold">
              <li><a href="#" className="text-gray-700 hover:text-gray-900">Home</a></li>
              <li><a href="#" className="text-gray-700 hover:text-gray-900">About Us</a></li>
              <li><a href="#" className="text-gray-700 hover:text-gray-900">Terms of Service</a></li>
              <li><a href="#" className="text-gray-700 hover:text-gray-900">Contact Us</a></li>
            </ul>
          </nav>

          {/* Социальные сети */}
          {/*
          <div>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l-6-6m0 0l6-6m-6 6h.01M12 12l6 6m0 0l6-6" />
              </svg>
              Follow us on social media
            </a>
          </div>
          */}
        </div>

        {/* Нижняя часть - Copyright */}
        <div className="mt-8 border-t border-gray-200 pt-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Staking Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
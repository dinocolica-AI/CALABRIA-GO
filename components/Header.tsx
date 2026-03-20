
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-emerald-600 text-white py-8 px-4 shadow-lg rounded-b-3xl mb-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
          Calabria Go <i className="fa-solid fa-car-side ml-2"></i>
        </h1>
        <p className="text-blue-100 text-lg font-medium">
          Pianifica il tuo viaggio perfetto nella punta dello stivale
        </p>
      </div>
    </header>
  );
};

export default Header;

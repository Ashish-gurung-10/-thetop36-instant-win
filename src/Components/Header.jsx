import React from 'react';

// --- Shared Header Component ---
// This component is responsible for displaying the site's logo and navigation.
// It's designed to be reusable across different pages of the application.
const Header = () => {
    return (
        <header className="bg-white shadow-sm p-4 ">
            <div className="container mx-auto flex justify-between items-center max-w-7xl">
                {/* Logo using brand colors */}
                <div className="bg-[#111D5E] text-white font-bold w-[120px] h-[40px] flex items-center justify-center rounded-[8px]">
                    TheTop36
                </div>
                {/* Navigation Links */}
                <nav className="hidden sm:flex space-x-8 ">
                    {/* The active link has a distinct style */}
                    <a href="#" className="text-[#111D5E] bold  font-bold border-b-2 border-[#FF7A00] transition-colors pb-1">INSTANT WIN</a>
                    <a href="#" className="text-gray-500 hover:text-[#111D5E] font-medium">SPIN WHEEL</a>
                    <a href="#" className="text-gray-500 hover:text-[#111D5E] font-medium">DAILY DRAW</a>
                </nav>
            </div>
        </header>
    );
};

export default Header;

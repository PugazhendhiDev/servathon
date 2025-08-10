import React from "react";

function Footer() {
    return (
        <footer className="bg-black/30 border-t border-white/10 text-white py-12 relative">
            <div className="container mx-auto px-6 text-center">
                <a href="#" className="flex items-center justify-center space-x-2">
                    <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35zM7.5 5C5.52 5 4 6.52 4 8.5c0 2.73 2.5 5.05 7 8.88l1 0.92 1-0.92c4.5-3.83 7-6.15 7-8.88C20 6.52 18.48 5 16.5 5c-1.45 0-2.8.68-3.72 1.76L12 7.88l-.78-1.12C10.3 5.68 8.95 5 7.5 5z" /><path d="M8 12.5l-2 2 2 2" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /><path d="M16 12.5l2 2-2 2" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
                    <span className="text-3xl font-bold">Serve<span className="text-red-500">-a-thon</span></span>
                </a>
                <p className="my-4 text-gray-400">Innovate. Collaborate. Serve the Community.</p>
                <div className="flex justify-center space-x-6 mt-6">
                    <a href="https://www.instagram.com/ritchennai/" className="text-gray-400 hover:text-red-400 transition">RIT Instagram</a>
                    <a href="https://www.linkedin.com/company/youth-red-cross-rit/" className="text-gray-400 hover:text-red-400 transition">LinkedIn</a>
                    <a href="https://www.instagram.com/rit._.yrc/" className="text-gray-400 hover:text-red-400 transition">Instagram</a>
                </div>
                <p className="mt-8 text-gray-500 text-sm">&copy; 2025 YRC Club - RIT. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
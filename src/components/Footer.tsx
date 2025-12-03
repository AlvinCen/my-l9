import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 border-t border-gray-700 mt-auto">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="text-gray-400 text-sm">
                        &copy; {new Date().getFullYear()} Lordnine Tools. Not affiliated with the game developer.
                    </div>
                    <div className="flex space-x-6 text-sm">
                        <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                            About
                        </Link>
                        <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                        <a href="mailto:contact@example.com" className="text-gray-400 hover:text-white transition-colors">
                            Contact
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

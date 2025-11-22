import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

interface ComingSoonProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title, description, icon }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 p-8 bg-gray-800/30 border border-gray-700/50 rounded-2xl">
            <div className="p-4 bg-gray-800 rounded-full border border-gray-700 shadow-lg shadow-primary-500/10">
                {icon || (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                )}
            </div>

            <div className="space-y-2 max-w-md">
                <h2 className="text-3xl font-bold text-white tracking-tight">{title}</h2>
                <p className="text-gray-400 text-lg">{description}</p>
            </div>

            <div className="pt-4">
                <Link to="/dashboard">
                    <Button variant="secondary">
                        Back to Dashboard
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default ComingSoon;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from './PageHeader';
import Card from './Card';
import Button from './Button';

interface ComingSoonProps {
  title: string;
  description?: string;
  hint?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title, description, hint }) => {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader title={title} description={description ?? "This feature is not available yet."} />
      <Card className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-6">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
            <p className="text-gray-400 max-w-md mx-auto">
                {description || "This page is not implemented yet. We’re still designing this feature for Lordnine: Infinite Class."}
            </p>
            {hint && <p className="text-sm text-gray-500 mt-4 max-w-md mx-auto italic">{hint}</p>}
        </div>
        <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
      </Card>
    </div>
  );
};

export default ComingSoon;
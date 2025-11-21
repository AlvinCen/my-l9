
import React from 'react';

interface ContentWithAdsProps {
    children: React.ReactNode;
}

const AdPlaceholder: React.FC<{ label: string }> = ({ label }) => (
    <div className="hidden lg:flex w-[240px] flex-shrink-0 flex-col gap-4 transition-all duration-300">
        <div className="sticky top-24 h-[600px] w-full border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center bg-gray-800/20 hover:bg-gray-800/30 transition-colors">
            <span className="text-gray-600 font-medium text-sm uppercase tracking-widest transform -rotate-90 select-none">{label}</span>
        </div>
    </div>
);

const ContentWithAds: React.FC<ContentWithAdsProps> = ({ children }) => {
    return (
        <div className="flex flex-col lg:flex-row gap-6 justify-center max-w-[1600px] mx-auto w-full">
            {/* Left Ad Space */}
            <AdPlaceholder label="Ad Space (Left)" />

            {/* Main Content */}
            <div className="flex-1 min-w-0">
                {children}
            </div>

            {/* Right Ad Space */}
            <AdPlaceholder label="Ad Space (Right)" />
        </div>
    );
};

export default ContentWithAds;

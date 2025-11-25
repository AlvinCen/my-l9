import React from 'react';
import AdSense from './AdSense';

interface ContentWithAdsProps {
    children: React.ReactNode;
}

const SidebarAd: React.FC = () => (
    <div className="hidden lg:flex w-[240px] flex-shrink-0 flex-col gap-4 transition-all duration-300">
        <div className="sticky top-24 w-full">
            <AdSense
                adSlot="9130683890"
                adFormat="auto"
                fullWidthResponsive={true}
                style={{ display: 'block', minHeight: '600px' }}
            />
        </div>
    </div>
);

const ContentWithAds: React.FC<ContentWithAdsProps> = ({ children }) => {
    return (
        <div className="flex flex-col lg:flex-row gap-6 justify-center max-w-[1600px] mx-auto w-full">
            {/* Left Ad Space */}
            <SidebarAd />

            {/* Main Content */}
            <div className="flex-1 min-w-0">
                {children}
            </div>

            {/* Right Ad Space */}
            <SidebarAd />
        </div>
    );
};

export default ContentWithAds;

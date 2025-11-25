import React, { useEffect, useRef, useState } from 'react';

interface AdSenseProps {
    adSlot: string;
    adFormat?: string;
    fullWidthResponsive?: boolean;
    style?: React.CSSProperties;
}

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

const AdSense: React.FC<AdSenseProps> = ({
    adSlot,
    adFormat = 'auto',
    fullWidthResponsive = true,
    style = { display: 'block' }
}) => {
    const adRef = useRef<HTMLModElement>(null);
    const [isLoaded, setIsLoaded] = useState(true); // Default true untuk menghindari flash
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        try {
            // Push ads ke adsbygoogle queue
            (window.adsbygoogle = window.adsbygoogle || []).push({});

            // Check jika iklan berhasil di-load setelah beberapa saat
            const checkAdLoad = setTimeout(() => {
                if (adRef.current) {
                    const adContent = adRef.current.innerHTML;
                    const hasContent = adContent && adContent.trim().length > 0;

                    // Jika tidak ada content atau status "unfilled"
                    const adStatus = adRef.current.getAttribute('data-ad-status');
                    if (adStatus === 'unfilled' || !hasContent) {
                        setIsLoaded(false);
                    }
                }
            }, 2000); // Check setelah 2 detik

            return () => clearTimeout(checkAdLoad);
        } catch (error) {
            console.error('AdSense error:', error);
            setHasError(true);
            setIsLoaded(false);
        }
    }, []);

    // Jika error atau tidak loaded, return null (tidak render apapun)
    if (hasError || !isLoaded) {
        return null;
    }

    return (
        <ins
            ref={adRef}
            className="adsbygoogle"
            style={style}
            data-ad-client="ca-pub-1323193450413502"
            data-ad-slot={adSlot}
            data-ad-format={adFormat}
            data-full-width-responsive={fullWidthResponsive.toString()}
        />
    );
};

export default AdSense;

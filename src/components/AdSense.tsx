import React, { useEffect, useRef, useState } from 'react';

interface AdSenseProps {
    adSlot: string;
    adFormat?: string;
    fullWidthResponsive?: boolean;
    style?: React.CSSProperties;
    className?: string;
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
    style = { display: 'block' },
    className = ''
}) => {
    const adRef = useRef<HTMLModElement>(null);
    const [isLoaded, setIsLoaded] = useState(true); // Default true untuk menghindari flash
    const [adStatus, setAdStatus] = useState<string | null>(null);
    const [hasError, setHasError] = useState(false);
    const isPushed = useRef(false); // Flag to prevent duplicate push

    const isLocalhost = typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    useEffect(() => {
        // Prevent duplicate push
        if (isPushed.current) return;

        const pushAd = () => {
            try {
                if (adRef.current && !adRef.current.hasAttribute('data-adsbygoogle-status')) {
                    if (adRef.current.offsetParent === null || adRef.current.offsetWidth === 0) {
                        setIsLoaded(false);
                        return;
                    }

                    isPushed.current = true;
                    (window.adsbygoogle = window.adsbygoogle || []).push({});

                    // MutationObserver to watch for status changes (e.g. 'unfilled')
                    const observer = new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            if (mutation.type === 'attributes' && mutation.attributeName === 'data-adsbygoogle-status') {
                                const status = adRef.current?.getAttribute('data-adsbygoogle-status');
                                setAdStatus(status || null);
                                if (status === 'unfilled') {
                                    console.log('AdSense: Status changed to unfilled, unmounting', { slot: adSlot });
                                    setIsLoaded(false);
                                }
                            }
                        });
                    });

                    if (adRef.current) {
                        observer.observe(adRef.current, { attributes: true });
                    }

                    isPushed.current = true;
                    (window.adsbygoogle = window.adsbygoogle || []).push({});

                    // Fallback check
                    setTimeout(() => {
                        if (adRef.current) {
                            const status = adRef.current.getAttribute('data-adsbygoogle-status');
                            setAdStatus(status || null);
                            // If still null after 2s, or unfilled, hide it
                            if (status === 'unfilled' || status === null) {
                                setIsLoaded(false);
                            }
                        }
                    }, 2000);
                }
            } catch (error: any) {
                if (error?.message?.includes('No slot size')) return;
                setHasError(true);
                setIsLoaded(false);
            }
        };

        const timer = setTimeout(pushAd, 100);
        return () => clearTimeout(timer);
    }, [adSlot]);

    if (hasError || !isLoaded) return null;

    // Only apply the className (which contains margins) if the ad is successfully loaded ('done')
    const appliedClassName = adStatus === 'done' ? className : '';

    // Force hide if unfilled, even if isLoaded is still true (react render cycle delay)
    const appliedStyle = adStatus === 'unfilled'
        ? { ...style, display: 'none !important' }
        : style;

    return (
        <ins
            ref={adRef}
            className={`adsbygoogle ${appliedClassName}`}
            style={appliedStyle}
            data-ad-client="ca-pub-1323193450413502"
            data-ad-slot={adSlot}
            data-ad-format={adFormat}
            data-full-width-responsive={fullWidthResponsive.toString()}
            data-adtest={isLocalhost ? "on" : undefined}
        />
    );
};

export default AdSense;

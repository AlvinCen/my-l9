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
    const [isLoaded, setIsLoaded] = useState(true);
    const [adStatus, setAdStatus] = useState<string | null>(null);
    const [hasError, setHasError] = useState(false);
    const isPushed = useRef(false);

    const isLocalhost = typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    useEffect(() => {
        if (isPushed.current) return;

        const pushAd = () => {
            try {
                // Check if ad blocker is active (adsbygoogle might be missing)
                if (!window.adsbygoogle) {
                    console.warn('AdSense: window.adsbygoogle not found (AdBlocker?)');
                    setIsLoaded(false);
                    return;
                }

                if (adRef.current && !adRef.current.hasAttribute('data-adsbygoogle-status')) {
                    if (adRef.current.offsetParent === null || adRef.current.offsetWidth === 0) {
                        // Element is hidden, don't push
                        setIsLoaded(false);
                        return;
                    }

                    isPushed.current = true;
                    (window.adsbygoogle = window.adsbygoogle || []).push({});

                    // MutationObserver to watch for status changes
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

                    // Fallback check - reduced to 1s to hide faster
                    setTimeout(() => {
                        if (adRef.current) {
                            const status = adRef.current.getAttribute('data-adsbygoogle-status');
                            setAdStatus(status || null);
                            // If still null after 1s, or unfilled, hide it
                            if (status === 'unfilled' || status === null) {
                                setIsLoaded(false);
                            }
                        }
                    }, 1000);
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

    const [hasHeight, setHasHeight] = useState(false);

    useEffect(() => {
        if (!adRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.contentRect.height > 0) {
                    setHasHeight(true);
                } else {
                    setHasHeight(false);
                }
            }
        });

        resizeObserver.observe(adRef.current);

        return () => resizeObserver.disconnect();
    }, []);

    if (hasError || !isLoaded) return null;

    // Show only if status is done AND it actually has significant height
    const shouldShow = adStatus === 'done' && hasHeight;

    return (
        <div
            className={shouldShow ? className : ''}
            style={shouldShow ? {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '0px',
                background: 'rgba(0, 0, 0, 0.2)', // Subtle background to show it exists
                borderRadius: '8px',
                overflow: 'hidden'
            } : {
                position: 'absolute',
                width: '100%',
                visibility: 'hidden',
                pointerEvents: 'none',
                opacity: 0,
                zIndex: -1
            }}
        >
            {shouldShow && (
                <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 mt-1">
                    Advertisement
                </span>
            )}
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-1323193450413502"
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive={fullWidthResponsive.toString()}
                data-adtest={isLocalhost ? "on" : undefined}
            />
        </div>
    );
};

export default AdSense;

import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import AdSense from '../../components/AdSense';

const OverlaySetupGuide: React.FC = () => {
    return (
        <div className="space-y-6">
            <PageHeader
                title="How to Use the Boss Timer Stream Overlay"
                description="Enhance your stream with a live boss timer overlay."
            />

            <Card>
                <div className="prose prose-invert max-w-none">
                    <h2>Overview of the Overlay</h2>
                    <p>
                        For content creators and streamers, we offer a dedicated <strong>Stream Overlay</strong>. This is a simplified, transparent version of the Boss Timer designed to be embedded directly into your streaming software (like OBS or Streamlabs).
                    </p>
                    <p>
                        It allows your viewers to see upcoming boss spawns in real-time without cluttering your screen with the full website UI.
                    </p>

                    <h2>Step-by-Step Setup</h2>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>
                            <strong>Generate the URL:</strong> Go to the <Link to="/boss-timer" className="text-blue-400 hover:underline">Boss Timer page</Link> and look for the "Overlay" button or section. Click it to generate your unique overlay URL.
                        </li>
                        <li>
                            <strong>Copy the URL:</strong> Click the "Copy" button to save the URL to your clipboard.
                        </li>
                        <li>
                            <strong>Add to OBS/Streamlabs:</strong>
                            <ul className="list-disc pl-6 mt-1">
                                <li>Open your streaming software.</li>
                                <li>Add a new source and select <strong>"Browser"</strong> (or "Browser Source").</li>
                                <li>Paste the URL you copied into the URL field.</li>
                                <li>Set the width to roughly <strong>800</strong> and height to <strong>200</strong> (you can adjust this later).</li>
                                <li>Click OK.</li>
                            </ul>
                        </li>
                    </ol>

                    <AdSense adSlot="6677889900" className="my-6 block" style={{ minHeight: '100px' }} />

                    <h2>Customization</h2>
                    <p>
                        You can customize the appearance of the overlay to match your stream's aesthetic:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            <strong>Server Selection:</strong> The overlay will track the server you selected when generating the URL.
                        </li>
                        <li>
                            <strong>Language:</strong> It supports multiple languages if the main site does.
                        </li>
                        <li>
                            <strong>Placement:</strong> We recommend placing it in a corner of your screen where it won't cover important game UI elements like the minimap or chat.
                        </li>
                    </ul>

                    <h2>Performance & Troubleshooting</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            <strong>Freezing:</strong> If the timer seems stuck, try refreshing the browser source in your streaming software (usually a button in the source properties).
                        </li>
                        <li>
                            <strong>Site Downtime:</strong> If Lordnine Tools is down for maintenance, the overlay may show a blank space or an error. This is normal and will resolve when the site is back up.
                        </li>
                        <li>
                            <strong>CPU Usage:</strong> The overlay is very lightweight and should have negligible impact on your streaming PC's performance.
                        </li>
                    </ul>

                    <div className="mt-8 pt-4 border-t border-gray-700">
                        <h3 className="text-lg font-semibold mb-2">Related Links</h3>
                        <ul className="space-y-1">
                            <li><Link to="/boss-timer" className="text-blue-400 hover:underline">Go to Boss Timer</Link></li>
                            <li><Link to="/guides/world-boss-timer" className="text-blue-400 hover:underline">Read the World Boss Timer Guide</Link></li>
                        </ul>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default OverlaySetupGuide;

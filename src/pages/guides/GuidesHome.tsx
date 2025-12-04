import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import AdSense from '../../components/AdSense';

const GuidesHome: React.FC = () => {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Guides & Tutorials"
                description="In-depth articles to help you master Lordnine."
            />

            <Card>
                <div className="prose prose-invert max-w-none mb-6">
                    <p>
                        Welcome to the <strong>Lordnine Tools Guides</strong> section. Here you will find a collection of detailed tutorials, explainers, and tips designed to help you get the most out of your gameplay and our tools.
                    </p>
                    <p>
                        Whether you are looking to optimize your boss hunting strategy, set up a professional stream overlay, or simply want to ensure you are redeeming codes safely, we have got you covered.
                    </p>
                </div>

                <AdSense adSlot="2233445566" className="my-6 block" style={{ minHeight: '100px' }} />

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Getting Started */}
                    <Link to="/guides/getting-started" className="block group">
                        <div className="border border-gray-700 rounded-lg p-4 h-full hover:bg-gray-800 transition-colors">
                            <h3 className="text-xl font-bold text-blue-400 group-hover:underline mb-2">Getting Started</h3>
                            <p className="text-gray-300">
                                New to Lordnine Tools? Start here! Learn about all the features we offer and how to use them efficiently to boost your progress.
                            </p>
                        </div>
                    </Link>

                    {/* World Boss Timer */}
                    <Link to="/guides/world-boss-timer" className="block group">
                        <div className="border border-gray-700 rounded-lg p-4 h-full hover:bg-gray-800 transition-colors">
                            <h3 className="text-xl font-bold text-blue-400 group-hover:underline mb-2">World Boss Timer Guide</h3>
                            <p className="text-gray-300">
                                Deep dive into how our boss timer works, how predictions are calculated, and how to use filters and notifications like a pro.
                            </p>
                        </div>
                    </Link>

                    {/* Overlay Setup */}
                    <Link to="/guides/overlay-setup" className="block group">
                        <div className="border border-gray-700 rounded-lg p-4 h-full hover:bg-gray-800 transition-colors">
                            <h3 className="text-xl font-bold text-blue-400 group-hover:underline mb-2">Stream Overlay Setup</h3>
                            <p className="text-gray-300">
                                A step-by-step guide for streamers on how to add our live boss timer overlay to OBS or Streamlabs.
                            </p>
                        </div>
                    </Link>

                    {/* Redeem Codes Safely */}
                    <Link to="/guides/redeem-codes-safely" className="block group">
                        <div className="border border-gray-700 rounded-lg p-4 h-full hover:bg-gray-800 transition-colors">
                            <h3 className="text-xl font-bold text-blue-400 group-hover:underline mb-2">How to Redeem Codes Safely</h3>
                            <p className="text-gray-300">
                                Learn best practices for redeeming codes, avoiding scams, and understanding how our community code list works.
                            </p>
                        </div>
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default GuidesHome;

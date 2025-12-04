import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import AdSense from '../../components/AdSense';

const GettingStartedGuide: React.FC = () => {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Getting Started with Lordnine Tools"
                description="Your essential companion for mastering Lordnine in SEA."
            />

            <Card>
                <div className="prose prose-invert max-w-none">
                    <h2>Introduction</h2>
                    <p>
                        Welcome to <strong>Lordnine Tools</strong>, the premier fan-made companion app for the Lordnine MMORPG.
                        Designed specifically for players in the SEA region, this toolset aims to bridge the gap between casual play and hardcore efficiency.
                    </p>
                    <p>
                        Whether you are tracking world bosses, planning your next build, or hunting for the latest redeem codes,
                        Lordnine Tools provides the utilities you need to stay ahead of the competition.
                        <em>Please note: This is a fan project and is not officially affiliated with the game developers.</em>
                    </p>

                    <AdSense adSlot="1234567890" className="my-6 block" style={{ minHeight: '100px' }} />

                    <h2>Feature Overview</h2>
                    <p>
                        Our platform offers a suite of features designed to solve common in-game challenges:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            <strong><Link to="/boss-timer" className="text-blue-400 hover:underline">Boss Timer</Link>:</strong>
                            Never miss a spawn again. Track boss cooldowns, see predictions based on community reports, and get notified when a boss is about to appear.
                        </li>
                        <li>
                            <strong><Link to="/builds/class-tag" className="text-blue-400 hover:underline">Builds (Class & Tag)</Link>:</strong>
                            Experiment with different class and tag combinations to find the perfect synergy for your playstyle.
                        </li>
                        <li>
                            <strong><Link to="/codes" className="text-blue-400 hover:underline">Codes</Link>:</strong>
                            A centralized list of active redeem codes. We track them so you don't have to search through social media.
                        </li>
                        <li>
                            <strong>Settings:</strong>
                            Customize your experience by selecting your server, adjusting notification sounds, and managing your data.
                        </li>
                    </ul>

                    <h2>How to Use the Site Efficiently</h2>
                    <p>
                        To get the most out of Lordnine Tools, we recommend the following workflow for new players:
                    </p>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>
                            <strong>Select Your Server:</strong> Go to the Settings page and choose your specific server. This ensures that the Boss Timer data is relevant to your world.
                        </li>
                        <li>
                            <strong>Pin Your Favorites:</strong> On the Boss Timer page, use the star icon to pin the bosses you are actively hunting. This moves them to the "Favorites" tab for quick access.
                        </li>
                        <li>
                            <strong>Check Codes Weekly:</strong> New codes are released periodically. Visit the Codes page once a week to claim free rewards before they expire.
                        </li>
                        <li>
                            <strong>Plan Ahead:</strong> Use the Build planners to map out your character's progression path, saving you time and resources in-game.
                        </li>
                    </ol>

                    <h2>Best Practices & Tips</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            <strong>Don't Miss Spawns:</strong> Keep the Boss Timer open on a second monitor or your phone while playing. Enable audio notifications to get an alert even when you're alt-tabbed.
                        </li>
                        <li>
                            <strong>Community Reporting:</strong> The accuracy of the timer relies on community input. If you see a boss die, please report it!
                        </li>
                        <li>
                            <strong>Safety First:</strong> Only redeem codes through official game channels. We list the codes, but you should always input them in the official launcher or website.
                        </li>
                    </ul>

                    <AdSense adSlot="0987654321" className="my-6 block" style={{ minHeight: '100px' }} />

                    <h2>Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold">Are spawn times 100% accurate?</h3>
                            <p>
                                Spawn times are predictions based on cooldowns and user reports. While we strive for accuracy, game mechanics like maintenance or server lag can cause variations.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Is this site allowed by the game?</h3>
                            <p>
                                Yes, this is a passive tool that does not interact with the game client or game data directly. It is safe to use alongside the game.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">How do I report a bug?</h3>
                            <p>
                                If you encounter issues, please reach out to the community channels or check for updates on the site.
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default GettingStartedGuide;

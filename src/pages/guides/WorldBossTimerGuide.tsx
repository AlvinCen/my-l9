import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import AdSense from '../../components/AdSense';

const WorldBossTimerGuide: React.FC = () => {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Lordnine World Boss Timer Guide"
                description="Master the spawn schedules and never miss a boss drop."
            />

            <Card>
                <div className="prose prose-invert max-w-none">
                    <h2>What Is the World Boss Timer?</h2>
                    <p>
                        The <strong>World Boss Timer</strong> is the heart of Lordnine Tools. It is a specialized utility designed to track and predict the spawn times of powerful field bosses in the SEA servers of Lordnine.
                    </p>
                    <p>
                        By aggregating community reports and calculating fixed cooldowns, we provide a real-time schedule of when bosses are likely to appear. This allows you to coordinate with your guild, prepare your gear, and be at the right place at the right time.
                    </p>

                    <AdSense adSlot="1122334455" className="my-6 block" style={{ minHeight: '100px' }} />

                    <h2>How Boss Predictions Work</h2>
                    <p>
                        Understanding the logic behind our timer can help you use it more effectively:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            <strong>Cooldown-Based Spawns:</strong> Most bosses in Lordnine operate on a fixed cooldown timer. Once a boss is defeated, a countdown begins. Our system adds this cooldown duration to the "Last Kill Time" to predict the "Next Spawn Time".
                        </li>
                        <li>
                            <strong>Community Reports:</strong> When a player reports a boss kill, our system updates the "Last Kill Time" for that server. This crowdsourced data is crucial for keeping the timer accurate.
                        </li>
                        <li>
                            <strong>Maintenance Impact:</strong> Server maintenance can reset or shift spawn timers. We try to adjust for these events, but always double-check in-game after a patch.
                        </li>
                    </ul>

                    <h2>Using Filters & Favorites</h2>
                    <p>
                        With so many bosses in the game, the list can get overwhelming. Here is how to manage it:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            <strong>Tabs:</strong> Use the tabs at the top to filter by boss type (e.g., "Field", "Destroyer").
                        </li>
                        <li>
                            <strong>Favorites:</strong> Click the star icon next to any boss to add it to your "Favorites" tab. This creates a personalized dashboard of just the bosses you care about.
                        </li>
                        <li>
                            <strong>Search & Filters:</strong> Use the search bar to find specific bosses by name. You can also check "Only spawning soon" to see what is coming up in the next hour.
                        </li>
                    </ul>

                    <h2>Notification Settings</h2>
                    <p>
                        You don't need to stare at the screen all day. Configure your notifications to get alerted when it matters:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            <strong>Volume Control:</strong> Adjust the alert volume to ensure you hear it over game sounds or music.
                        </li>
                        <li>
                            <strong>Pre-Spawn Alerts:</strong> Set an alert to trigger X minutes before a spawn. For example, setting it to 5 minutes gives you enough time to travel from town to the boss location.
                        </li>
                        <li>
                            <strong>Specific Bosses:</strong> You can choose to be notified only for "Greater bosses" or just your favorites.
                        </li>
                    </ul>

                    <AdSense adSlot="5544332211" className="my-6 block" style={{ minHeight: '100px' }} />

                    <h2>Troubleshooting & Limitations</h2>
                    <p>
                        While we aim for perfection, there are factors that can affect accuracy:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            <strong>Unsynced Reports:</strong> If no one reports a kill, the timer might show "Unknown" or an outdated prediction.
                        </li>
                        <li>
                            <strong>Drift:</strong> Small delays in kill times can add up over days, causing a "drift" in the prediction until a new report corrects it.
                        </li>
                    </ul>
                    <p>
                        Remember, this is a fan-run project. We provide the tools, but the community provides the data!
                    </p>

                    <div className="mt-8 pt-4 border-t border-gray-700">
                        <h3 className="text-lg font-semibold mb-2">Related Guides</h3>
                        <ul className="space-y-1">
                            <li><Link to="/boss-timer" className="text-blue-400 hover:underline">Go to Boss Timer</Link></li>
                            <li><Link to="/guides/overlay-setup" className="text-blue-400 hover:underline">Stream Overlay Setup Guide</Link></li>
                        </ul>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default WorldBossTimerGuide;

import React from 'react';
import PageHeader from '../components/PageHeader';

const About: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8 text-gray-300">
            <PageHeader
                title="About Lordnine Tools"
                description="The ultimate companion for Lordnine players."
            />

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white">What is Lordnine Tools?</h2>
                <p>
                    Lordnine Tools is a community-driven utility website designed to help players of the MMORPG <strong>Lordnine</strong> optimize their gameplay.
                    Our goal is to provide accurate, real-time information and planning tools to enhance your gaming experience.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                        <h3 className="text-xl font-semibold text-primary-400 mb-2">Boss Timer</h3>
                        <p>
                            Track World and Field bosses with precision. Our timer adjusts to your local timezone and server maintenance schedules.
                            Never miss a spawn with our customizable audio notifications and visual alerts.
                        </p>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                        <h3 className="text-xl font-semibold text-primary-400 mb-2">Stream Overlay</h3>
                        <p>
                            Are you a content creator? Use our specialized "Boss Timer Overlay" to display upcoming boss spawns directly on your stream.
                            It's fully customizable and integrates seamlessly with OBS or other streaming software.
                        </p>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                        <h3 className="text-xl font-semibold text-primary-400 mb-2">Game Codes</h3>
                        <p>
                            Stay up-to-date with the latest coupon codes for free in-game rewards. Our community can submit and verify codes to ensure
                            everyone gets the loot they deserve.
                        </p>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                        <h3 className="text-xl font-semibold text-primary-400 mb-2">Community Driven</h3>
                        <p>
                            We rely on player reports to keep our data accurate. You can report boss kills, vote on spawn times, and suggest new codes.
                            Together, we make the tool better for everyone.
                        </p>
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white">About the Game</h2>
                <p>
                    <strong>Lordnine</strong> is a visually stunning MMORPG that features intense combat, a vast open world, and a unique weapon mastery system.
                    Players can explore diverse regions, battle fearsome bosses, and engage in large-scale PvP battles.
                    This tool is a fan-made project and is not officially affiliated with the game developers.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Feedback & Support</h2>
                <p>
                    We are constantly working to improve Lordnine Tools. If you have suggestions, found a bug, or just want to say hello,
                    please reach out to us through our community channels.
                </p>
            </section>
        </div>
    );
};

export default About;

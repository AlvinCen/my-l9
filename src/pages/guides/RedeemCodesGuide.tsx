import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import AdSense from '../../components/AdSense';

const RedeemCodesGuide: React.FC = () => {
    return (
        <div className="space-y-6">
            <PageHeader
                title="How to Redeem Lordnine Codes Safely"
                description="Get free items safely and avoid scams."
            />

            <Card>
                <div className="prose prose-invert max-w-none">
                    <h2>What Are Codes?</h2>
                    <p>
                        <strong>Redeem Codes</strong> (or coupons) are special alphanumeric strings released by the Lordnine developers. They are promotional tools used to give players free in-game items such as potions, currency, or cosmetic gear.
                    </p>
                    <p>
                        These codes are usually time-limited, meaning they will expire after a certain date or after a certain number of uses.
                    </p>

                    <h2>Where to Redeem</h2>
                    <p>
                        It is critical to only redeem codes through official channels. Typically, you can redeem codes via:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>The official game launcher.</li>
                        <li>The official Lordnine website (look for a "Coupon" or "Redeem" section).</li>
                        <li>In-game menus (Settings {'>'} Account {'>'} Coupon).</li>
                    </ul>
                    <p className="text-yellow-400 font-semibold">
                        Always verify you are on the official site before entering your account details!
                    </p>

                    <AdSense adSlot="9988776655" className="my-6 block" style={{ minHeight: '100px' }} />

                    <h2>How the Codes Page Works</h2>
                    <p>
                        Our <Link to="/codes" className="text-blue-400 hover:underline">Codes Page</Link> is a community-driven list of active codes.
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            <strong>Active vs. Expired:</strong> We try to keep the list updated, moving old codes to the "Expired" section so you don't waste your time.
                        </li>
                        <li>
                            <strong>Region Tags:</strong> Some codes are region-specific (e.g., SEA only, KR only). Check the tags before trying to redeem.
                        </li>
                        <li>
                            <strong>Suggest a Code:</strong> Found a new code? You can submit it through our "Suggest Code" feature. Once verified, it will be added to the list for everyone to see.
                        </li>
                    </ul>

                    <h2>Safety & Scam Warnings</h2>
                    <p>
                        With free items comes the risk of scams. Please stay vigilant:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            <strong>Phishing Sites:</strong> Be wary of websites that look like the official one but have slightly different URLs. They may try to steal your login credentials.
                        </li>
                        <li>
                            <strong>"Redeem Service" Scams:</strong> Never give your password to someone claiming they will redeem a code for you. No legitimate admin or helper will ever ask for your password.
                        </li>
                        <li>
                            <strong>Fake Codes:</strong> Some sites list fake codes to get clicks. We verify our codes as best as we can to ensure they are legitimate.
                        </li>
                    </ul>

                    <h2>Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold">Why does it say "Code already used"?</h3>
                            <p>
                                This usually means you have already redeemed this code on your account. Most codes can only be used once per account.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">The code is valid but not working?</h3>
                            <p>
                                Check for typos (O vs 0, I vs 1) and ensure you are in the correct region. Also, the code might have just expired.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-gray-700">
                        <h3 className="text-lg font-semibold mb-2">Ready to claim rewards?</h3>
                        <Link to="/codes" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
                            Go to Codes Page
                        </Link>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default RedeemCodesGuide;

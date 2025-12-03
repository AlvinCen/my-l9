import React from 'react';
import PageHeader from '../components/PageHeader';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8 text-gray-300">
            <PageHeader
                title="Privacy Policy"
                description="Last updated: December 3, 2025"
            />

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white">1. Introduction</h2>
                <p>
                    Welcome to Lordnine Tools ("we," "our," or "us"). We are committed to protecting your privacy.
                    This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white">2. Information We Collect</h2>
                <p>
                    We do not collect any personal identification information (PII) such as names, email addresses, or phone numbers.
                    Our application uses local storage on your device to save your preferences, such as:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Selected server and region</li>
                    <li>Notification settings</li>
                    <li>Boss favorites</li>
                    <li>Overlay configuration</li>
                </ul>
                <p>
                    This data remains on your device and is not transmitted to our servers.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white">3. Third-Party Services</h2>
                <p>
                    We use third-party services that may collect information used to identify you.
                </p>

                <h3 className="text-xl font-semibold text-white">Google AdSense</h3>
                <p>
                    We use Google AdSense to display advertisements. Google uses cookies to serve ads based on your prior visits to our website or other websites.
                    Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our site and/or other sites on the Internet.
                </p>
                <p>
                    You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">Google Ads Settings</a>.
                </p>

                <h3 className="text-xl font-semibold text-white">Firebase</h3>
                <p>
                    We use Google Firebase for hosting and backend services. Firebase may collect IP addresses and other usage data for security and analytics purposes.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white">4. Cookies</h2>
                <p>
                    Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers.
                    These are sent to your browser from the websites that you visit and are stored on your device's internal memory.
                </p>
                <p>
                    This Service does not use these "cookies" explicitly. However, the app may use third-party code and libraries that use "cookies" to collect information and improve their services.
                    You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white">5. Changes to This Privacy Policy</h2>
                <p>
                    We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes.
                    We will notify you of any changes by posting the new Privacy Policy on this page.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white">6. Contact Us</h2>
                <p>
                    If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.
                </p>
            </section>
        </div>
    );
};

export default PrivacyPolicy;

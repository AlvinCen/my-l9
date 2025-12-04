import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import { GAME_CODES, GameCode } from '../data/codes';
import { useCodeSuggestions } from '../hooks/useCodeSuggestions';

const Codes: React.FC = () => {
    const { addSuggestion } = useCodeSuggestions();

    // Form State
    const [formState, setFormState] = useState({
        code: '',
        region: 'SEA' as const,
        rewardsText: '',
        sourceUrl: '',
        note: '',
    });
    const [submitMsg, setSubmitMsg] = useState('');

    const handleSuggest = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formState.code || !formState.rewardsText) return;

        addSuggestion({
            code: formState.code.toUpperCase(),
            region: formState.region,
            rewardsText: formState.rewardsText,
            sourceUrl: formState.sourceUrl,
            note: formState.note,
        });

        setFormState({
            code: '',
            region: 'SEA',
            rewardsText: '',
            sourceUrl: '',
            note: '',
        });
        setSubmitMsg('Suggestion submitted! Thank you.');
        setTimeout(() => setSubmitMsg(''), 3000);
    };

    const availableCodes = GAME_CODES.filter(c => c.status === 'AVAILABLE');
    const expiredCodes = GAME_CODES.filter(c => c.status === 'EXPIRED');

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Optional: toast notification could go here
    };

    const renderCodeList = (codes: GameCode[], isExpired = false) => (
        <div className="space-y-4">
            {codes.length === 0 && <p className="text-gray-500 italic">No {isExpired ? 'expired' : 'available'} codes at the moment.</p>}
            {codes.map(code => (
                <div key={code.id} className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border ${isExpired ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-800 border-gray-600'}`}>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => copyToClipboard(code.code)}
                                className={`text-lg md:text-xl font-mono font-bold px-3 py-1 rounded border-2 border-dashed active:scale-95 transition-transform ${isExpired ? 'text-gray-500 border-gray-600' : 'text-primary-400 border-primary-500 hover:bg-primary-900/20'}`}
                                title="Click to copy"
                            >
                                {code.code}
                            </button>
                            <span className="text-xs font-bold bg-gray-700 text-gray-300 px-2 py-1 rounded uppercase">{code.region}</span>
                            {code.expiresAt && !isExpired && (
                                <span className="text-xs text-yellow-500">Expires: {new Date(code.expiresAt).toLocaleDateString()}</span>
                            )}
                        </div>
                        <div>
                            <h3 className={`font-bold ${isExpired ? 'text-gray-500' : 'text-white'}`}>{code.title}</h3>
                            <p className="text-sm text-gray-400">{code.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {code.rewards.map((r, idx) => (
                                <span key={idx} className={`text-xs px-2 py-1 rounded-full ${isExpired ? 'bg-gray-700 text-gray-500' : 'bg-primary-900 text-primary-200 border border-primary-700'}`}>
                                    {r.quantity}x {r.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="space-y-8">
            <PageHeader title="Codes" description="Track and share Lordnine redeem codes." />

            <Card>
                <div className="prose prose-invert max-w-none text-gray-300">
                    <p>
                        Redeem codes are a great way to get free items in Lordnine.
                        We list all currently active codes below, along with their rewards and region restrictions.
                    </p>
                    <p className="text-sm">
                        <strong>Disclaimer:</strong> We are not affiliated with the game developers.
                        Codes are community-sourced and may expire at any time.
                        Always redeem codes through the official game launcher or website.
                        <br />
                        <Link to="/guides/redeem-codes-safely" className="text-blue-400 hover:underline">Read our guide on redeeming codes safely.</Link>
                    </p>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Code Lists */}
                <div className="lg:col-span-2 space-y-8">
                    <Card title="Available Codes">
                        {renderCodeList(availableCodes)}
                    </Card>

                    <Card title="Expired / Unavailable">
                        {renderCodeList(expiredCodes, true)}
                    </Card>
                </div>

                {/* Right Column: Suggestion Form */}
                <div>
                    <Card title="Suggest a Code">
                        <form onSubmit={handleSuggest} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Code *</label>
                                <input
                                    type="text"
                                    required
                                    value={formState.code}
                                    onChange={e => setFormState({ ...formState, code: e.target.value })}
                                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white uppercase font-mono"
                                    placeholder="ABC123XYZ"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Region</label>
                                <select
                                    value={formState.region}
                                    onChange={e => setFormState({ ...formState, region: e.target.value as any })}
                                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
                                >
                                    <option value="SEA">SEA</option>
                                    <option value="GLOBAL">GLOBAL</option>
                                    <option value="KR">KR</option>
                                    <option value="JP">JP</option>
                                    <option value="OTHER">OTHER</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Rewards *</label>
                                <textarea
                                    required
                                    value={formState.rewardsText}
                                    onChange={e => setFormState({ ...formState, rewardsText: e.target.value })}
                                    rows={2}
                                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
                                    placeholder="e.g. 100k Gold, 5 Potions"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Source URL</label>
                                <input
                                    type="url"
                                    value={formState.sourceUrl}
                                    onChange={e => setFormState({ ...formState, sourceUrl: e.target.value })}
                                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Note</label>
                                <textarea
                                    value={formState.note}
                                    onChange={e => setFormState({ ...formState, note: e.target.value })}
                                    rows={2}
                                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
                                    placeholder="Any additional info..."
                                />
                            </div>

                            <Button type="submit" className="w-full">Submit Suggestion</Button>
                            {submitMsg && <p className="text-center text-sm text-green-400 mt-2">{submitMsg}</p>}
                        </form>
                        <p className="text-xs text-gray-500 mt-4">
                            Note: Suggestions are stored locally until an admin reviews them (simulated).
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Codes;
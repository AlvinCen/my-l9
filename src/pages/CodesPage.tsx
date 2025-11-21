
import React, { useState, useRef } from 'react';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import { GAME_CODES, GameCode, Region } from '../data/codes';
import { useCodeSuggestions } from '../hooks/useCodeSuggestions';
import { useSettings } from '../contexts/SettingsContext';

// --- Helpers ---

const getDaysDiff = (dateStr: string) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffTime = date.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const formatTimeAgo = (dateStr?: string) => {
  if (!dateStr) return '';
  const diffDays = -getDaysDiff(dateStr);
  if (diffDays < 0) return 'Upcoming';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
};

const formatExpiry = (dateStr?: string) => {
  if (!dateStr) return 'No expiry';
  const diffDays = getDaysDiff(dateStr);
  if (diffDays < 0) return `Expired ${Math.abs(diffDays)} days ago`;
  if (diffDays === 0) return 'Expires today';
  return `Expires in ${diffDays} days`;
};

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CodeRow: React.FC<{ code: GameCode; isExpired?: boolean }> = ({ code, isExpired }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(code.code);
    // In a real app, trigger a toast here
  };

  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 py-4 border-b ${isExpired ? 'border-gray-700/50 opacity-75' : 'border-gray-700'} last:border-0`}>
      {/* Left: Time */}
      <div className="w-full sm:w-20 flex-shrink-0 text-xs text-gray-500 sm:text-right">
        {formatTimeAgo(code.availableSince)}
      </div>

      {/* Center: Code & Expiry */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <button 
            onClick={handleCopy}
            className={`font-mono font-bold text-base px-2 py-0.5 rounded border border-dashed transition-all active:scale-95 flex items-center gap-2
              ${isExpired 
                ? 'bg-gray-800 text-gray-500 border-gray-600 cursor-not-allowed' 
                : 'bg-primary-900/30 text-primary-300 border-primary-600 hover:bg-primary-900/50 hover:text-white'
              }`}
          >
            {code.code}
            {!isExpired && <CopyIcon />}
          </button>
          <span className="text-[10px] font-bold bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded uppercase tracking-wider">
            {code.region}
          </span>
        </div>
        <div className={`text-xs mt-1 ${isExpired ? 'text-red-400' : 'text-yellow-500'}`}>
          {formatExpiry(code.expiresAt)}
        </div>
      </div>

      {/* Right: Rewards */}
      <div className="w-full sm:w-auto flex flex-wrap sm:flex-col sm:items-end gap-1">
        {code.rewards.map((r, i) => (
          <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full truncate max-w-[150px] ${isExpired ? 'bg-gray-700 text-gray-500' : 'bg-gray-700 text-gray-300'}`}>
            {r.quantity}x {r.name}
          </span>
        ))}
      </div>
    </div>
  );
};

const CodesPage: React.FC = () => {
  const { settings } = useSettings();
  const { suggestions, addSuggestion, deleteSuggestion } = useCodeSuggestions();
  const formRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formState, setFormState] = useState({
    code: '',
    region: 'SEA' as Region,
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

    setFormState({ code: '', region: 'SEA', rewardsText: '', sourceUrl: '', note: '' });
    setSubmitMsg('Suggestion submitted! Thank you.');
    setTimeout(() => setSubmitMsg(''), 3000);
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const isExpired = (code: GameCode) => {
    if (code.status === 'EXPIRED') return true;
    if (code.expiresAt) {
      return new Date(code.expiresAt) < new Date();
    }
    return false;
  };

  const availableCodes = GAME_CODES.filter(c => !isExpired(c));
  const expiredCodes = GAME_CODES.filter(c => isExpired(c));

  return (
    <div className="space-y-8">
      <PageHeader title="Codes" description="Redeem and share Lordnine codes." />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Content / Banners (Approx 60-65%) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Placeholder Banner 1 */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-900 to-purple-900 p-8 text-white shadow-lg border border-indigo-500/30 min-h-[200px] flex flex-col justify-center">
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-bold uppercase tracking-wider mb-3">
                Event
              </span>
              <h2 className="text-3xl font-bold mb-2">Upcoming Server Merge</h2>
              <p className="text-indigo-100 max-w-md">
                Prepare for the new era. Check the details for server merges scheduled for next week.
              </p>
            </div>
            {/* Decorative BG Element */}
            <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />
          </div>

          {/* Placeholder Banner 2 */}
          <div className="relative overflow-hidden rounded-xl bg-gray-800 border border-gray-700 p-6 shadow-md flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">Patch Notes: v1.2.0</h3>
              <p className="text-gray-400 text-sm mb-4">
                New "Abyss" raid added, class balance changes for Ranger and Paladin, and new winter cosmetics.
              </p>
              <button className="text-sm font-semibold text-primary-400 hover:text-primary-300">Read more →</button>
            </div>
             <div className="w-full md:w-1/3 bg-gray-700 rounded-lg h-32 md:h-auto flex items-center justify-center">
                <span className="text-gray-500 text-xs">Image Placeholder</span>
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Coupons List (Approx 35-40%) */}
        <div className="lg:col-span-5">
          <Card className="sticky top-24">
            {/* Card Header */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white">Codes</h3>
              <div className="flex gap-2">
                 <button className="text-xs font-medium text-gray-400 hover:text-white transition-colors">See more</button>
                 <span className="text-gray-600">|</span>
                 <button 
                   onClick={scrollToForm}
                   className="text-xs font-bold text-primary-400 hover:text-primary-300 transition-colors"
                 >
                   Suggest code
                 </button>
              </div>
            </div>

            {/* Available Codes */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Available</h4>
              <div className="bg-gray-900/50 rounded-lg border border-gray-700/50 px-4">
                 {availableCodes.length > 0 ? (
                   availableCodes.map(code => <CodeRow key={code.id} code={code} />)
                 ) : (
                   <p className="py-4 text-center text-sm text-gray-500 italic">No available codes.</p>
                 )}
              </div>
            </div>

            {/* Expired Codes */}
            <div>
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Unavailable / Expired</h4>
               <div className="bg-gray-900/30 rounded-lg border border-gray-800 px-4">
                 {expiredCodes.length > 0 ? (
                   expiredCodes.map(code => <CodeRow key={code.id} code={code} isExpired />)
                 ) : (
                   <p className="py-4 text-center text-sm text-gray-600 italic">No expired codes.</p>
                 )}
              </div>
            </div>
          </Card>
        </div>

      </div>

      {/* BOTTOM: Suggestion Form */}
      <div ref={formRef} className="max-w-3xl mx-auto pt-8 border-t border-gray-800">
         <Card title="Suggest a Code">
            <form onSubmit={handleSuggest} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                 <p className="text-sm text-gray-400 mb-4">
                   Found a new code? Submit it here to help the community. Suggestions are stored locally for now.
                 </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300">Code *</label>
                <input
                  type="text"
                  required
                  value={formState.code}
                  onChange={(e) => setFormState({ ...formState, code: e.target.value.toUpperCase() })}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white uppercase font-mono"
                  placeholder="ABC123XYZ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Region</label>
                <select
                  value={formState.region}
                  onChange={(e) => setFormState({ ...formState, region: e.target.value as Region })}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
                >
                  <option value="SEA">SEA</option>
                  <option value="GLOBAL">GLOBAL</option>
                  <option value="KR">KR</option>
                  <option value="JP">JP</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300">Rewards *</label>
                <input
                  type="text"
                  required
                  value={formState.rewardsText}
                  onChange={(e) => setFormState({ ...formState, rewardsText: e.target.value })}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
                  placeholder="e.g. 100k Gold, 5 Potions"
                />
              </div>
              <div className="md:col-span-2">
                 <Button type="submit" className="w-full">Submit Suggestion</Button>
                 {submitMsg && <p className="text-center text-sm text-green-400 mt-2">{submitMsg}</p>}
              </div>
            </form>
         </Card>
      </div>

      {/* BOTTOM: Admin Table */}
      {settings.isAdmin && suggestions.length > 0 && (
        <div className="max-w-3xl mx-auto">
            <Card title="Suggested Codes (Admin)" className="border-t-4 border-red-800">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-200 uppercase bg-gray-700">
                      <tr>
                        <th className="px-4 py-2">Code</th>
                        <th className="px-4 py-2">Reg</th>
                        <th className="px-4 py-2">Rewards</th>
                        <th className="px-4 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suggestions.map((s) => (
                        <tr key={s.id} className="bg-gray-800 border-b border-gray-700">
                          <td className="px-4 py-2 font-mono font-bold text-white">{s.code}</td>
                          <td className="px-4 py-2">{s.region}</td>
                          <td className="px-4 py-2">{s.rewardsText}</td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => deleteSuggestion(s.id)}
                              className="text-red-400 hover:text-red-300 font-bold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            </Card>
        </div>
      )}
    </div>
  );
};

export default CodesPage;

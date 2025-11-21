
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ClassBuild } from '../types';
import { classes, abilities, tags } from '../data/classesAndTags';
import { generateUUID, encodeToUrl, decodeFromUrl } from '../utils/helpers';

const MAX_ABILITIES = 6;
const MAX_TAGS = 3;

const newBuildTemplate: Omit<ClassBuild, 'id'> = {
    name: "New Build",
    classId: classes[0].id,
    abilities: [],
    tags: [],
    notes: ""
};

const ClassTagPlanner: React.FC = () => {
    const [builds, setBuilds] = useLocalStorage<ClassBuild[]>('ln_class_builds', []);
    const [activeBuild, setActiveBuild] = useState<ClassBuild>({id: generateUUID(), ...newBuildTemplate});
    
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const buildData = queryParams.get('build');
        if (buildData) {
            const decodedBuild = decodeFromUrl<Omit<ClassBuild, 'id'>>(buildData);
            if (decodedBuild) {
                setActiveBuild({ id: 'shared-' + Date.now(), ...decodedBuild });
                // Clear the URL param
                navigate(location.pathname, { replace: true });
            }
        } else if (builds.length > 0) {
            setActiveBuild(builds[0]);
        }
    }, []); // Run only on mount

    const handleSave = () => {
        const existingIndex = builds.findIndex(b => b.id === activeBuild.id);
        if (existingIndex > -1) {
            const updatedBuilds = [...builds];
            updatedBuilds[existingIndex] = activeBuild;
            setBuilds(updatedBuilds);
        } else {
            setBuilds([activeBuild, ...builds]);
        }
        alert("Build saved!");
    };
    
    const handleNew = () => {
        setActiveBuild({id: generateUUID(), ...newBuildTemplate});
    }

    const handleDelete = (id: string) => {
        if(window.confirm("Are you sure you want to delete this build?")) {
            const newBuilds = builds.filter(b => b.id !== id);
            setBuilds(newBuilds);
            if(activeBuild.id === id) {
                setActiveBuild(newBuilds.length > 0 ? newBuilds[0] : {id: generateUUID(), ...newBuildTemplate});
            }
        }
    }
    
    const handleShare = () => {
        const { id, ...buildToShare } = activeBuild;
        const encoded = encodeToUrl(buildToShare);
        const url = `${window.location.origin}${window.location.pathname}#/builds/class-tag?build=${encoded}`;
        navigator.clipboard.writeText(url).then(() => {
            alert('Shareable link copied to clipboard!');
        });
    };

    const toggleAbility = (id: string) => {
        const newAbilities = activeBuild.abilities.includes(id) 
            ? activeBuild.abilities.filter(a => a !== id)
            : [...activeBuild.abilities, id];

        if (newAbilities.length <= MAX_ABILITIES) {
            setActiveBuild({ ...activeBuild, abilities: newAbilities });
        } else {
            alert(`You can only select up to ${MAX_ABILITIES} abilities.`);
        }
    };
    
    const toggleTag = (id: string) => {
        const newTags = activeBuild.tags.includes(id) 
            ? activeBuild.tags.filter(t => t !== id)
            : [...activeBuild.tags, id];
        
        if (newTags.length <= MAX_TAGS) {
            setActiveBuild({ ...activeBuild, tags: newTags });
        } else {
            alert(`You can only select up to ${MAX_TAGS} tags.`);
        }
    };

    const selectedClass = classes.find(c => c.id === activeBuild.classId);

  return (
    <div>
      <PageHeader title="Class & Tag Planner" description="Create and save your class builds." />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Build List */}
        <div className="lg:col-span-1">
             <Card title="My Builds" titleAction={<Button size="sm" onClick={handleNew}>New</Button>}>
                <div className="space-y-2">
                    {builds.length > 0 ? builds.map(b => (
                        <div key={b.id} className={`p-2 rounded cursor-pointer flex justify-between items-center ${activeBuild.id === b.id ? 'bg-primary-700' : 'bg-gray-700 hover:bg-gray-600'}`} onClick={() => setActiveBuild(b)}>
                            <span>{b.name}</span>
                            <Button size="sm" variant="danger" onClick={(e) => { e.stopPropagation(); handleDelete(b.id) }}>X</Button>
                        </div>
                    )) : <p className="text-gray-400 text-center">No builds saved.</p>}
                </div>
             </Card>
        </div>

        {/* Builder */}
        <div className="lg:col-span-3">
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Class & Abilities */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex space-x-4">
                            <input type="text" value={activeBuild.name} onChange={e => setActiveBuild({...activeBuild, name: e.target.value})} className="flex-grow bg-gray-900 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-lg font-bold" />
                            <select value={activeBuild.classId} onChange={e => setActiveBuild({...activeBuild, classId: e.target.value, abilities: []})} className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3">
                                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold mb-2">Abilities ({activeBuild.abilities.length}/{MAX_ABILITIES})</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {abilities.map(a => (
                                    <div key={a.id} onClick={() => toggleAbility(a.id)} className={`p-2 rounded cursor-pointer border-2 ${activeBuild.abilities.includes(a.id) ? 'border-primary-500 bg-primary-900/50' : 'border-gray-600 bg-gray-700 hover:bg-gray-600'}`}>
                                        <p className="font-bold">{a.name}</p>
                                        <p className="text-xs text-gray-400">{a.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Tags & Summary */}
                    <div>
                         <h4 className="font-semibold mb-2">Tags ({activeBuild.tags.length}/{MAX_TAGS})</h4>
                         <div className="space-y-2 mb-4">
                            {tags.map(t => (
                                <div key={t.id} onClick={() => toggleTag(t.id)} className={`p-2 rounded cursor-pointer border-2 ${activeBuild.tags.includes(t.id) ? 'border-primary-500 bg-primary-900/50' : 'border-gray-600 bg-gray-700 hover:bg-gray-600'}`}>
                                     <p className="font-bold">{t.name}</p>
                                </div>
                            ))}
                         </div>
                         <div className="bg-gray-900 p-4 rounded">
                            <h4 className="font-bold text-lg border-b border-gray-700 pb-2 mb-2">Summary</h4>
                            <p>Class: <span className="font-semibold text-primary-400">{selectedClass?.name}</span></p>
                            <p>Weapon: <span className="font-semibold">{selectedClass?.weaponType}</span></p>
                            <p>Role: <span className="font-semibold">{selectedClass?.role}</span></p>
                         </div>
                    </div>
                </div>
                 <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-300">Notes</label>
                    <textarea value={activeBuild.notes} onChange={e => setActiveBuild({...activeBuild, notes: e.target.value})} rows={3} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"></textarea>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    <Button variant="secondary" onClick={handleShare}>Share Build</Button>
                    <Button onClick={handleSave}>Save Build</Button>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default ClassTagPlanner;

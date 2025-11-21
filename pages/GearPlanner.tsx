
import React, { useState, useMemo } from 'react';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { GearBuild, GearSlot, GearItem } from '../types';
import { gearSlots, gearItems, rarityColors } from '../data/gear';
import { generateUUID } from '../utils/helpers';

const newBuildTemplate: Omit<GearBuild, 'id'> = {
    name: "New Gear Set",
    slotAssignments: {},
};

const GearPlanner: React.FC = () => {
  const [builds, setBuilds] = useLocalStorage<GearBuild[]>('ln_gear_builds', []);
  const [activeBuild, setActiveBuild] = useState<GearBuild>({ id: generateUUID(), ...newBuildTemplate });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<GearSlot | null>(null);

  const handleNewBuild = () => {
    setActiveBuild({ id: generateUUID(), ...newBuildTemplate });
  };

  const handleSaveBuild = () => {
    const existingIndex = builds.findIndex(b => b.id === activeBuild.id);
    if (existingIndex > -1) {
      const updated = [...builds];
      updated[existingIndex] = activeBuild;
      setBuilds(updated);
    } else {
      setBuilds([activeBuild, ...builds]);
    }
    alert("Gear set saved!");
  };

   const handleDeleteBuild = (id: string) => {
        if(window.confirm("Are you sure you want to delete this gear set?")) {
            const newBuilds = builds.filter(b => b.id !== id);
            setBuilds(newBuilds);
            if(activeBuild.id === id) {
                handleNewBuild();
            }
        }
    }

  const openItemSelector = (slot: GearSlot) => {
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const selectItem = (itemId: string | null) => {
    if (selectedSlot) {
      setActiveBuild(prev => ({
        ...prev,
        slotAssignments: { ...prev.slotAssignments, [selectedSlot]: itemId }
      }));
    }
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  const aggregatedStats = useMemo(() => {
    const stats = { cp: 0, attack: 0, defense: 0, crit: 0, hp: 0 };
    for (const slot of gearSlots) {
      const itemId = activeBuild.slotAssignments[slot];
      if (itemId) {
        const item = gearItems.find(i => i.id === itemId);
        if (item) {
          stats.cp += item.stats.cp || 0;
          stats.attack += item.stats.attack || 0;
          stats.defense += item.stats.defense || 0;
          stats.crit += item.stats.crit || 0;
          stats.hp += item.stats.hp || 0;
        }
      }
    }
    return stats;
  }, [activeBuild.slotAssignments]);

  const itemsForSlot = gearItems.filter(item => item.slot === selectedSlot);

  return (
    <div>
      <PageHeader title="Gear Planner" description="Assemble and compare your gear sets." />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Build List */}
        <div className="lg:col-span-1">
          <Card title="My Gear Sets" titleAction={<Button size="sm" onClick={handleNewBuild}>New</Button>}>
            <div className="space-y-2">
              {builds.map(b => (
                <div key={b.id} className={`p-2 rounded cursor-pointer flex justify-between items-center ${activeBuild.id === b.id ? 'bg-primary-700' : 'bg-gray-700 hover:bg-gray-600'}`} onClick={() => setActiveBuild(b)}>
                    <span>{b.name}</span>
                    <Button size="sm" variant="danger" onClick={(e) => { e.stopPropagation(); handleDeleteBuild(b.id) }}>X</Button>
                </div>
              ))}
              {builds.length === 0 && <p className="text-center text-gray-400">No gear sets saved.</p>}
            </div>
          </Card>
           <Card title="Aggregated Stats" className="mt-6">
            <div className="space-y-1 text-sm">
                <p>Total CP: <span className="font-bold text-primary-400">{aggregatedStats.cp.toLocaleString()}</span></p>
                <p>Attack: <span className="font-bold">{aggregatedStats.attack.toLocaleString()}</span></p>
                <p>Defense: <span className="font-bold">{aggregatedStats.defense.toLocaleString()}</span></p>
                <p>Crit: <span className="font-bold">{aggregatedStats.crit.toLocaleString()}</span></p>
                <p>HP: <span className="font-bold">{aggregatedStats.hp.toLocaleString()}</span></p>
            </div>
          </Card>
        </div>

        {/* Gear Grid */}
        <div className="lg:col-span-3">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <input type="text" value={activeBuild.name} onChange={e => setActiveBuild({ ...activeBuild, name: e.target.value })} className="bg-gray-900 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-lg font-bold" />
              <Button onClick={handleSaveBuild}>Save Set</Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gearSlots.map(slot => {
                const itemId = activeBuild.slotAssignments[slot];
                const item = itemId ? gearItems.find(i => i.id === itemId) : null;
                return (
                  <div key={slot} onClick={() => openItemSelector(slot)} className="bg-gray-700 aspect-square rounded-lg flex flex-col justify-center items-center p-2 cursor-pointer border-2 border-dashed border-gray-600 hover:border-primary-500 hover:bg-gray-600 transition">
                    {item ? (
                      <div className="text-center">
                        <p className={`font-bold ${rarityColors[item.rarity]}`}>{item.name}</p>
                        <p className="text-xs text-gray-400 capitalize">{item.slot}</p>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500">
                        <p className="font-bold capitalize">{slot}</p>
                        <p className="text-sm">+ Equip Item</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Select Item for ${selectedSlot}`}>
        <div className="space-y-2">
            <div onClick={() => selectItem(null)} className="p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 text-center">
                <p className="font-bold text-red-400">Unequip Item</p>
            </div>
            {itemsForSlot.map(item => (
                <div key={item.id} onClick={() => selectItem(item.id)} className="p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600">
                    <p className={`font-bold ${rarityColors[item.rarity]}`}>{item.name}</p>
                    <div className="text-xs text-gray-400 flex space-x-2">
                        {Object.entries(item.stats).map(([key, value]) => <span key={key}>{key.toUpperCase()}: {value}</span>)}
                    </div>
                </div>
            ))}
        </div>
      </Modal>
    </div>
  );
};

export default GearPlanner;

import React, { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ChecklistState, ChecklistTask } from '../../types';
import { checklistTasks } from '../data/checklist';

const getWeekKey = (d: Date) => {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return d.getUTCFullYear() + '-W' + weekNo;
}

const Checklist: React.FC = () => {
  const [checklistState, setChecklistState] = useLocalStorage<ChecklistState>('ln_checklist', {});
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');

  const todayKey = new Date().toISOString().split('T')[0];
  const thisWeekKey = getWeekKey(new Date());

  const tasksByType = useMemo(() => {
    return checklistTasks.reduce((acc, task) => {
      (acc[task.type] = acc[task.type] || []).push(task);
      return acc;
    }, {} as Record<'daily' | 'weekly', ChecklistTask[]>);
  }, []);

  const handleToggle = (taskId: string, type: 'daily' | 'weekly') => {
    const key = type === 'daily' ? todayKey : thisWeekKey;
    setChecklistState(prev => {
      const newDayState = { ...(prev[key] || {}) };
      newDayState[taskId] = !newDayState[taskId];
      return { ...prev, [key]: newDayState };
    });
  };

  const renderTaskList = (type: 'daily' | 'weekly') => {
    const tasks = tasksByType[type] || [];
    const key = type === 'daily' ? todayKey : thisWeekKey;
    const completedTasks = Object.values(checklistState[key] || {}).filter(Boolean).length;

    const tasksByCategory = tasks.reduce((acc, task) => {
      (acc[task.category] = acc[task.category] || []).push(task);
      return acc;
    }, {} as Record<string, ChecklistTask[]>);

    return (
      <div>
        <div className="mb-4">
          <div className="flex justify-between items-center text-lg mb-2">
            <span>Progress</span>
            <span>{completedTasks} / {tasks.length}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}%` }}></div>
          </div>
        </div>

        {/* FIX: Use Object.keys to iterate over tasksByCategory. 
                Object.entries can lead to type inference issues with indexed types, 
                resulting in the value being typed as 'unknown'. Accessing the property
                directly after getting the keys ensures correct type inference. */}
        {Object.keys(tasksByCategory).map((category) => (
          <div key={category} className="mb-4">
            <h3 className="text-lg font-semibold text-primary-400 mb-2">{category}</h3>
            <div className="space-y-2">
              {tasksByCategory[category].map(task => (
                <label key={task.id} className="flex items-center bg-gray-700 p-3 rounded-md hover:bg-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!checklistState[key]?.[task.id]}
                    onChange={() => handleToggle(task.id, type)}
                    className="h-5 w-5 rounded border-gray-500 text-primary-600 bg-gray-800 focus:ring-primary-500"
                  />
                  <span className="ml-3 text-gray-200">{task.name}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <PageHeader title="Checklist" description="Track your daily and weekly tasks to maximize rewards." />
      <Card>
        <div className="border-b border-gray-700 mb-4">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button onClick={() => setActiveTab('daily')} className={`${activeTab === 'daily' ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
              Daily
            </button>
            <button onClick={() => setActiveTab('weekly')} className={`${activeTab === 'weekly' ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
              Weekly
            </button>
          </nav>
        </div>
        <div>
          {renderTaskList(activeTab)}
        </div>
      </Card>
    </div>
  );
};

export default Checklist;
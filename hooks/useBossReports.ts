import { useLocalStorage } from './useLocalStorage';
import { BossReport } from '../types';
import { generateUUID } from '../utils/helpers';

export function useBossReports() {
  const [reports, setReports] = useLocalStorage<BossReport[]>('ln_boss_reports', []);

  const getReportsFor = (bossId: string, serverId: string): BossReport[] => {
    return reports
      .filter(r => r.bossId === bossId && r.serverId === serverId)
      .sort((a, b) => new Date(b.eventTime).getTime() - new Date(a.eventTime).getTime());
  };

  const addReport = (data: { bossId: string; serverId: string; eventTime: Date }) => {
    const newReport: BossReport = {
      id: generateUUID(),
      bossId: data.bossId,
      serverId: data.serverId,
      eventTime: data.eventTime.toISOString(),
      createdAt: new Date().toISOString(),
      upvotes: 1,
      downvotes: 0,
    };
    setReports(prev => [newReport, ...prev]);
  };

  const vote = (reportId: string, type: 'up' | 'down') => {
    setReports(prev =>
      prev.map(r => {
        if (r.id === reportId) {
          return {
            ...r,
            upvotes: type === 'up' ? r.upvotes + 1 : r.upvotes,
            downvotes: type === 'down' ? r.downvotes + 1 : r.downvotes,
          };
        }
        return r;
      })
    );
  };
  
  const upvote = (reportId: string) => vote(reportId, 'up');
  const downvote = (reportId: string) => vote(reportId, 'down');

  return { reports, getReportsFor, addReport, upvote, downvote };
}

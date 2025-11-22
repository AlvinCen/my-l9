
import { MaintenanceInfo } from '../types';

export const MAINTENANCE_INFO: MaintenanceInfo[] = [
    {
        region: 'SEA',
        lastCompletedAt: '2025-11-12T12:00:00+07:00'
    }
];

export const getLastMaintenance = (region: string): MaintenanceInfo | undefined => {
    return MAINTENANCE_INFO.find(m => m.region === region);
};


import { GameServer } from '../types';

const generateServers = (group: 'Horatio' | 'Yvonne' | 'Douglas' | 'Santiago' | 'Medea'): GameServer[] => {
    const servers: GameServer[] = [];
    for (let i = 1; i <= 10; i++) {
        const num = i.toString().padStart(2, '0');
        servers.push({
            id: `${group.toLowerCase()}-${num}`,
            name: `${group}${num}`,
            group: group,
            region: 'SEA'
        });
    }
    return servers;
}

export const SEA_SERVERS: GameServer[] = [
    ...generateServers('Horatio'),
    ...generateServers('Yvonne'),
    ...generateServers('Douglas'),
    ...generateServers('Santiago'),
    ...generateServers('Medea'),
];

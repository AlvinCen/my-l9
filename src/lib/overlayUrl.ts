import { GameServer } from '../types';
import { SEA_SERVERS } from '../data/servers';

export interface OverlaySettings {
  channel: string;
  serverId: string;
  lang: 'en' | 'id';
  showRegion: boolean;
}

export const DEFAULT_OVERLAY_SETTINGS: Omit<OverlaySettings, 'serverId'> = {
    channel: 'my-stream',
    lang: 'en',
    showRegion: true,
};


export function buildOverlayUrl(settings: OverlaySettings): string {
  const server = SEA_SERVERS.find(s => s.id === settings.serverId);
  const serverGroup = server?.group.toLowerCase() || 'sea';
  const channel = encodeURIComponent(settings.channel);
  
  const query = new URLSearchParams({
    serverId: settings.serverId,
    showRegion: settings.showRegion ? '1' : '0',
    lang: settings.lang,
  });

  const path = `/overlay/boss-timer/${serverGroup}/${channel}`;
  return `${path}?${query.toString()}`;
}

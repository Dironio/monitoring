import interfaceDal from '../data/interface.dal';
import { TimeRange } from './types/interface.dto';

class InterfaceService {
    async getInteractions(webId: number, pageUrl: string, range: TimeRange): Promise<any[]> {
        return interfaceDal.getInteractions(webId, pageUrl, range);
    }

    async getScrollData(webId: number, pageUrl: string, range: TimeRange): Promise<any[]> {
        return interfaceDal.getScrollData(webId, pageUrl, range);
    }

    async getElementStats(webId: number, pageUrl: string, range: TimeRange): Promise<any[]> {
        const interactions = await interfaceDal.getInteractions(webId, pageUrl, range);

        const statsMap: Record<string, { count: number, totalDuration: number }> = {};

        interactions.forEach((event: any) => {
            const type = event.element_type || 'unknown';
            if (!statsMap[type]) {
                statsMap[type] = { count: 0, totalDuration: 0 };
            }
            statsMap[type].count += 1;
            statsMap[type].totalDuration += event.duration;
        });

        return Object.entries(statsMap).map(([type, { count, totalDuration }]) => ({
            type,
            count,
            avg_duration: Math.round(totalDuration / count),
            engagement: this.calculateEngagement(totalDuration, count)
        })).sort((a, b) => b.count - a.count);
    }

    private calculateEngagement(duration: number, clicks: number): number {
        return Math.min(100, Math.round(Math.log1p(duration * clicks) * 10));
    }
}

const interfaceService = new InterfaceService();
export default interfaceService;
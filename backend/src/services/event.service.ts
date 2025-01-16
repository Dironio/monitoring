import eventDal from '../data/event.dal';
import { ClickHeatmapData, CreateEventDto, RawEvent, ScrollHeatmapData, UpdateEventDto } from './@types/event.dto';

class EventService {
    async create(dto: CreateEventDto): Promise<RawEvent> {
        return await eventDal.create(dto);
    }

    async getAll() {
        return await eventDal.getAll();
    }

    async update(dto: UpdateEventDto): Promise<RawEvent> {
        return await eventDal.update(dto);
    }

    async delete(id: number): Promise<RawEvent> {
        return await eventDal.delete(id);
    }

    async getOne(id: number): Promise<RawEvent> {
        return await eventDal.getOne(id);
    }


    ////////////////////////////////////////

    async getActiveUsersDaily(web_id: number): Promise<RawEvent[]> {
        return await eventDal.getActiveUsersDaily(web_id);
    }

    async getAverageSessionTime(web_id: number): Promise<RawEvent[]> {
        return await eventDal.getAverageSessionTime(web_id);
    }

    async getTopPages(web_id: number): Promise<RawEvent[]> {
        return await eventDal.getTopPages(web_id);
    }

    async getAvgTime(webId: number): Promise<RawEvent[]> {
        return await eventDal.getAvgTime(webId);
    }













    async getTrafficData() {
        const events = await eventDal.getAll();
        const grouped = events.reduce((acc: any, event: any) => {
            const date = new Date(event.timestamp).toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        return Object.keys(grouped).map(date => ({ date, visits: grouped[date] }));
    }

    async getUserSegments() {
        const startDate = '2025-01-01';
        const endDate = new Date().toISOString();

        const newUsers = await eventDal.getNewUsers(startDate, endDate);
        const returningUsers = await eventDal.getReturningUsers(startDate, endDate);

        return [
            { name: 'Новые', value: newUsers },
            { name: 'Возвращающиеся', value: returningUsers },
        ];
    }

    async getEventSummary() {
        return await eventDal.getKeyEvents();
    }

    async getPopularPages() {
        const events = await eventDal.getAll();
        const pages = events.reduce((acc: any, event: any) => {
            acc[event.page_url] = (acc[event.page_url] || 0) + 1;
            return acc;
        }, {});

        return Object.keys(pages).map(page => ({ page, visits: pages[page] }));
    }






    async getAnalysisData(webId: number): Promise<RawEvent[]> {
        return await eventDal.getAnalysisData(webId);
    }





    async getUniquePages(webId: number): Promise<string[]> {
        return await eventDal.getUniquePages(webId);
    }

    async getClickHeatmapData(webId: number, pageUrl: string): Promise<ClickHeatmapData[]> {
        return await eventDal.getClickHeatmapData(webId, pageUrl);
    }

    async getScrollHeatmapData(webId: number, pageUrl: string): Promise<ScrollHeatmapData[]> {
        return await eventDal.getScrollHeatmapData(webId, pageUrl);
    }

    async getPageHeatmapData(webId: number, pageUrl: string): Promise<RawEvent[]> {
        return await eventDal.getPageHeatmapData(webId, pageUrl);
    }











    async getHistorySessions(webId: number): Promise<RawEvent[]> {
        return await eventDal.getHistorySessions(webId);
    }


    async getHistoryOneSession(webId: number, session_id: string): Promise<RawEvent[]> {
        return await eventDal.getHistoryOneSession(webId, session_id);
    }
}

const eventService = new EventService();
export default eventService;
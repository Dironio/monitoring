import eventDal from '../data/event.dal';
import { ClickHeatmapData, CreateEventDto, RawEvent, ScrollHeatmapData, ScrollHeatmapResponse, UpdateEventDto } from './types/event.dto';

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

    // async getScrollHeatmapData(webId: number, pageUrl: string): Promise<ScrollHeatmapResponse> {
    //     const groups = await eventDal.getScrollHeatmapData(webId, pageUrl);
    //     const maxDuration = Math.max(...groups.map(g => g.duration));
    //     const totalDuration = groups.reduce((sum, g) => sum + g.duration, 0);

    //     return {
    //         groups,
    //         maxDuration,
    //         totalDuration
    //     };
    // }

    async getScrollHeatmapData(webId: number, pageUrl: string): Promise<ScrollHeatmapResponse> {
        const groups = await eventDal.getScrollHeatmapData(webId, pageUrl);

        // Explicitly type the callback parameters <sup data-citation="1" className="inline select-none [&>a]:rounded-2xl [&>a]:border [&>a]:px-1.5 [&>a]:py-0.5 [&>a]:transition-colors shadow [&>a]:bg-ds-bg-subtle [&>a]:text-xs [&>svg]:w-4 [&>svg]:h-4 relative -top-[2px] citation-shimmer"><a href="https://stackoverflow.com/questions/43064221/typescript-ts7006-parameter-xxx-implicitly-has-an-any-type" target="_blank" title="Typescript: TS7006: Parameter xxx implicitly has an any type ...">1</a></sup><sup data-citation="5" className="inline select-none [&>a]:rounded-2xl [&>a]:border [&>a]:px-1.5 [&>a]:py-0.5 [&>a]:transition-colors shadow [&>a]:bg-ds-bg-subtle [&>a]:text-xs [&>svg]:w-4 [&>svg]:h-4 relative -top-[2px] citation-shimmer"><a href="https://medium.com/@turingvang/error-ts7044-parameter-a-implicitly-has-an-any-type-612210e2c9ec" target="_blank" title="error TS7044: Parameter a implicitly has an any type | by ...">5</a></sup>
        const maxDuration = Math.max(...groups.map((g: { duration: number }) => g.duration));
        const totalDuration = groups.reduce((sum: number, g: { duration: number }) => sum + g.duration, 0);

        return {
            groups,
            maxDuration,
            totalDuration
        };
    }



    async getPageHeatmap(webId: number, pageUrl: string): Promise<RawEvent[]> {
        return await eventDal.getPageHeatmap(webId, pageUrl);
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
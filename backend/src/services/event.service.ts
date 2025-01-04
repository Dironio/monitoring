import eventDal from '../data/event.dal';
import { CreateEventDto, RawEvent, UpdateEventDto } from './@types/event.dto';

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

    async getActiveUsersDaily(): Promise<RawEvent[]> {
        return await eventDal.getActiveUsersDaily();
    }

    async getAverageSessionTime(): Promise<RawEvent[]> {
        return await eventDal.getAverageSessionTime();
    }

    async getTopPages(): Promise<RawEvent[]> {
        return await eventDal.getTopPages();
    }

    async getAvgTime(): Promise<RawEvent[]> {
        return await eventDal.getAvgTime();
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
}

const eventService = new EventService();
export default eventService;
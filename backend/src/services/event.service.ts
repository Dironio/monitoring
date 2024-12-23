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
}

const eventService = new EventService();
export default eventService;
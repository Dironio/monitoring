import { Application, CreateApplicationDto, UpdateApplicationDto } from './types/app.dto';
import appDal from '../data/app.dal';



class AppService {
    async create(dto: CreateApplicationDto): Promise<Application> {
        return await appDal.create(dto);
    }

    async getAll() {
        return await appDal.getAll();
    }

    async update(dto: UpdateApplicationDto): Promise<Application> {
        return await appDal.update(dto);
    }

    async delete(id: number): Promise<Application> {
        return await appDal.delete(id);
    }

    async getOne(id: number): Promise<Application> {
        return await appDal.getOne(id);
    }
}

const appService = new AppService();
export default appService;
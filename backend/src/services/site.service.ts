import { CreateSiteDto, UpdateSiteDto, WebSite } from './types/site.dto';
import siteDal from '../data/site.dal';

class SiteService {
    async create(dto: CreateSiteDto): Promise<WebSite> {
        return await siteDal.create(dto);
    }

    async getAll() {
        return await siteDal.getAll();
    }

    async update(dto: UpdateSiteDto): Promise<WebSite> {
        return await siteDal.update(dto);
    }

    async delete(id: number): Promise<WebSite> {
        return await siteDal.delete(id);
    }

    async getOne(id: number): Promise<WebSite> {
        return await siteDal.getOne(id);
    }

    async getFilteredSites(user: any): Promise<WebSite[]> {
        if (user.role_id === 1) {
            // Роль 1 — доступ только к демо-сайтам (id = 1)
            return await siteDal.getFilteredSites([1], false);
        } else if (user.role_id === 2 || user.role_id === 3) {
            // Роли 2 и 3 — демо сайты (id = 1) + сайты пользователя (web_id)
            const webIds = user.web_id ? [1, ...user.web_id] : [1]; // Убедитесь, что web_id передаётся в виде массива
            return await siteDal.getFilteredSites(webIds, false);
        } else if (user.role_id === 4) {
            // Роль 4 — доступ ко всем сайтам
            return await siteDal.getAll();
        }

        throw new Error('Недопустимая роль пользователя');
    }
}

const siteService = new SiteService();
export default siteService;
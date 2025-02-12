import behaviorDal from '../data/behavior.dal';

class BehaviorService {
    async getPageLoadingSpeed(webId: number): Promise<any> {
        return await behaviorDal.getPageLoadingSpeed(webId);
    }

    async getTotalUsers(webId: number): Promise<any> {
        return await behaviorDal.getTotalUsers(webId);
    }

    async getTotalVisits(webId: number): Promise<any> {
        return await behaviorDal.getTotalUsers(webId);
    }

    async getReturningUsers(webId: number): Promise<any> {
        return await behaviorDal.getReturningUsers(webId);
    }

    async getBounceRate(webId: number): Promise<any> {
        return await behaviorDal.getTotalUsers(webId);
    }

    async getTotalSales(webId: number): Promise<any> {
        return await behaviorDal.getTotalUsers(webId);
    }

    async getTotalConversions(webId: number): Promise<any> {
        return await behaviorDal.getTotalUsers(webId);
    }

    async getActiveUsers(webId: number): Promise<any> {
        return await behaviorDal.getTotalUsers(webId);
    }
}

const behaviorService = new BehaviorService();
export default behaviorService;
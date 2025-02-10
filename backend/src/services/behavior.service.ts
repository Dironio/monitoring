import behaviorDal from '../data/behavior.dal';

class BehaviorService {
    async getReturningUsers(webId: number): Promise<any> {
        return await behaviorDal.getReturningUsers(webId);
    }

    async getTotalUsers(webId: number): Promise<any> {
        return await behaviorDal.getTotalUsers(webId);
    }
}

const behaviorService = new BehaviorService();
export default behaviorService;
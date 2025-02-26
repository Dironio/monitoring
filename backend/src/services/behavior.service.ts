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






    async getAverageTimeOnSite(webId: number): Promise<any> {
        return await behaviorDal.getAverageTimeOnSite(webId);
    }

    async getAveragePageDepth(webId: number): Promise<any> {
        return await behaviorDal.getAveragePageDepth(webId);
    }


    async getClickAnalysis(webId: number): Promise<any> {
        return await behaviorDal.getClickAnalysis(webId);
    }


    async getEventAnalysis(webId: number): Promise<any> {
        return await behaviorDal.getEventAnalysis(webId);
    }


    async getAverageScrollPercentage(webId: number): Promise<any> {
        return await behaviorDal.getAverageScrollPercentage(webId);
    }


    async getFormAnalysis(webId: number): Promise<any> {
        return await behaviorDal.getFormAnalysis(webId);
    }







    async getPerformanceMetrics(webId: number): Promise<any> {
        return await behaviorDal.getPerformanceMetrics(webId);
    }

    
    async getErrorAnalysis(webId: number): Promise<any> {
        return await behaviorDal.getErrorAnalysis(webId);
    }


    async getUptimeStatus(webId: number): Promise<any> {
        return await behaviorDal.getUptimeStatus(webId);
    }


    async getResourceAnalysis(webId: number): Promise<any> {
        return await behaviorDal.getResourceAnalysis(webId);
    }


    async getSeoAnalysis(webId: number): Promise<any> {
        return await behaviorDal.getSeoAnalysis(webId);
    }


    async getActiveUsersNow(webId: number): Promise<any> {
        return await behaviorDal.getActiveUsersNow(webId);
    }


    async getActiveUsersComparison(webId: number): Promise<any> {
        return await behaviorDal.getActiveUsersComparison(webId);
    }






    async getUserGeolocation(webId: number): Promise<any> {
        return await behaviorDal.getUserGeolocation(webId);
    }


    async getTopCountries(webId: number): Promise<any> {
        return await behaviorDal.getTopCountries(webId);
    }


    async getTopCities(webId: number): Promise<any> {
        return await behaviorDal.getTopCities(webId);
    }


    async getUserRegions(webId: number): Promise<any> {
        return await behaviorDal.getUserRegions(webId);
    }


    async getGeolocationComparison(webId: number): Promise<any> {
        return await behaviorDal.getGeolocationComparison(webId);
    }

}

const behaviorService = new BehaviorService();
export default behaviorService;
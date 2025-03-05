import behaviorDal from '../data/behavior.dal';

class BehaviorService {
    async getPageLoadingSpeed(webId: number): Promise<any> {
        return await behaviorDal.getPageLoadingSpeed(webId);
    }

    async getTotalUsers(webId: number): Promise<any> {
        return await behaviorDal.getTotalUsers(webId);
    }

    async getTotalVisits(webId: number): Promise<any> {
        return await behaviorDal.getTotalVisits(webId);
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
        return await behaviorDal.getActiveUsers(webId);
    }

    async getDailyActiveUsers(webId: number, interval: 'month' | 'week'): Promise<any> {
        return await behaviorDal.getMonthlyWeeklyActiveUsers(webId, interval);
    }






    async getAverageTimeOnSite(webId: number, interval: 'month' | 'week'): Promise<any> {
        return await behaviorDal.getAverageTimeOnSite(webId, interval);
    }

    async getAveragePageDepth(webId: number, interval: 'month' | 'week'): Promise<any> {
        return await behaviorDal.getAveragePageDepth(webId, interval);
    }


    async getClickAnalysis(webId: number, interval: 'month' | 'week'): Promise<any> {
        return await behaviorDal.getClickAnalysis(webId, interval);
    }


    async getEventAnalysis(webId: number, interval: 'month' | 'week'): Promise<any> {
        return await behaviorDal.getEventAnalysis(webId, interval);
    }


    async getAverageScrollPercentage(webId: number, interval: 'month' | 'week'): Promise<any> {
        return await behaviorDal.getAverageScrollPercentage(webId, interval);
    }


    async getFormAnalysis(webId: number, interval: 'month' | 'week'): Promise<any> {
        return await behaviorDal.getFormAnalysis(webId, interval);
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






    async getUserGeolocation(webId: number, interval: 'month' | 'week'): Promise<any> {
        return await behaviorDal.getUserGeolocation(webId, interval);
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
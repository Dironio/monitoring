import { DeviceMetrics, GeoMetrics, PageSimilarity, SessionSimilarity } from "../../../../../models/similarity.model";
import { getAPI } from "../../../../utils/axiosGet";

class SimilarityService {
    async fetchSimilarityData(webId: number) {
        try {
            const [sessions, geo, pages, devices] = await Promise.all([
                getAPI.get<SessionSimilarity[]>(`/events/similarity/sessions?web_id=${webId}`),
                getAPI.get<GeoMetrics[]>(`/events/similarity/geolocation?web_id=${webId}`),
                getAPI.get<PageSimilarity[]>(`/events/similarity/pages?web_id=${webId}`),
                getAPI.get<DeviceMetrics[]>(`/events/similarity/devices?web_id=${webId}`),
            ]);

            return {
                sessions: sessions.data,
                geo: geo.data,
                pages: pages.data,
                devices: devices.data
            };
        } catch (error) {
            console.error('Error fetching similarity data:', error);
            throw error;
        }
    }
}

const similarityService = new SimilarityService();
export default similarityService;
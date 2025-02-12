import { FeedbackPayload } from "../../models/feedback.model";
import { CreateEventAPI } from "./axiosGet";


export const sendFeedback = async (payload: FeedbackPayload) => {
    try {
        const eventData = {
            user_id: payload.user?.id,
            event_data: {
                rating: payload.rating,
                feedback_type: 'service_rating',
                survey_id: 1,
                survey_text: 'Оцените работоспособность сервиса'
            },
            page_url: payload.pageUrl,
            timestamp: new Date().toISOString(),
            web_id: 1,
            session_id: localStorage.getItem('sessionId'),
            referrer: document.referrer,
            event_id: 25,
            user_agent: {
                userAgent: payload.userAgent
            }
        };

        const { data } = await CreateEventAPI.post('/events', eventData);
        return data;
    } catch (error) {
        console.log(error)
        throw error;
    }
};
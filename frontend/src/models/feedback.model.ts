import { User } from "./user.model";

export interface FeedbackPayload {
    user: User | null;
    rating: number;
    pageUrl: string;
    sessionId: string;
    userAgent: string;
}
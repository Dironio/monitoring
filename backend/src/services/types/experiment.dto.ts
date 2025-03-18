export interface SurveySelector {
    survey_id: number;
    survey_text: string;
}

export interface SurveyVote {
    user_id: number;
    rating: number;
    user_agent: {
        userAgent: string;
    };
    created_at: Date;
}
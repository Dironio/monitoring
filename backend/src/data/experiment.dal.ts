import pool from "../pool";
import { SurveySelector, SurveyVote } from "./types/experiment.dao";
import { parseUserAgent } from '../services/utils/userAgentExperiement.utils';


class ExperimentDal {
    async getSurveysSelector(webId: number): Promise<SurveySelector[]> {
        const result = await pool.query(`
            SELECT DISTINCT 
                (event_data->>'survey_id')::int as survey_id,
                event_data->>'survey_text' as survey_text
            FROM raw_events 
            WHERE event_id = 25 
            AND web_id = $1 
            AND event_data->>'survey_id' IS NOT NULL
            ORDER BY survey_id DESC
        `, [webId]);

        return result.rows;
    }

    async getSurveyVotes(webId: number, surveyId: number): Promise<SurveyVote[]> {
        const result = await pool.query(`
            SELECT 
                user_id,
                (event_data->>'rating')::int as rating,
                user_agent->>'userAgent' as user_agent_string,
                created_at
            FROM raw_events 
            WHERE event_id = 25 
            AND web_id = $1
            AND (event_data->>'survey_id')::int = $2
            ORDER BY created_at DESC
        `, [webId, surveyId]);

        return result.rows.map(row => ({
            ...row,
            user_agent: parseUserAgent(row.user_agent_string)
        }));
    }
}

const experimentDal = new ExperimentDal();
export default experimentDal;
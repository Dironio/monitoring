import pool from "../pool";
import { RawEvent } from "src/services/@types/event.dto";


class ClusteringDal {
    // async getRawData(webId: number, timeRange: string): Promise<RawEvent[]> {
    //     const query = `
    //         SELECT 
    //             e.*,
    //             to_timestamp(e.created_at) as timestamp
    //         FROM raw_events e
    //         WHERE e.web_id = $1
    //         AND e.created_at >= NOW() - $2::interval
    //         ORDER BY e.created_at DESC
    //     `;
    //     const result = await pool.query(query, [webId, timeRange]);
    //     return result.rows;
    // }

    async getUserPatternData(webId: number): Promise<any[]> {
        const result = await pool.query(`
            WITH user_metrics AS (
                SELECT 
                    user_id,
                    COUNT(*) as total_interactions,
                    AVG(CAST((event_data->>'duration') AS INTEGER)) as avg_duration,
                    COUNT(DISTINCT (event_data->>'tag')) as unique_elements,
                    array_agg(DISTINCT (event_data->>'tag')) as used_elements,
                    AVG(CAST((event_data->>'x') AS INTEGER)) as avg_x,
                    AVG(CAST((event_data->>'y') AS INTEGER)) as avg_y
                FROM raw_events
                WHERE web_id = $1
                AND user_id IS NOT NULL
                GROUP BY user_id
            )
            SELECT 
                um.*,
                COUNT(*) OVER() as total_users,
                AVG(total_interactions) OVER() as avg_interactions,
                PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY total_interactions) OVER() as median_interactions
            FROM user_metrics um
        `, [webId]);

        return result.rows;
    }

    async getInteractionData(webId: number): Promise<any[]> {
        const result = await pool.query(`
            WITH interaction_features AS (
                SELECT 
                    user_id,
                    (event_data->>'tag') as element_type,
                    CAST((event_data->>'x') AS INTEGER) as x_coord,
                    CAST((event_data->>'y') AS INTEGER) as y_coord,
                    CAST((event_data->>'duration') AS INTEGER) as duration,
                    created_at
                FROM raw_events
                WHERE web_id = $1
                AND event_data IS NOT NULL
            )
            SELECT 
                user_id,
                array_agg(element_type) as elements,
                array_agg(x_coord) as x_coords,
                array_agg(y_coord) as y_coords,
                array_agg(duration) as durations,
                COUNT(*) as interaction_count
            FROM interaction_features
            GROUP BY user_id
        `, [webId]);

        return result.rows;
    }

    async getTemporalData(webId: number, timeUnit: string): Promise<any[]> {
        const timeGrouping = {
            hour: "date_trunc('hour', to_timestamp(created_at))",
            day: "date_trunc('day', to_timestamp(created_at))",
            week: "date_trunc('week', to_timestamp(created_at))"
        }[timeUnit];

        const result = await pool.query(`
            WITH temporal_metrics AS (
                SELECT 
                    ${timeGrouping} as time_bucket,
                    COUNT(*) as event_count,
                    COUNT(DISTINCT user_id) as unique_users,
                    AVG(CAST((event_data->>'duration') AS INTEGER)) as avg_duration
                FROM raw_events
                WHERE web_id = $1
                GROUP BY time_bucket
                ORDER BY time_bucket
            )
            SELECT 
                time_bucket,
                event_count,
                unique_users,
                avg_duration,
                LAG(event_count) OVER (ORDER BY time_bucket) as prev_event_count,
                LEAD(event_count) OVER (ORDER BY time_bucket) as next_event_count
            FROM temporal_metrics
        `, [webId]);

        return result.rows;
    }
}

const clusteringDal = new ClusteringDal();
export default clusteringDal;
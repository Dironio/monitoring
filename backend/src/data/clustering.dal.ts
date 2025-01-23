import pool from "../pool";
import { ClusterInteraction } from "./@types/cluster.dao";


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

    async getUserPatterns(webId: number): Promise<any[]> {
        const result = await pool.query(`
           WITH session_metrics AS (
            SELECT 
                session_id,
                COUNT(*) as interaction_count,
                AVG(CAST(COALESCE(event_data->>'duration', '0') AS FLOAT)) as avg_duration,
                COUNT(DISTINCT event_data->>'element_id') as unique_elements,
                MAX(created_at) - MIN(created_at) as session_duration
            FROM raw_events
            WHERE 
                web_id = $1 
                AND created_at >= NOW() - INTERVAL '30 days'
                AND session_id IS NOT NULL
            GROUP BY session_id
            HAVING COUNT(*) >= 5
        ),
        normalized_metrics AS (
            SELECT 
                session_id,
                interaction_count,
                avg_duration,
                unique_elements,
                EXTRACT(EPOCH FROM session_duration) as session_duration_seconds,
                (interaction_count - MIN(interaction_count) OVER()) / 
                    NULLIF(MAX(interaction_count) OVER() - MIN(interaction_count) OVER(), 0) as norm_interactions,
                (avg_duration - MIN(avg_duration) OVER()) / 
                    NULLIF(MAX(avg_duration) OVER() - MIN(avg_duration) OVER(), 0) as norm_duration,
                (unique_elements - MIN(unique_elements) OVER()) / 
                    NULLIF(MAX(unique_elements) OVER() - MIN(unique_elements) OVER(), 0) as norm_elements
            FROM session_metrics
        ),
        clusters AS (
            SELECT 
                session_id,
                CASE 
                    WHEN norm_interactions > 0.66 THEN 2
                    WHEN norm_interactions > 0.33 THEN 1
                    ELSE 0
                END as cluster_id,
                norm_interactions,
                norm_duration,
                norm_elements,
                interaction_count,
                avg_duration,
                unique_elements,
                session_duration_seconds
            FROM normalized_metrics
        )
        SELECT 
            cluster_id,
            jsonb_agg(
                jsonb_build_object(
                    'sessionId', session_id,
                    'metrics', jsonb_build_object(
                        'avgDuration', avg_duration,
                        'interactionCount', interaction_count,
                        'uniqueElements', unique_elements,
                        'complexity', norm_elements
                    )
                )
            ) as sessions,
            ARRAY[
                AVG(norm_interactions),
                AVG(norm_duration),
                AVG(norm_elements)
            ] as centroid,
            COUNT(*) as cluster_size,
            AVG(interaction_count) as avg_interactions,
            AVG(avg_duration) as cluster_avg_duration,
            AVG(unique_elements) as avg_unique_elements
        FROM clusters
        GROUP BY cluster_id
        ORDER BY cluster_id;
        `, [webId]);

        return result.rows;
    }

    async getInteractionClusters(webId: number): Promise<ClusterInteraction[]> {
        // const result = await pool.query(`
        //     WITH interaction_points AS (
        //     SELECT
        //         user_id,
        //         CAST((event_data->>'x') AS INTEGER) as x_coord,
        //         CAST((event_data->>'y') AS INTEGER) as y_coord,
        //         CAST((event_data->>'duration') AS INTEGER) as duration,
        //         created_at
        //     FROM raw_events
        //     WHERE
        //         web_id = $1
        //         AND event_data->>'x' IS NOT NULL
        //         AND event_data->>'y' IS NOT NULL
        //         AND created_at >= NOW() - INTERVAL '30 days'
        // ),
        // cluster_assignment AS (
        //     SELECT
        //         x_coord,
        //         y_coord,
        //         duration,
        //         NTILE(5) OVER (
        //             ORDER BY
        //                 SQRT(POW(x_coord - AVG(x_coord) OVER(), 2) + 
        //                      POW(y_coord - AVG(y_coord) OVER(), 2))
        //         ) as cluster_id
        //     FROM interaction_points
        //     WHERE
        //         x_coord BETWEEN 0 AND 1920
        //         AND y_coord BETWEEN 0 AND 1080
        // )
        // SELECT
        //     cluster_id,
        //     array_agg(x_coord ORDER BY x_coord) as x_coords,
        //     array_agg(y_coord ORDER BY y_coord) as y_coords,
        //     array_agg(duration) as durations,
        //     COUNT(*) as cluster_size,
        //     AVG(x_coord) as center_x,
        //     AVG(y_coord) as center_y,
        //     STDDEV(x_coord) as std_x,
        //     STDDEV(y_coord) as std_y
        // FROM cluster_assignment
        // GROUP BY cluster_id
        // HAVING COUNT(*) > 1
        // ORDER BY cluster_id
        // LIMIT 50
        // `, [webId]);

        const result = await pool.query(`
            WITH session_metrics AS (
                SELECT 
                    session_id,
                    AVG(CAST(COALESCE(event_data->>'x', '0') AS INTEGER)) as x_coord,
                    AVG(CAST(COALESCE(event_data->>'y', '0') AS INTEGER)) as y_coord,
                    AVG(CAST(COALESCE(event_data->>'duration', '0') AS INTEGER)) as duration,
                    COUNT(*) as interaction_count,
                    COUNT(DISTINCT event_data->>'element_id') as unique_elements
                FROM raw_events
                WHERE 
                    web_id = $1
                    AND created_at >= NOW() - INTERVAL '30 days'
                    AND event_data->>'x' IS NOT NULL 
                    AND event_data->>'y' IS NOT NULL
                GROUP BY session_id
                HAVING COUNT(*) >= 5
            )
            SELECT 
                cluster_id,
                array_agg(x_coord) as x_coords,
                array_agg(y_coord) as y_coords,
                array_agg(duration) as durations,
                array_agg(session_id) as session_ids,
                jsonb_agg(
                    jsonb_build_object(
                        'sessionId', session_id,
                        'metrics', jsonb_build_object(
                            'duration', duration,
                            'interactionCount', interaction_count,
                            'uniqueElements', unique_elements,
                            'x', x_coord,
                            'y', y_coord
                        )
                    )
                ) as session_data,
                COUNT(*) as cluster_size,
                AVG(x_coord) as center_x,
                AVG(y_coord) as center_y,
                STDDEV(x_coord) as std_x,
                STDDEV(y_coord) as std_y
            FROM (
                SELECT 
                    *,
                    width_bucket(
                        x_coord, 
                        MIN(x_coord) OVER(), 
                        MAX(x_coord) OVER(), 
                        3
                    ) as cluster_id
                FROM session_metrics
                WHERE x_coord BETWEEN 0 AND 1920
                AND y_coord BETWEEN 0 AND 1080
            ) clustered_sessions
            GROUP BY cluster_id
            HAVING COUNT(*) > 1
            ORDER BY cluster_id
`, [webId]);

        return result.rows;
    }

    async getTemporalAnalysis(webId: number, timeUnit: string): Promise<any[]> {
        const timeGrouping = {
            hour: 'hour',
            day: 'day',
            week: 'week'
        }[timeUnit];

        if (!timeGrouping) {
            throw new Error('Invalid time unit specified');
        }

        const result = await pool.query(`
             WITH event_aggregation AS (
            SELECT
                date_trunc($2, created_at::timestamp) as time_bucket,
                session_id,
                jsonb_build_object(
                    'duration', AVG(CAST(COALESCE(event_data->>'duration', '0') AS INTEGER)),
                    'event_types', array_agg(DISTINCT event_data->>'type')
                ) as session_metrics
            FROM raw_events
            WHERE
                web_id = $1
                AND created_at >= NOW() - INTERVAL '30 days'
                AND session_id IS NOT NULL
            GROUP BY
                date_trunc($2, created_at::timestamp),
                session_id
        ),
        temporal_metrics AS (
            SELECT
                time_bucket,
                COUNT(*) as event_count,
                COUNT(DISTINCT session_id) as unique_sessions,
                AVG((session_metrics->>'duration')::numeric) as avg_duration,
                jsonb_object_agg(
                    session_id,
                    session_metrics
                ) as session_data
            FROM event_aggregation
            GROUP BY time_bucket
            HAVING COUNT(DISTINCT session_id) > 5
        )
        SELECT
            time_bucket,
            event_count,
            unique_sessions,
            avg_duration,
            LAG(event_count) OVER (ORDER BY time_bucket) as prev_event_count,
            LEAD(event_count) OVER (ORDER BY time_bucket) as next_event_count,
            session_data
        FROM temporal_metrics
        ORDER BY time_bucket DESC
        `, [webId, timeGrouping]);

        return result.rows;
    }
}

const clusteringDal = new ClusteringDal();
export default clusteringDal;
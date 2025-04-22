import { HeatmapCell, InteractionEvent } from "../services/types/interface.dto";
import pool from "../pool";
import { TimeRange } from './types/interface.dao';

// const getRangeCondition = (range: TimeRange): string => {
//   switch (range) {
//     case '24h': return 'INTERVAL \'24 hours\'';
//     case '7d': return 'INTERVAL \'7 days\'';
//     case '30d': return 'INTERVAL \'30 days\'';
//     default: return 'INTERVAL \'7 days\'';
//   }
// };

// class InterfaceDal {
//   async getScrollData(webId: number, pageUrl: string, range: TimeRange): Promise<any[]> {
//     const rangeCondition = getRangeCondition(range);

//     const result = await pool.query(`
//       SELECT 
//         (event_data->>'scrollPercentage')::float AS scroll_percentage,
//         timestamp,
//         session_id
//       FROM raw_events
//       WHERE 
//         event_id = 4
//         AND (event_data->>'scrollPercentage') IS NOT NULL
//         AND web_id = $1
//         AND regexp_replace(page_url, '^https?://[^/]+', '') = regexp_replace($2, '^https?://[^/]+', '')
//         AND timestamp >= NOW() - ${rangeCondition}
//     `, [webId, pageUrl]);

//     return result.rows;
//   }

//   async getInteractions(webId: number, pageUrl: string, range: TimeRange): Promise<any[]> {
//     const rangeCondition = getRangeCondition(range);

//     const result = await pool.query(`
//       SELECT 
//         (event_data->>'x')::int AS x,
//         (event_data->>'y')::int AS y,
//         (event_data->>'duration')::int AS duration,
//         (event_data->>'tag') AS element_type,
//         (event_data->>'text') AS element_text,
//         timestamp,
//         session_id
//       FROM raw_events
//       WHERE 
//         event_id IN (2, 4)
//         AND (event_data->>'x') IS NOT NULL
//         AND web_id = $1
//         AND regexp_replace(page_url, '^https?://[^/]+', '') = regexp_replace($2, '^https?://[^/]+', '')
//         AND timestamp >= NOW() - ${rangeCondition}
//       ORDER BY timestamp DESC
//       LIMIT 10000
//     `, [webId, pageUrl]);

//     return result.rows;
//   }
// }





const getRangeCondition = (range: TimeRange): string => {
  switch (range) {
    case '24h': return 'INTERVAL \'24 hours\'';
    case '7d': return 'INTERVAL \'7 days\'';
    case '30d': return 'INTERVAL \'30 days\'';
    default: return 'INTERVAL \'7 days\'';
  }
};

class InterfaceDal {
  async getInteractions(
    webId: number, 
    pageUrl: string, 
    range: TimeRange
  ): Promise<InteractionEvent[]> {
    const rangeCondition = getRangeCondition(range);
    const result = await pool.query<InteractionEvent>(`
      SELECT 
        (event_data->>'x')::int AS x,
        (event_data->>'y')::int AS y,
        (event_data->>'duration')::int AS duration,
        (event_data->>'tag') AS element_type,
        (event_data->>'text') AS element_text,
        timestamp,
        session_id
      FROM raw_events
      WHERE 
        event_id IN (2, 4)
        AND (event_data->>'x') IS NOT NULL
        AND web_id = $1
        AND regexp_replace(page_url, '^https?://[^/]+', '') = regexp_replace($2, '^https?://[^/]+', '')
        AND timestamp >= NOW() - ${rangeCondition}
      ORDER BY timestamp DESC
      LIMIT 10000
    `, [webId, pageUrl]);

    return result.rows;
  }

  async getHeatmapData(
    webId: number, 
    pageUrl: string, 
    range: TimeRange
  ): Promise<HeatmapCell[]> {
    const rangeCondition = getRangeCondition(range);
    const result = await pool.query<{
      x: number;
      y: number;
      count: number;
      elements: string[];
      avg_duration: number;
    }>(`
      WITH click_data AS (
        SELECT 
          (event_data->>'x')::int AS x,
          (event_data->>'y')::int AS y,
          (event_data->>'duration')::int AS duration,
          (event_data->>'tag') AS element_type
        FROM raw_events
        WHERE 
          event_id IN (2, 4)
          AND (event_data->>'x') IS NOT NULL
          AND web_id = $1
          AND regexp_replace(page_url, '^https?://[^/]+', '') = regexp_replace($2, '^https?://[^/]+', '')
          AND timestamp >= NOW() - ${rangeCondition}
      )
      SELECT 
        x,
        y,
        COUNT(*) AS count,
        ARRAY_AGG(DISTINCT element_type) FILTER (WHERE element_type IS NOT NULL) AS elements,
        AVG(duration) AS avg_duration
      FROM click_data
      GROUP BY x, y
      ORDER BY count DESC
      LIMIT 500
    `, [webId, pageUrl]);

    return result.rows;
  }
}







const interfaceDal = new InterfaceDal();
export default interfaceDal;

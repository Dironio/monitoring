import { DetailedInteraction, ElementStat, HeatmapCell, InteractionEvent, SessionInfo } from "../services/types/interface.dto";
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
// async getInteractions(
//     webId: number, 
//     pageUrl: string, 
//     range: TimeRange
//   ): Promise<InteractionEvent[]> {
//     const rangeCondition = getRangeCondition(range);
//     const result = await pool.query<InteractionEvent>(`
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

//   async getElementStats(
//     webId: number,
//     pageUrl: string,
//     range: TimeRange,
//     withDetails: boolean = false
//   ): Promise<any[]> {
//     const rangeCondition = getRangeCondition(range);

//     let query = `
//         WITH element_stats AS (
//             SELECT 
//                 (event_data->>'tag') AS type,
//                 COUNT(*) AS count,
//                 AVG((event_data->>'duration')::int) AS avg_duration,
//                 (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM raw_events 
//                     WHERE event_id IN (2, 4) AND web_id = $1
//                     AND regexp_replace(page_url, '^https?://[^/]+', '') = regexp_replace($2, '^https?://[^/]+', '')
//                     AND timestamp >= NOW() - ${rangeCondition})) AS engagement
//             FROM raw_events
//             WHERE 
//                 event_id IN (2, 4)
//                 AND (event_data->>'tag') IS NOT NULL
//                 AND web_id = $1
//                 AND regexp_replace(page_url, '^https?://[^/]+', '') = regexp_replace($2, '^https?://[^/]+', '')
//                 AND timestamp >= NOW() - ${rangeCondition}
//             GROUP BY (event_data->>'tag')
//         )
//         SELECT 
//             type,
//             count,
//             avg_duration,
//             engagement,
//             ${withDetails ? `
//             ARRAY(
//                 SELECT DISTINCT jsonb_array_elements_text(event_data->'classes')
//                 FROM raw_events
//                 WHERE event_id IN (2, 4) 
//                 AND (event_data->>'tag') = type
//                 AND web_id = $1
//                 AND regexp_replace(page_url, '^https?://[^/]+', '') = regexp_replace($2, '^https?://[^/]+', '')
//                 AND timestamp >= NOW() - ${rangeCondition}
//                 AND jsonb_array_length(event_data->'classes') > 0
//             ) AS classes,
//             (
//                 SELECT COUNT(*)::float / NULLIF(COUNT(*) FILTER (WHERE (event_data->>'duration')::int < 100), 0)
//                 FROM raw_events
//                 WHERE event_id IN (2, 4) 
//                 AND (event_data->>'tag') = type
//                 AND web_id = $1
//                 AND regexp_replace(page_url, '^https?://[^/]+', '') = regexp_replace($2, '^https?://[^/]+', '')
//                 AND timestamp >= NOW() - ${rangeCondition}
//             ) AS miss_rate
//             ` : 'NULL AS classes, NULL AS miss_rate'}
//         FROM element_stats
//         ORDER BY count DESC
//     `;

//     const result = await pool.query<any>(query, [webId, pageUrl]);
//     return result.rows;
//   }

//   async getHeatmapData(
//     webId: number,
//     pageUrl: string,
//     range: TimeRange,
//     withDetails: boolean = false
//   ): Promise<HeatmapCell[]> {
//     const rangeCondition = getRangeCondition(range);

//     let query = `
//         WITH click_data AS (
//             SELECT 
//                 (event_data->>'x')::int AS x,
//                 (event_data->>'y')::int AS y,
//                 (event_data->>'duration')::int AS duration,
//                 (event_data->>'tag') AS element_type,
//                 ${withDetails ? `
//                 jsonb_build_object(
//                     'type', (event_data->>'tag'),
//                     'text', (event_data->>'text'),
//                     'class', COALESCE((event_data->'classes'->>0), '')
//                 ) AS element_details
//                 ` : 'NULL AS element_details'}
//             FROM raw_events
//             WHERE 
//                 event_id IN (2, 4)
//                 AND (event_data->>'x') IS NOT NULL
//                 AND web_id = $1
//                 AND regexp_replace(page_url, '^https?://[^/]+', '') = regexp_replace($2, '^https?://[^/]+', '')
//                 AND timestamp >= NOW() - ${rangeCondition}
//         )
//         SELECT 
//             x,
//             y,
//             COUNT(*) AS count,
//             ARRAY_AGG(DISTINCT element_type) FILTER (WHERE element_type IS NOT NULL) AS elements,
//             AVG(duration) AS avg_duration
//             ${withDetails ? ', ARRAY_AGG(element_details) FILTER (WHERE element_details IS NOT NULL) AS element_details' : ''}
//         FROM click_data
//         GROUP BY x, y
//         ORDER BY count DESC
//         LIMIT 500
//     `;

//     const result = await pool.query<HeatmapCell>(query, [webId, pageUrl]);
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
  ): Promise<DetailedInteraction[]> {
    const rangeCondition = getRangeCondition(range);
    const query = `
        SELECT 
            (event_data->>'x')::int AS x,
            (event_data->>'y')::int AS y,
            (event_data->>'duration')::int AS duration,
            COALESCE(event_data->>'tag', event_data->>'element_tag') AS element_type,
            event_data->>'text' AS element_text,
            CASE 
                WHEN event_data->'classes' IS NOT NULL THEN event_data->'classes'
                WHEN event_data->>'element_class' IS NOT NULL THEN 
                    jsonb_build_array(event_data->>'element_class')
                ELSE '[]'::jsonb
            END AS element_classes,
            timestamp,
            session_id,
            web_id
        FROM raw_events
        WHERE 
            event_id IN (2, 4)
            AND web_id = $1
            AND regexp_replace(page_url, '^https?://[^/]+', '') = regexp_replace($2, '^https?://[^/]+', '')
            AND timestamp >= NOW() - ${rangeCondition}
        ORDER BY timestamp DESC
        LIMIT 10000
    `;

    const result = await pool.query<DetailedInteraction>(query, [webId, pageUrl]);
    return result.rows;
  }

  async getElementStats(
    webId: number,
    pageUrl: string,
    range: TimeRange,
    withDetails: boolean = false
  ): Promise<ElementStat[]> {
    const rangeCondition = getRangeCondition(range);

    let query = `
      WITH events AS (
        SELECT 
          (event_data->>'tag') AS type,
          (event_data->>'duration')::int AS duration,
          re.session_id,
          COALESCE((event_data->'device_info'->>'os'), 'unknown') AS os,
          COALESCE((event_data->'device_info'->>'browser'), 'unknown') AS browser,
          COALESCE((event_data->'geo_info'->>'country'), 'unknown') AS country,
          COALESCE((event_data->'geo_info'->>'city'), 'unknown') AS city
        FROM raw_events re
        WHERE 
          re.event_id IN (2, 4)
          AND (event_data->>'tag') IS NOT NULL
          AND re.web_id = $1
          AND regexp_replace(re.page_url, '^https?://[^/]+', '') = regexp_replace($2, '^https?://[^/]+', '')
          AND re.timestamp >= NOW() - ${rangeCondition}
      )
      SELECT 
        type,
        COUNT(*) AS count,
        AVG(duration) AS avg_duration,
        (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM events)) AS engagement
    `;

    if (withDetails) {
      query += `,
        ARRAY(
          SELECT DISTINCT e2.os || ' ' || e2.browser
          FROM events e2
          WHERE e2.type = events.type
          LIMIT 5
        ) AS devices,
        ARRAY(
          SELECT DISTINCT e3.country || COALESCE(', ' || e3.city, '')
          FROM events e3
          WHERE e3.type = events.type
          LIMIT 5
        ) AS locations
      `;
    }

    query += `
      FROM events
      GROUP BY type
      ORDER BY count DESC
    `;

    const result = await pool.query<ElementStat>(query, [webId, pageUrl]);
    return result.rows;
  }

  async getDetailedInteractions(
    webId: number,
    pageUrl: string,
    range: TimeRange,
    elementType?: string,
    coordinates?: { x: number, y: number }
  ): Promise<DetailedInteraction[]> {
    const rangeCondition = getRangeCondition(range);
    let whereClause = `
        event_id IN (2, 4)
        AND web_id = $1
        AND regexp_replace(page_url, '^https?://[^/]+', '') = regexp_replace($2, '^https?://[^/]+', '')
        AND timestamp >= NOW() - ${rangeCondition}
    `;

    const params: (string | number)[] = [webId, pageUrl];

    if (elementType) {
      whereClause += ` AND (event_data->>'tag' = $${params.length + 1} OR event_data->>'element_tag' = $${params.length + 1})`;
      params.push(elementType);
    }

    if (coordinates) {
      whereClause += ` AND (event_data->>'x')::int = $${params.length + 1} 
                       AND (event_data->>'y')::int = $${params.length + 2}`;
      params.push(coordinates.x, coordinates.y);
    }

    const query = `
        SELECT 
            (event_data->>'x')::int AS x,
            (event_data->>'y')::int AS y,
            (event_data->>'duration')::int AS duration,
            COALESCE(event_data->>'tag', event_data->>'element_tag') AS element_type,
            event_data->>'text' AS element_text,
            CASE 
              WHEN event_data->'classes' IS NOT NULL THEN event_data->'classes'
              WHEN event_data->>'element_class' IS NOT NULL THEN 
                jsonb_build_array(event_data->>'element_class')
              ELSE '[]'::jsonb
            END AS element_classes,
            timestamp,
            session_id,
            COALESCE(device_info->>'os', 'unknown') AS os,
            COALESCE(device_info->>'browser', 'unknown') AS browser,
            COALESCE(device_info->>'platform', 'unknown') AS platform,
            COALESCE(geo_info->>'country', 'unknown') AS country,
            COALESCE(geo_info->>'city', 'unknown') AS city
        FROM raw_events
        WHERE ${whereClause}
        ORDER BY timestamp DESC
        LIMIT 1000
    `;

    const result = await pool.query<DetailedInteraction>(query, params);
    return result.rows;
  }

  async getHeatmapData(
    webId: number,
    pageUrl: string,
    range: TimeRange,
    withDetails: boolean = false
  ): Promise<HeatmapCell[]> {
    const rangeCondition = getRangeCondition(range);
    const query = `
          WITH click_data AS (
              SELECT 
                  (event_data->>'x')::int AS x,
                  (event_data->>'y')::int AS y,
                  (event_data->>'duration')::int AS duration,
                  (event_data->>'tag') AS element_type,
                  ${withDetails ? `
                  jsonb_build_object(
                      'type', (event_data->>'tag'),
                      'text', (event_data->>'text'),
                      'class', COALESCE((event_data->'classes'->>0), ''),
                      'os', COALESCE((event_data->'device_info'->>'os'), 'unknown'),
                      'browser', COALESCE((event_data->'device_info'->>'browser'), 'unknown'),
                      'country', COALESCE((event_data->'geo_info'->>'country'), 'unknown'),
                      'city', COALESCE((event_data->'geo_info'->>'city'), 'unknown')
                  ) AS element_details
                  ` : 'NULL AS element_details'}
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
              ${withDetails ? ', ARRAY_AGG(element_details) FILTER (WHERE element_details IS NOT NULL) AS element_details' : ''}
          FROM click_data
          GROUP BY x, y
          ORDER BY count DESC
          LIMIT 500
      `;
    const result = await pool.query<HeatmapCell>(query, [webId, pageUrl]);
    return result.rows;
  }




  async getSessionInfo(sessionId: string, webId: number): Promise<SessionInfo> {
    const query = `
        SELECT
            COALESCE(MAX(user_agent->>'os'), 'unknown') AS os,
            CASE 
                WHEN MAX(user_agent->>'userAgent') LIKE '%YaBrowser%' THEN 'YaBrowser'
                WHEN MAX(user_agent->>'userAgent') LIKE '%Firefox%' THEN 'Firefox'
                WHEN MAX(user_agent->>'userAgent') LIKE '%Edge%' THEN 'Edge'
                WHEN MAX(user_agent->>'userAgent') LIKE '%Opera%' THEN 'Opera'
                WHEN MAX(user_agent->>'userAgent') LIKE '%Safari%' 
                     AND MAX(user_agent->>'userAgent') NOT LIKE '%Chrome%' THEN 'Safari'
                ELSE COALESCE(MAX(user_agent->>'browser'), 'unknown') 
            END AS browser,
            COALESCE(MAX(user_agent->>'platform'), 'unknown') AS platform,
            COALESCE(MAX(geolocation->>'country'), 'unknown') AS country,
            COALESCE(MAX(geolocation->>'city'), 'unknown') AS city
        FROM raw_events
        WHERE
            session_id = $1
            AND web_id = $2
        GROUP BY session_id
        LIMIT 1
    `;

    const result = await pool.query<SessionInfo>(query, [sessionId, webId]);
    return result.rows[0] || {
      os: 'unknown',
      browser: 'unknown',
      platform: 'unknown',
      country: 'unknown',
      city: 'unknown'
    };
  }
}




const interfaceDal = new InterfaceDal();
export default interfaceDal;

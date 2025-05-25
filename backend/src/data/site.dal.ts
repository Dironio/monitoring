import pool from "../pool";
import { CreateSiteDao, UpdateSiteDao } from "./types/site.dao";
import { WebSite } from "../services/types/site.dto";

class SiteDal {
  async create(dao: CreateSiteDao): Promise<WebSite> {
    const currentTimestamp = new Date().toISOString();

    const result = await pool.query(`
          INSERT INTO web_sites (
            site, created_at, updated_at
          )
          VALUES (\$1, \$2, \$3)
          RETURNING *
        `, [
      dao.site, currentTimestamp, currentTimestamp
    ]);

    return result.rows[0];
  }

  async getAll(): Promise<WebSite[]> {
    const result = await pool.query(`
          SELECT * FROM web_sites
        `);

    return result.rows;
  }

  async update(dao: UpdateSiteDao): Promise<WebSite> {
    const updatedAt = new Date().toISOString();

    const result = await pool.query(`
      UPDATE web_sites
      SET
        site = $2,
        updated_at = $3
      WHERE id = $1
      RETURNING *
    `, [
      dao.id, dao.site, updatedAt
    ]);

    return result.rows[0];
  }

  async delete(id: number): Promise<WebSite> {
    const result = await pool.query(`
        DELETE FROM web_sites
        WHERE id = $1
        RETURNING *
    `, [id]);
    return result.rows[0];
  }

  async getOne(id: number): Promise<WebSite> {
    const result = await pool.query(`
        SELECT * FROM web_sites
        WHERE id = $1
    `, [id]);
    return result.rows[0];
  }


  async getFilteredSites(webIds: number[], isAdmin: boolean): Promise<WebSite[]> {
    const result = await pool.query(`
        SELECT * 
        FROM web_sites
        WHERE id = $2 --OR ($1 = TRUE OR id = ANY($2::int[]))
    `, [isAdmin, webIds]);


    return result.rows;
  }

}

const siteDal = new SiteDal();
export default siteDal;
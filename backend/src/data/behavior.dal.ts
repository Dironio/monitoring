import pool from "../pool";

class BehaviorDal {
    async getReturningUsers(webId: number): Promise<any> {
        const result = await pool.query(`

    `, [webId]);
        return result.rows;
    }

    async getTotalUsers(webId: number): Promise<any> {
        const result = await pool.query(`

    `, [webId]);
        return result.rows;
    }
}

const behaviorDal = new BehaviorDal();
export default behaviorDal;
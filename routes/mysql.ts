import * as mysql from 'promise-mysql';

export class Mysql {
    private connection: mysql.Connection;

    public async connect(host: string, user: string, password: string, database: string) {
        console.log("mysql.ts connect")
        this.connection = await mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database,
            multipleStatements: true
        });
        const sql = "SELECT * FROM products WHERE `Image Position` = 1";
        const result = await this.connection.query(sql);
        console.log("length", result.lenght);
        return result;
    }
    public async find(host: string, user: string, password: string, database: string, sql: string) {
        this.connection = await mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database,
            multipleStatements: true
        });
        const sqltext = 'SELECT * FROM products ' + sql;
        console.log("async-sql", sql)
        const result = await this.connection.query(sqltext);
        return result;
    }

    public async query(query: string, parameters: any[] = []) {
        // return (await this.connection.query(query, parameters));
    }

    public async end() {
        await this.connection.end();
    }
}
export default new Mysql();
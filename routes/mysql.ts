import * as mysql from 'promise-mysql';

export class Mysql {
    private connection: mysql.Connection;

    public async connect(host: string, user: string, password: string, database: string) {
        this.connection = await mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database,
            multipleStatements: true
        });
        const sql = "SELECT * FROM products WHERE `Image Position` = 1";
        const result = await this.connection.query(sql);
        return result;
    }

    public async query(query: string, parameters: any[] = []) {
        console.log('this.connection2', this.connection);
        console.log('query', query);
        // return (await this.connection.query(query, parameters));
    }

    public async end() {
        await this.connection.end();
    }
}
export default new Mysql();
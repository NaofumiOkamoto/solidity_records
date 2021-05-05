import * as mysql from 'promise-mysql';

export class Mysql {
    private connection: mysql.Connection;
    public async getProducts(host: string, user: string, password: string, database: string, sql: string) {
        console.log("getProducts", sql);
        this.connection = await mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database,
            multipleStatements: true
        });
        const sqltext = 'SELECT * FROM new_products ' + sql;
        const result = await this.connection.query(sqltext);
        return result;
    }
    public async getProductsLike(host: string, user: string, password: string, database: string, sql: string) {
        console.log("getProductsLike", sql);
        this.connection = await mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database,
            multipleStatements: true
        });
        const colmun = sql.split('_')[0]
        const value = sql.split('_')[1]
        const sqltext = 'SELECT * FROM new_products WHERE ' + colmun + ' LIKE "%' + value + '%"';
        const result = await this.connection.query(sqltext);
        return result;
    }
    public async getGenre(host: string, user: string, password: string, database: string, sql: string) {
        console.log("getGenre", sql);
        this.connection = await mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database,
            multipleStatements: true
        });
        const sqltext = 'SELECT * FROM new_genre ' + sql;
        const result = await this.connection.query(sqltext);
        console.log("getGenre result : ", result);
        return result;
    }

    public async getCategorys(host: string, user: string, password: string, database: string, sql: string) {
        console.log("getCategorys", sql);
        this.connection = await mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database,
            multipleStatements: true
        });
        const sqltext = 'select distinct `' + sql +  '` from new_products order by `' + sql + '` ASC';
        console.log("sqltext", sqltext)
        const result = await this.connection.query(sqltext);
        console.log("result", result)
        return result;
    }


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
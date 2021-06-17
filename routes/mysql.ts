import * as mysql from 'promise-mysql';

export class Mysql {
    private connection: mysql.Connection;
    public async getProducts(host: string, user: string, password: string, database: string, sql: string) {
        this.connection = await mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database,
            multipleStatements: true
        });
        let addSql
        console.log("test", sql)
        // collection ページでgenreをチェックしたとき用に追加
        if (sql.indexOf('__') != -1) {
            const genres = sql.split('__')[1]
            const genresArray = genres.split('_')
            addSql = sql.split('__')[0] + ' and (genre LIKE '
            for ( let i = 0; i < genresArray.length; i++ ) {
                if ( i !== 0 ) addSql += " or genre LIKE "
                addSql += '"%' + genresArray[i] + '%"'
                if ( i === genresArray.length - 1 ) addSql += ')'
            }
        } else {
            addSql = sql
        }
        const sqltext = 'SELECT * FROM new_products ' + addSql;
        console.log("getProducts", sqltext);
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
        const colmun = sql.split('__')[0]
        const value = sql.split('__')[1]
        const addSql = sql.split('__')[2]
        const sqltext = 'SELECT * FROM new_products WHERE ' + colmun + ' LIKE "%' + value + '%"' + addSql;
        console.log("sql", sqltext)
        const result = await this.connection.query(sqltext);
        return result;
    }
    public async getProductsGenreLike(host: string, user: string, password: string, database: string, sql: string) {
        console.log("getProductsGenreLike", sql);
        this.connection = await mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database,
            multipleStatements: true
        });
        const arrayGenreId = sql.split('_')
        let result = []
        for ( let i = 0; i < arrayGenreId.length; i++ ) {
            let sqltext
            if ( arrayGenreId.some( id => id.length === 1 ) ) {
                sqltext = 'SELECT * FROM new_products WHERE genre = ' + arrayGenreId[i];
            } else {
                sqltext = 'SELECT * FROM new_products WHERE genre LIKE "%' + arrayGenreId[i] + '%"';
            }
            const resultArray = await this.connection.query(sqltext)
            for ( let j = 0; j < resultArray.length; j++ ) {
                if ( !result.some(product => product.item_id === resultArray[j].item_id) ) {
                    result.push(resultArray[j]);
                }
            }
        }
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
        const equal = sql.indexOf('=')
        const sliceSql = sql.slice(equal + 2)
        let result = []
        // genreが1つの時
        if ( sliceSql.indexOf('_') === -1 && sql !== 'genre' && sql.indexOf('main') === -1 ) {
            console.log("genreが1つの時")
            const sqltext = 'SELECT * FROM new_genre ' + sql;
            result.push((await this.connection.query(sqltext))[0]);
        // genreが2つ以上ある時 (101_102など)
        } else if ( sliceSql.indexOf('_') !== -1 && sql.indexOf('All') === -1 ) {
            console.log("genreが2つ以上の時")
            const arrayGenreId = sliceSql.split('_')
            for ( let i = 0; i < arrayGenreId.length; i++ ) {
                const sqltext = 'SELECT * FROM new_genre where id = ' + Number(arrayGenreId[i]);
                console.log(sqltext)
                result.push((await this.connection.query(sqltext))[0])
            }
        } else {
        // genre一覧を取得するとき
            console.log("genre一覧取得")
            let text = sql.split('_')[0]
            const sqltext = 'SELECT * FROM new_genre ' + text;
            console.log(sqltext)
            result = await this.connection.query(sqltext)
        }
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
    public async searchProducts(host: string, user: string, password: string, database: string, sql: string) {
        console.log("mysql.ts/searchProducts", sql);
        this.connection = await mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database,
            multipleStatements: true
        });
        const sqltext = 'SELECT * FROM new_products WHERE title LIKE "%' + sql + '%" or artist LIKE "%' + sql + '%"';
        console.log(sqltext)
        const result = await this.connection.query(sqltext);
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
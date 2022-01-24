import * as mysql from 'promise-mysql';

// 商品並び順をソートする関数
function sortProducts(key, order) {
    return function(a, b) {
        if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            return 0; 
        }
        const varA = (typeof a[key] === 'string') ? 
            a[key].toUpperCase() : a[key];
        const varB = (typeof b[key] === 'string') ? 
            b[key].toUpperCase() : b[key];
    
        let comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }
        return (
            (order == 'DESC') ? (comparison * -1) : comparison
        );
        };
}

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
        // ソートする時の情報取得
        const sort = ( sql.indexOf('___') !== -1 )? sql.split('___')[1] : ''
        const sqlCustom = ( sql.indexOf('___') !== -1 )? sql.split('___')[0] : sql
        // collection ページでgenreをチェックしたとき用に追加
        if (sqlCustom.indexOf('__') != -1) {
            const genres = sqlCustom.split('__')[1]
            const genresArray = genres.split('_')
            addSql = sqlCustom.split('___')[0].split('__')[0] + ' and (genre LIKE '
            for ( let i = 0; i < genresArray.length; i++ ) {
                if ( i !== 0 ) addSql += " or genre LIKE "
                addSql += '"%' + genresArray[i] + '%"'
                if ( i === genresArray.length - 1 ) addSql += ')'
            }
            addSql += sort
        } else {
            addSql = sqlCustom + sort
        }
        const sqltext = 'SELECT * FROM new_products ' + addSql;
        console.log("mysql.ts/getProducts", sqltext);
        const result = await this.connection.query(sqltext);
        return result;
    }
    // 小ジャンルidで商品を探し出す
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
        const sort = sql.split('__')[3]
        const sqltext = 'SELECT * FROM new_products WHERE ' + colmun + ' LIKE "%' + value + '%"' + addSql + sort;
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
        const arrayGenreId = sql.split('__')[0].split('_')
        const sortSql = sql.split('__')[1]
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
        result.sort(sortProducts(sortSql.split(" ")[2], sortSql.split(" ")[3]))
        return result;
    }
    // products テーブルのgenreカラム(id_id_id....)からジャンル名を取得
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
        const selectedSql = sql.split('_')[0] // 選択した検索条件
        const keywordSql = sql.split('_')[1] // 入力した検索文字
        const statusSql = sql.split('_')[2] === 'undefined' || sql.split('_')[2] === ''? '' : ' and product_status = "' + sql.split('_')[2] + '"' // status
        let sqltext = ''
        if(selectedSql === 'all field'){
            sqltext = 'SELECT * FROM new_products WHERE (title LIKE "%' + keywordSql + '%" or artist LIKE "%' + keywordSql + '%")' + statusSql;
        } else {
            sqltext = 'SELECT * FROM new_products WHERE ' + selectedSql + ' LIKE "%' + keywordSql;
        }
        console.log('sql : ', sqltext)
        const result = await this.connection.query(sqltext);
        return result;
    }
    public async getGenreIdBySearchText(host: string, user: string, password: string, database: string, sql: string) {
        console.log("mysql.ts/searchProducts", sql);
        this.connection = await mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database,
            multipleStatements: true
        });
        const sqltext = 'SELECT * FROM new_genre WHERE sub LIKE "%' + sql + '%"';
        console.log(sqltext)
        const result = await this.connection.query(sqltext);
        return result;
    }
    public async updateProduct(host: string, user: string, password: string, database: string, sql: string) {
        console.log("mysql.ts/updateProduct", sql);
        this.connection = await mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database,
            multipleStatements: true
        });
        const sqltext = 'UPDATE new_Products SET' + sql;
        console.log(sqltext)
        const result = await this.connection.query(sqltext);
        return result;
    }
    public async createProduct(host: string, user: string, password: string, database: string, sql: string) {
        this.connection = await mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database,
            multipleStatements: true
        });
        const sqltext = 'INSERT INTO new_Products ' + sql;
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
import * as bodyParser from "body-parser";
import * as express from "express";
import Routes from "./routes/routes";
import Mysql from "./routes/mysql";

const path = require('path');

class App {

    public express: express.Application;

    // array to hold users
    public users: any[];

    constructor() {
        console.log("app.ts constructor()")
        this.express = express();
        this.middleware();
        this.routes();
        this.users = [];
    }

    // Configure Express middleware.
    private middleware(): void {
        console.log("app.ts middleware()")
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(express.static(process.cwd() + "/vue/dist/"));
    }

    private routes(): void {

        // user route
        this.express.use("/api", Routes);
        this.express.use("/getApi", Routes);

        this.express.get("/getApi", (req, res, next) => {
            console.log("find-sql")
            const sql: string = String(req.query.sql);
            this.getDatabaseProducts(sql).then(result =>{
                res.send(result)
                return
            })
        });
        this.express.get("/getGenre", (req, res, next) => {
            console.log("/getGenre")
            const sql: string = String(req.query.sql);
            this.getDatabaseGenre(sql).then(result =>{
                res.send(result)
                return
            })
        });
        this.express.get("/getCategory", (req, res, next) => {
            console.log("category-sql")
            const sql: string = String(req.query.sql);
            this.getDatabaseCategory(sql).then(result =>{
                res.send(result)
                return
            })
        });

        // handle undefined routes
        this.express.get("/api", (req, res, next) => {
            // console.log("originalUrl : ", req.originalUrl);
            // console.log("baseUrl : ", req.baseUrl);
            // console.log("params : ", req.params);
            // console.log("query.handle : ", req.query.handle);
            // const handle: string = String(req.query.handle);
            const sql: string = String(req.query.sql);

            console.log("paramssql", sql);

            if (sql == "undefined"){
                this.databaseConnect().then(result =>{
                    // console.log("result", result)
                    console.log("Connect")
                    res.send(result)
                    return
                });
            }else{
                this.databaseFind(sql).then(result =>{
                    console.log("find-sql", sql)
                    res.send(result)
                    return
                })
            }


        });
    }
    private getDatabaseProducts(sql){
        var mysql = Mysql
        return mysql.getProducts('localhost', 'root', 'N-okamoto0803', 'solidity_records', sql).then( result =>{
            return result;
        })
    }
    private getDatabaseGenre(sql){
        var mysql = Mysql
        return mysql.getGenre('localhost', 'root', 'N-okamoto0803', 'solidity_records', sql).then( result =>{
            return result;
        })
    }
    private getDatabaseCategory(sql){
        var mysql = Mysql
        return mysql.getCategorys('localhost', 'root', 'N-okamoto0803', 'solidity_records', sql).then( result =>{
            return result;
        })
    }
    private databaseConnect(){
        var mysql = Mysql
        return mysql.connect('localhost', 'root', 'N-okamoto0803', 'solidity_records').then( result =>{
            return result;
        })
    }
    private databaseFind(sql){
        var mysql = Mysql
        return mysql.find('localhost', 'root', 'N-okamoto0803', 'solidity_records', sql).then( result =>{
            return result;
        })
    }
}

export default new App().express;

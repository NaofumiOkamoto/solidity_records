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

        // this.express.get("/", (req, res, next) => {
        //     res.send("sucsess!!!!");
        //     // res.sendFile(process.cwd() + "/vue/dist/index.html");
        // });

        // user route
        this.express.use("/api", Routes);

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
    private databaseConnect(){
        var mysql = Mysql
        return mysql.connect('localhost', 'root', 'N-okamoto0803', 'solidity_records').then( result =>{
            return result;
        })
    }
    private databaseFind(sql){
        var mysql = Mysql
        return mysql.find('localhost', 'root', 'N-okamoto0803', 'solidity_records', handle).then( result =>{
            return result;
        })
    }
}

export default new App().express;

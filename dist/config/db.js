import pg from "pg";
import "./setup.js";
var Pool = pg.Pool;
var devConfig = {
    host: "localhost",
    port: 5432,
    user: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE
};
var prodConfig = { connectionString: process.env.DATABASE_URL, ssl: {} };
if (process.env.MODE === "PROD") {
    prodConfig.ssl = {
        rejectUnauthorized: false
    };
}
var db = new Pool(process.env.MODE === "PROD" ? prodConfig : devConfig);
export default db;

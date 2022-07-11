import "express-async-errors";
import express, { json } from "express";
import cors from "cors";
import "./config/setup.js";
import router from "./routes/index.js";
import { handleErrorsMiddleware } from "./middlewares/handleErrorsMiddleware.js";
var app = express();
app.use(cors());
app.use(json());
app.use(router);
app.use(handleErrorsMiddleware);
var port = process.env.PORT || 5000;
app.listen(port, function () {
    return console.log("Server is running on: http://localhost:".concat(port));
});

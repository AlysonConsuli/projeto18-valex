import express, { json } from "express";
import "express-async-errors";
import cors from "cors";
import "./config/setup.js";

import router from "./routes/index.js";
import { handleErrorsMiddleware } from "./middlewares/handleErrorsMiddleware.js";

const app = express();
app.use(cors());
app.use(json());
app.use(router);
app.use(handleErrorsMiddleware);

const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`Server is running on: http://localhost:${port}`)
);

import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import dotenv from "dotenv";
import route from "./routes/index.route";
import { swaggerDocs } from "./swagger/swagger";
import cors from "cors";

const app = express();
app.use(cors({ origin: "*", credentials: true }));
dotenv.config();
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(methodOverride("_method"));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

route(app);

swaggerDocs(app, Number(process.env.PORT) || 8080);

const isTestEnv = process.env.NODE_ENV === "test";

if (isTestEnv) {
  app.listen(process.env.PORT || 8080, () => {
    console.log(`URL Shortener service running on port ${process.env.PORT}`);
  });
}

export default app;

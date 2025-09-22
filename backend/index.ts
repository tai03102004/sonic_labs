import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import { createClient } from "redis";
import shortId from "shortid";

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

route(app);

const redisClients = [
  createClient({
    url: `redis://${process.env.REDIS_HOST_1}:${process.env.REDIS_PORT_1}`,
  }),
  createClient({
    url: `redis://${process.env.REDIS_HOST_2}:${process.env.REDIS_PORT_2}`,
  }),
  createClient({
    url: `redis://${process.env.REDIS_HOST_3}:${process.env.REDIS_PORT_3}`,
  }),
];

function getRedisClient(key: string) {
  const hash = key.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return redisClients[hash % redisClients.length];
}

swaggerDocs(app, Number(process.env.PORT) || 8080);

app.listen(process.env.PORT || 8080, () => {
  console.log(`URL Shortener service running on port ${process.env.PORT}`);
});

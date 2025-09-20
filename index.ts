import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import redis from "redis";
import shortId from "shortid";

import route from "./routes/index.route";

const app = express();
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(methodOverride("_method"));

route(app);

const redisClients = [
  redis.createClient({
    url: `redis://${process.env.REDIS_HOST_1}:${process.env.REDIS_PORT_1}`,
  }),
  redis.createClient({
    url: `redis://${process.env.REDIS_HOST_2}:${process.env.REDIS_PORT_2}`,
  }),
  redis.createClient({
    url: `redis://${process.env.REDIS_HOST_3}:${process.env.REDIS_PORT_3}`,
  }),
];

function getRedisClient(key: string) {
  const hash = key.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return redisClients[hash % redisClients.length];
}

app.listen(process.env.PORT || 3000, () => {
  console.log(`URL Shortener service running on port ${process.env.PORT}`);
});

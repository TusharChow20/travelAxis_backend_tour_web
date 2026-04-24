import { createClient } from "redis";
import varEnv from "./env";

const redisClient = createClient({
  username: varEnv.REDIS_USERNAME as string,
  password: varEnv.REDIS_PASSWORD as string,
  socket: {
    host: varEnv.REDIS_HOST,
    port: Number(varEnv.REDIS_PORT),
  },
});

redisClient.on("error", (err) => console.error("Redis Client Error:", err));
redisClient.on("connect", () => console.log("Redis connected"));

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export default redisClient;

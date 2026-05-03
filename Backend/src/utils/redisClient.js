import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const redisClient = createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

redisClient.on("connect", () => {
  console.log("Connected to Redis successfully!");
});

// Chờ kết nối, có thể ném vào hàm khởi tạo server để đảm bảo kết nối trước khi nhận request
const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    console.error("Could not connect to Redis", error);
  }
};

// Các hàm thao tác phổ biến
const getCache = async (key) => {
  if (!redisClient.isOpen) return null;
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};

const setCache = async (key, value, expInSeconds = 3600) => {
  if (!redisClient.isOpen) return;
  await redisClient.setEx(key, expInSeconds, JSON.stringify(value));
};

const deleteCache = async (key) => {
  if (!redisClient.isOpen) return;
  await redisClient.del(key);
};

const clearPattern = async (pattern) => {
  if (!redisClient.isOpen) return;
  const keys = await redisClient.keys(pattern);
  if (keys.length > 0) {
    await redisClient.del(keys);
  }
};

export { redisClient, connectRedis, getCache, setCache, deleteCache, clearPattern };

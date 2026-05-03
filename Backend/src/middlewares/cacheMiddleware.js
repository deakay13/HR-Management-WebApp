import { getCache, setCache } from "../utils/redisClient.js";

const cacheMiddleware = (durationInSeconds = 3600) => {
  return async (req, res, next) => {
    // Chỉ cache method GET
    if (req.method !== "GET") {
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;

    try {
      const cachedResponse = await getCache(key);

      if (cachedResponse) {
        // Cache Hit
        return res.json(cachedResponse);
      }

      // Cache Miss
      // Ghi đè phương thức res.json để lưu cache trước khi trả về client
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        // Có thể bổ sung check HTTP status code 200 mới cache
        if (res.statusCode >= 200 && res.statusCode < 300) {
          setCache(key, body, durationInSeconds).catch((err) =>
            console.error("Error setting cache", err)
          );
        }
        return originalJson(body);
      };

      next();
    } catch (error) {
      console.error("Cache middleware error", error);
      next(); // Bỏ qua cache nếu lỗi, gọi API như bình thường
    }
  };
};

export default cacheMiddleware;

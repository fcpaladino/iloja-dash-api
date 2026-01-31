import Redis from "ioredis";
import redisConfig from "../config/redis";

export const redis = new Redis({
  host: redisConfig.host, // IP do servidor Redis
  port: Number(redisConfig.port) || 6379, // Porta do Redis
  password: redisConfig.password, //senha
});

export const setRedis = async (key, value, ttl = null) => {
  try {
    const stringValue = JSON.stringify(value);
    if (ttl) {
      await redis.set(key, stringValue, "EX", ttl);
    } else {
      await redis.set(key, stringValue);
    }
  } catch (error) {
    console.error("Erro ao definir valor no Redis:", error);
  }
};

export const getRedis = async (key) => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Erro ao obter valor do Redis:", error);
    return null;
  }
};

export const getRedisKeys = async (prefix) => {
  try {
    const keys = await redis.keys(`${prefix}*`);

    if (keys.length === 0) {
      return [];
    }

    const values = await Promise.all(keys.map(key => redis.get(key)));

    return keys.map((key, index) => ({
      key,
      value: JSON.parse(values[index]) // Tenta converter JSON, se aplicável
    }));

  } catch (error) {
    console.error("Erro ao obter valores do Redis:", error);
    return [];
  }
};


export const delRedisKeys = async (prefix) => {
  try {

    const keys = await redis.keys(`${prefix}*`);
    if (keys.length !== 0) {
      await redis.del(keys);
    }

    return;

  } catch (error) {
    console.error("Erro ao deletar valores do Redis:", error);
    return [];
  }
};


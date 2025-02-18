import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Redis error:', err));

redisClient.connect();

export const setSession = async (userId: string, token: string, ttl: number = 86400) => {
  await redisClient.set(`session:${userId}`, token, { EX: ttl });
};

export const getSession = async (userId: string) => {
  return redisClient.get(`session:${userId}`);
};

export const deleteSession = async (userId: string) => {
  await redisClient.del(`session:${userId}`);
};
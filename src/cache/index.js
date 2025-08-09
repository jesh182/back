const { createClient } = require('redis');
const { REDIS_URL, ENABLE_REDIS } = require('../consts');

const redisClient = createClient({ url: REDIS_URL }).on('error', (err) => {
  console.error('Redis Client Error', err);
});

redisClient.connect();

const cacheWrapper = async (cacheKey, fetcher) => {
  if (!ENABLE_REDIS) {
    console.warn('Redis caching is disabled');
    return fetcher();
  }

  const cachedData = await redisClient.get(cacheKey);

  if (cachedData) {
    console.info(`Cache hit for key: ${cacheKey}`);
    return JSON.parse(cachedData);
  }

  console.info(`Cache miss for key: ${cacheKey}`);
  const data = await fetcher();
  await redisClient.set(cacheKey, JSON.stringify(data), { expiration: { type: 'EX', value: 600 } }); // Cache for 10 minutes

  return data;
};

module.exports = {
  redisClient,
  cacheWrapper,
};

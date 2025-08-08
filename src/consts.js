require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  ENABLE_REDIS: process.env.ENABLE_REDIS === 'true',
};

const Redis = require("redis");

// System Variables
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;

//TODO: create a redis client
const redis_url = (process.env.SERVICE_ENV === 'production') ?
    `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}` :
    `redis://${REDIS_HOST}:${REDIS_PORT}`

const rClient = Redis.createClient({
  url: redis_url
});

rClient.on('error', err => {
  console.error('Redis Client Error. Details: ', err);
  process.exit(1);
});

rClient.connect()
  .then(() => {
    console.log("Redis client connected.")
  }).catch(err => {
    console.log('Failed to connect redis client');
    process.exit(1);
  });

module.exports = rClient;
const redisDB = require('redis');
const redisClient = redisDB.createClient({
    host: 'rediss://red-cgkbkukeoogkndi81gsg:34RpvkV6tj1Rc3s48qN25TVbYEgUwqqF@oregon-redis.render.com',
    port: 6379
  });
redisClient.connect();
redisClient.on('connect', () => {console.log("connecting to redis");});
redisClient.on('ready', () => {console.log("connected to redis and ready to use");});
redisClient.on('error', (err) => {console.log("Redis Error is:  " + err);});
redisClient.on('reconnecting', () => {console.log("reconnecting to redis");});
redisClient.on('end', () => {console.log("redis connection ended");});

module.exports = redisClient;
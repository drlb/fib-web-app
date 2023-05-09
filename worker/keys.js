module.exports = {
    // Looking for redis host and port from environment variables each time we want to connect redis!
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT
};
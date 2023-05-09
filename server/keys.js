module.exports = {
    // Looking for redis host and port from environment variables each time we want to connect redis!
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,

    // Looking for pg credentials (info) from environment variables each time we want to connect pg!
    pgUser: process.env.PGUSER,
    pgHost: process.env.PGHOST,
    pgDatabase: process.env.PGDATABASE,
    pgPassword: process.env.PGPASSWORD,
    pgPort: process.env.PGPORT
};
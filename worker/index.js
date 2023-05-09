// import keys.js file
const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost, // import host from keys.js file
    port: keys.redisPort, // import port from keys.js file
    retry_strategy: () => 1000 // tell to redisClient if we ever loses connection to our redis server it should attempt auto reconnect every one sec
});

const sub = redisClient.duplicate();

// Calculating fib squence
function fib(index){
    if (index < 2) return 1;
    return fib(index-1) + fib(index-2);
}

// When redis get new message (index) redisClient will be set new value on redis server using fib function calculating
sub.on('message', (channel, message) => {
    redisClient.hset('values', message, fib(parseInt(message)));
});
sub.subscribe('insert');


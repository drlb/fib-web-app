// import keys.js file
const keys = require('./keys');

// Express App Setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// object - app recive and respond to any http request coming or going back to the react server
const app = express();

/*
Cross Origin Resource Sharing - its allow us to make requets from one domain that the react app is going to be running on
to a different domain that the express API is hosted on
*/
app.use(cors());

/*
The body parser is going to parse incoming requests from the react app
and turn the body of the post request into a json value to make express API work easier
*/
app.use(bodyParser.json());


// Postgress Client Setup
const { Pool } = require("pg");
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});

// Each time that pg will lost connection error message will appear in the console (log)
pgClient.on('error', () => console.log('Lost PG Connection!'))


// Create a new table if not exist to store all inserted value from web app
pgClient.on("connect", (client) => {
    client
      .query("CREATE TABLE IF NOT EXISTS values (number INT)")
      .catch((err) => console.error(err));
  });


// Redis Client Setup
const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost, // import host from keys.js file
    port: keys.redisPort, // import port from keys.js file
    retry_strategy: () => 1000 // tell to redisClient if we ever loses connection to our redis server it should attempt auto reconnect every one sec
});

const redisPublisher = redisClient.duplicate();

// Express route handlers
app.get('/', (req, res) =>{
    res.send('Hi');
});

// Get all values that hav been submitted (from web to pg db)
app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * from values');
    
    res.send(values.rows);
});

// Get all values that stored in Redis
app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    });
});

// Get value from user (react app ui)
app.post('/values', async (req, res) => {
    const index = req.body.index;
    if (parseInt(index) > 40){
        return res.status(422).send('Index is to high!');
    }

    // Set the new value into redis (will replace the unset value)
    redisClient.hset('values', index, 'unset value');
    
    // Will used for message to trigger the worker to calculate the fib sequence
    redisPublisher.publish('insert', index);

    pgClient.query("INSERT INTO values(number) VALUES($1)" , [index]);
    res.send({ working: true });

});

app.listen(5000, err =>{
    console.log('Listening');
});
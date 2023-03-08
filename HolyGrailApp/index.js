require('dotenv').config();
const express = require("express");
const app = express();
const RedisHeplers = require('./services/redis/helpers');

// System Variables
const SERVICE_PORT = process.env.SERVICE_PORT;
const SERVICE_ENV = process.env.SERVICE_ENV;

// serve static files from public directory
app.use(express.static("public"));



// Get values for holy grail layout
async function data() {
  // TODO: uses Promise to get the values for header, left, right, article and footer from Redis
  try {
    // Approach 1. Individual key-value pairs.
    // const data = await RedisHeplers.dataApOne();


    // Approach 2. Single key and stringified object as value.
    const data = await RedisHeplers.dataApTwo();


    // Approach 3. Hash Object with key-value pairs. 
    // ** Redis Hash doesn't support nested objects out of the box. Although there ways around it.
    // We can use Hash over here 'cause there's no nested object(s) to store/handle. 
    // const data = await RedisHeplers.dataApThree();

    if(data) return data;

    return RedisHeplers.init_data;

  } catch (err) {

    // This catch block is redundant as we have already handled the exceptions in helper modules of Redis service.
    // Although, it never hurts to take extra measures.
    console.error('Exception in data retreival module. Details: ', err);
    return RedisHeplers.init_data;

  }
}

// plus
app.get("/update/:key/:value", async function (req, res) {
  const key = req.params.key;
  let value = Number(req.params.value);

  //TODO: use the redis client to update the value associated with the given key

  // Approach 1. Individual key-value pairs.
  // const data = await RedisHeplers.updateApOne(key, value);

  // Approach 2. Single key and stringified object as value.
  const data = await RedisHeplers.updateApTwo(key, value);

  // Approach 3. Hash Object with key-value pairs. 
  // const data = await RedisHeplers.updateApThree(key, value);

  return res.send(data);
});


// get key data
app.get("/data", function (req, res) {
  data().then((data) => {
    console.log(data);
    res.send(data);
  });
});



app.listen(SERVICE_PORT, () => {
  console.log(`Running on ${SERVICE_PORT}, ENV: ${SERVICE_ENV}`);
});

process.on("exit", function () {
  rClient.quit();
});

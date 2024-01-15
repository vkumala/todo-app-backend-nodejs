// import the `MongoClient` object from the library
const { MongoClient } = require("mongodb");

// define the connection string. If you're running your DB
// on your laptop, this would most likely be it's address
const connectionUrl = "mongodb://0.0.0.0:27017/";
// Define the DB name. We will call ours `store`
const dbName = "babi-todo";

// Create a singleton variable `db`
let db;

// The init function retruns a promise, which, once resolved,
// assigns the mongodb connection to the `db` variable
const init = () =>
  MongoClient.connect(connectionUrl).then(
    (client) => {
      db = client.db(dbName);
    }
  );

  const listCollection = () => db.collection("list");
  const itemCollection = () => db.collection("item");


module.exports = { init,listCollection,itemCollection };

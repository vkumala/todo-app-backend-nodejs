const { itemCollection } = require("../database/mongodb");
var ObjectId = require("mongodb").ObjectId;

const getUndoneItems = async (req, res) => {
  let listId = new ObjectId(req.params.listId);
  let results = await itemCollection()
    .aggregate([
      { $match: { listId: listId, done: false } },
      {
        $sort: {
          timestamp_created: -1,
        },
      },
    ])
    .toArray();
  res.send(results).status(200);
};

const getDoneItems = async (req, res) => {
  let listId = new ObjectId(req.params.listId);
  let results = await itemCollection()
    .aggregate([
      { $match: { listId: listId, done: true } },
      {
        $sort: {
          timestamp_created: -1,
        },
      },
    ])
    .toArray();
  res.send(results).status(200);
};

const getItemById = async (req, res) => {
  let itemId = new ObjectId(req.params.itemId);
  let results = await itemCollection()
    .aggregate([{ $match: { _id: itemId } }])
    .toArray();
  if (results.length > 0) {
    res.send(results[0]).status(200);
  } else {
    res.send(results).status(400);
  }
};

const addItem = async (req, res) => {
  let listId = new ObjectId(req.params.listId);
  let newItem = req.body;
  newItem["listId"] = listId;
  newItem["timestamp_created"] = new Date().toISOString();
  let result = await itemCollection().insertOne(newItem);
  res.send(result).status(200);
};

const updateItem = async (req, res) => {
  const query = { _id: new ObjectId(req.body._id) };
  let updatedItem = req.body;
  updatedItem["_id"] = new ObjectId(req.body._id);
  updatedItem["listId"] = new ObjectId(req.body.listId);
  updatedItem["timestamp_modified"] = new Date().toISOString();
  let result = await itemCollection().replaceOne(query, updatedItem);
  res.send(result).status(200);
};

const deleteItem = async (req, res) => {
  const query = { _id: new ObjectId(req.params.itemId) };
  let result = await itemCollection().deleteOne(query);
  res.send(result).status(200);
};

//const functionName = async (req, res) => {};

module.exports = {
  getUndoneItems,
  getDoneItems,
  getItemById,
  updateItem,
  deleteItem,
  addItem,
};

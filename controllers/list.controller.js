const { listCollection, itemCollection } = require("../database/mongodb");
var ObjectId = require("mongodb").ObjectId;

const getAllLists = async (req, res, next) => {
  const results = await listCollection().find().toArray();
  res.status(200).send(results);
};

const getListById = async (req, res, next) => {
  try {
    let listId = new ObjectId(req.params.listId);
    let results = await listCollection().find({ _id: listId }).toArray();
    if (results.length > 0) {
      res.status(200).send(results[0]);
    } else {
      res.status(404).send({results}); //TODO
    }
  } catch (error) {
    next(error)
  }
};
 
const addList = async (req, res) => {
  let newList = req.body;
  newList["timestamp_created"] = new Date().toISOString();
  let result = await listCollection().insertOne(newList);
  res.send(result).status(200);
};

const deleteList = async (req, res) => {
  // remove list
  const queryList = { _id: new ObjectId(req.params.listId) };
  let resultList = await listCollection().deleteOne(queryList);
  // remove items
  const queryItems = { listId: new ObjectId(req.params.listId) };
  let resultItems = await itemCollection().deleteMany(queryItems);
  let allResults = {
    list: resultList,
    item: resultItems, 
  }; //TODO
  res.send(allResults).status(200);
};


const updateList = async (req, res) => {
  const query = { _id: new ObjectId(req.body._id) };
  let updatedItem = req.body;
  updatedItem["_id"] = new ObjectId(req.body._id);
  updatedItem["timestamp_modified"] = new Date().toISOString();
  let result = await listCollection().replaceOne(query, updatedItem);
  res.send(result).status(200);
};


module.exports = {
  getAllLists,
  getListById,
  addList,
  deleteList,
  updateList,
};

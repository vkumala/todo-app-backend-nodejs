const { listCollection, itemCollection } = require("../database/mongodb");
var ObjectId = require("mongodb").ObjectId;

const getAllLists = async (req, res) => {
  const results = await listCollection()
    .aggregate([
      {
        $lookup: {
          from: "item",
          localField: "_id",
          foreignField: "listId",
          as: "result",
        },
      },
      {
        $project: {
          group: 1,
          color: 1,
          name: 1,
          timestamp_created: 1,
          numberOfItems: {
            $size: "$result",
          },
        },
      },
      {
        $sort: {
          name: 1,
        },
      },
      {
        $group: {
          _id: "$group",
          lists: {
            $push: {
              _id: "$_id",
              name: "$name",
              color: "$color",
              timestamp_createdr: "$timestamp_created",
              numberOfItems: "$numberOfItems",
            },
          },
        },
      },
      {
        $addFields: {
          name: "$_id",
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: {
          name: 1,
        },
      },
    ])
    .toArray();
  res.send(results).status(200);
};

const getListById = async (req, res) => {
  let listId = new ObjectId(req.params.listId);
  let results = await listCollection().find({ _id: listId }).toArray();
  if (results.length > 0) {
    res.send(results[0]).status(200);
  } else {
    res.send(results).status(400);
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
  };
  res.send(allResults).status(200);
};

const getExistedGroups = async (req, res) => {
  let result = await listCollection()
    .aggregate([
      {
        $match: {
          group: {
            $ne: null,
          },
        },
      },
      {
        $group: {
          _id: null,
          allGroups: {
            $addToSet: "$group",
          },
        },
      },
    ])
    .toArray();
  if (result.length > 0) {
    res.send(result[0]["allGroups"].sort()).status(200);
  } else {
    res.send([]).status(200);
  }
};
const replaceList = async (req, res) => {
  const query = { _id: new ObjectId(req.body._id) };
  let updatedItem = req.body;
  updatedItem["_id"] = new ObjectId(req.body._id);
  updatedItem["timestamp_modified"] = new Date().toISOString();
  let result = await listCollection().replaceOne(query, updatedItem);
  res.send(result).status(200);
};

const functionName = async (req, res) => {};

module.exports = {
  getAllLists,
  getListById,
  addList,
  replaceList,
  deleteList,
  getExistedGroups,
};

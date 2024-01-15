const { itemCollection } = require("../database/mongodb");
var ObjectId = require("mongodb").ObjectId;

const fs = require("fs");
const multer = require("multer");
const getUncheckedItems = async (req, res) => {
  let listId = new ObjectId(req.params.listId);
  let results = await itemCollection()
    .aggregate([
      { $match: { listId: listId, checked: false } },
      {
        $sort: {
          timestamp_created: -1,
        },
      },
    ])
    .toArray();
  res.send(results).status(200);
};

const getCheckedItems = async (req, res) => {
  let listId = new ObjectId(req.params.listId);
  let results = await itemCollection()
    .aggregate([
      { $match: { listId: listId, checked: true } },
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
  console.log("req.params.itemId", req.params.itemId);
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

const replaceItem = async (req, res) => {
  const query = { _id: new ObjectId(req.body._id) };
  let updatedItem = req.body;
  updatedItem["_id"] = new ObjectId(req.body._id);
  updatedItem["listId"] = new ObjectId(req.body.listId);
  updatedItem["timestamp_modified"] = new Date().toISOString();
  let result = await itemCollection().replaceOne(query, updatedItem);
  res.send(result).status(200);
};

const updateItem = async (req, res) => {
  const query = { _id: new ObjectId(req.params.itemId) };
  let updatedItem = req.body;
  updatedItem["timestamp_modified"] = new Date().toISOString();
  let result = await itemCollection().updateOne(query, {
    $set: updatedItem,
  });
  res.send(result).status(200);
};
const deleteItem = async (req, res) => {
  const query = { _id: new ObjectId(req.params.itemId) };
  let result = await itemCollection().deleteOne(query);
  res.send(result).status(200);
};

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = "uploads/" + req.params.itemId;
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    res
      .send({
        message: "File uploaded successfully",
        filename: req.file.filename,
      })
      .status(200);
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the file: ${req.file.filename}. ${err}`,
    });
  }
};

const getAllFiles = async (req, res) => {
  const path = "uploads/" + req.params.itemId;
  fs.readdir(path, (err, files) => {
    res.send(files).status(200);
  });
};

const downloadFile = async (req, res) => {
  const path = "uploads/" + req.params.itemId + "/" + req.body.filename;
  res.status(200).download(path);
};

const deleteFile = async (req, res) => {
  const path = "uploads/" + req.params.itemId + "/" + req.body.filename;
  fs.unlink(path, (err) => {
    res
      .json({
        message: "File deleted successfully",
        filename: req.body.filename,
      })
      .status(200);
  });
};

const addItem = async (req, res) => {
  let listId = new ObjectId(req.params.listId);
  let newItem = req.body;
  newItem["listId"] = listId;
  newItem["timestamp_created"] = new Date().toISOString();
  let result = await itemCollection().insertOne(newItem);
  res.send(result).status(200);
};
const functionName = async (req, res) => {};

module.exports = {
  getUncheckedItems,
  getCheckedItems,
  getItemById,
  updateItem,
  replaceItem,
  deleteItem,
  addItem,
  upload,
  uploadFile,
  deleteFile,
  downloadFile,
  getAllFiles,
};

const express = require("express");
const cors = require("cors");
const app = express();
const listRoutes = require("./routes/list.routes");
const itemRoutes = require("./routes/item.routes");
const { init } = require("./database/mongodb");

require("dotenv").config();

var corsOptions = {
   origin: "http://localhost:8080",
   optionsSuccessStatus: 200,
   credentials: true
};

const PORT = process.env.PORT || 8080;


app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/list", listRoutes);
app.use("/item", itemRoutes);

init().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
});

/* 
const { MongoClient } = require("mongodb");
const url = "mongodb://0.0.0.0:27017/";
const client = new MongoClient(url);
const dbName = "babi-todo";
var ObjectId = require("mongodb").ObjectId;
client.connect();
console.log("Connected successfully to server");
const db = client.db(dbName); */

/* 
app.get("/lists", async (req, res) => {
  let results = await db
    .collection("list")
    .aggregate([
      {
        $match: {
          group: null,
        },
      },
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
    ])
    .toArray();
  res.send(results).status(200);
});

app.get("/list/:listId", async (req, res) => {
  let listId = new ObjectId(req.params.listId);
  let results = await db
    .collection("list")
    .aggregate([{ $match: { _id: listId } }])
    .toArray();
  res.send(results).status(200);
});

app.get("/groups", async (req, res) => {
  let results = await db
    .collection("list")
    .aggregate([
      {
        $match: {
          group: {
            $ne: null,
          },
        },
      },
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
          numberOfItems: {
            $size: "$result",
          },
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
});

app.post("/add_list/", async (req, res) => {
  let newList = req.body;
  newList["timestamp_created"] = new Date();
  let result = await db.collection("list").insertOne(newList);
  res.send(result).status(200);
});

app.post("/remove_list/", async (req, res) => {
  // remove list
  const queryList = { _id: new ObjectId(req.body._id) };
  let resultList = await db.collection("list").deleteOne(queryList);
  console.log("resultList", resultList);
  // remove item
  const queryItems = { listId: new ObjectId(req.body._id) };
  let resultItems = await db.collection("item").deleteMany(queryItems);
  console.log("resultItems", resultItems);
  let allResults = {
    list: resultList,
    item: resultItems,
  };
  res.send(allResults).status(200);
});

app.post("/update_list/", async (req, res) => {});

app.post("/add_item/:listId", async (req, res) => {
  let listId = new ObjectId(req.params.listId);
  let newItem = req.body;
  newItem["listId"] = listId;
  newItem["timestamp_created"] = new Date().toISOString();
  let result = await db.collection("item").insertOne(newItem);
  res.send(result).status(200);
});

app.post("/delete_item/:itemId", async (req, res) => {
  // remove item
  const query = { _id: new ObjectId(req.params.itemId) };
  let result = await db.collection("item").deleteOne(query);
  res.send(result).status(200);
});

app.post("/update_item/", async (req, res) => {
  const query = { _id: new ObjectId(req.body._id) };
  let updatedItem = req.body;
  updatedItem["_id"] = new ObjectId(req.body._id);
  updatedItem["listId"] = new ObjectId(req.body.listId);
  updatedItem["timestamp_modified"] = new Date().toISOString();
  console.log("updatedItem", updatedItem);
  let result = await db.collection("item").replaceOne(query, updatedItem);
  res.send(result).status(200);
});


//TODO - optimize aggregation, sort the result
app.get("/all_groups/", async (req, res) => {
  let result = await db
    .collection("list")
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
  res.send(result[0]["allGroups"].sort()).status(200);
});

app.get("/items_unchecked/:listId", async (req, res) => {
  let listId = new ObjectId(req.params.listId);
  let results = await db
    .collection("item")
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
});

app.get("/items_checked/:listId", async (req, res) => {
  let listId = new ObjectId(req.params.listId);
  let results = await db
    .collection("item")
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
});

app.get("/item_detail/:itemId", async (req, res) => {
  let itemId = new ObjectId(req.params.itemId);
  let results = await db
    .collection("item")
    .aggregate([{ $match: { _id: itemId } }])
    .toArray();
  res.send(results).status(200);
});

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
app.post("/upload_file/:itemId", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res
    .json({
      message: "File uploaded successfully",
      filename: req.file.filename,
    })
    .status(200);
});

app.get("/files/:itemId", async (req, res) => {
  const path = "uploads/" + req.params.itemId;
  fs.readdir(path, (err, files) => {
    res.send(files).status(200);
  });
});

app.post("/download_file/:itemId", async (req, res) => {
  const path = "uploads/" + req.params.itemId + "/" + req.body.filename;
  res.download(path).status(200);
});

app.post("/delete_file/:itemId", async (req, res) => {
  const path = "uploads/" + req.params.itemId + "/" + req.body.filename;
  console.log(path);
  fs.unlink(path, (err) => {
    res
      .json({
        message: "File deleted successfully",
        filename: req.body.filename,
      })
      .status(200);
  });
}); */

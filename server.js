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

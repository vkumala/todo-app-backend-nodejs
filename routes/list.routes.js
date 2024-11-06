const express = require("express");
const router = express.Router();
const listController = require("../controllers/list.controller");

router.get("/all", listController.getAllLists);
router.get("/:listId", listController.getListById);
router.post("/add", listController.addList);
router.delete("/delete/:listId", listController.deleteList);
router.put("/update", listController.updateList);

module.exports = router;

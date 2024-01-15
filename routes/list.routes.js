const express = require("express");
const router = express.Router();
const listController = require("../controllers/list.controller");

router.get("/all", listController.getAllLists);
router.get("/detail/:listId", listController.getListById);
router.post("/add", listController.addList);
router.delete("/delete/:listId", listController.deleteList);
router.post("/replace", listController.replaceList);
//router.put("/update/:listId", null);
router.get("/existed_groups", listController.getExistedGroups);

module.exports = router;

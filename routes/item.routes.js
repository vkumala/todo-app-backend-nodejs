const express = require("express");
const router = express.Router();
const itemController = require("../controllers/item.controller");

router.get("/done/:listId", itemController.getDoneItems);
router.get("/undone/:listId", itemController.getUndoneItems);
router.get("/:itemId", itemController.getItemById);
router.post("/add/:listId", itemController.addItem);
router.put("/update", itemController.updateItem);
router.delete("/delete/:itemId", itemController.deleteItem);

module.exports = router;

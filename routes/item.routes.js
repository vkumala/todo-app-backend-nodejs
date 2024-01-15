const express = require("express");
const router = express.Router();
const itemController = require("../controllers/item.controller");

router.get("/unchecked/:listId", itemController.getUncheckedItems);
router.get("/checked/:listId", itemController.getCheckedItems);
router.get("/detail/:itemId", itemController.getItemById);
router.post("/add/:listId", itemController.addItem);
router.delete("/delete/:itemId", itemController.deleteItem);
router.post("/replace", itemController.replaceItem);
router.post(
  "/upload_file/:itemId",
  itemController.upload.single("file"),
  itemController.uploadFile
);
router.post("/download_file/:itemId", itemController.downloadFile);
router.post("/delete_file/:itemId", itemController.deleteFile);
router.get("/files/:itemId", itemController.getAllFiles);

module.exports = router;

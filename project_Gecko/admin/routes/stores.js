const { deleteStore, getStores } = require("../../clients/controllers/Store");
const { getAllStores } = require("../controllers/user");
const router = require("express").Router();

router.get("/getStore/:storeId",getStores);
router.post("/deleteStore",deleteStore);
router.post("/getAllStores",getAllStores);

module.exports = router;
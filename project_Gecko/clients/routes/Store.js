const express = require("express");
const { uploadPhotos } = require("../../utils/utils");
const { storeValidation, messages } = require("../../utils/validation");
// const { deleteStore } = require('../../../controller/Store/Store');
const { 
	clientAuthorization,
	authenticate, 
	customerAuthorization
} = require("../../utils/middleware");
const { 
	getStores, 
	addStore, 
	editStore, 
	deleteStore, 
	getSingleStore 
} = require("../controllers/Store");


const router = express.Router();

router.get("/",
	customerAuthorization,
	clientAuthorization
	,getStores);
router.delete("/deleteStore",
	customerAuthorization,
	clientAuthorization,
	authenticate,
	deleteStore);
router.post("/getSingleStore",
	customerAuthorization,
	clientAuthorization,
	getSingleStore);
router.post("/addStore",
	customerAuthorization,
	clientAuthorization,
	uploadPhotos,
	storeValidation,
	messages,
	addStore
);
router.put("/editStore",
	customerAuthorization,
	clientAuthorization,
	storeValidation,
	messages,
	editStore
);


module.exports = router;
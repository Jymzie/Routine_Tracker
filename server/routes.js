const express = require('express');
const router = express.Router();

// Changed from import to require and removed .ts extension
const sampleControllers = require("./controllers/sampleController");

router.get("/sample", sampleControllers.get_table);
router.post("/next", sampleControllers.next);
router.patch("/updatecheck", sampleControllers.updatecheck);
router.post("/sample/res", sampleControllers.insert_data);

// Changed from export default to module.exports
module.exports = router;
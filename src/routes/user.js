const express = require('express');
const router = express.Router();
const controller=require('../controllers/user')
router.get("/",controller.get)
router.get("/create",controller.renderSaveForm)
router.get("/edit/:user_id",controller.renderSaveForm)
router.post("/create",controller.saveForm)
router.post("/edit/:user_id",controller.saveForm)
module.exports={router}


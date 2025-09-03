const express = require('express');
const router = express.Router();
const controller=require('../controllers/user')
router.get("/",controller.get)
router.get("/export",controller.export)
router.get("/create",controller.renderSaveForm)
router.get("/edit/:user_id",controller.renderSaveForm)
router.post("/create",controller.saveForm)
router.post("/edit/:user_id",controller.saveForm)
router.get("/delete/:user_id",controller.deleteUser)
module.exports={router}


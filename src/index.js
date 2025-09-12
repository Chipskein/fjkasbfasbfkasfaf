const path = require("path")
const express = require('express')
const app = express()
const port = 3000
const {router:userRouter}=require('./routes/user')
const {logger} = require('./middlewares/logger')
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static('public'));
app.use(logger);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use("/users",userRouter)
app.get("/",(req,res) => res.redirect("/users"))
app.use("/{*any}",(req,res) => res.redirect("/users"))
app.listen(port, () => console.log(`Example app listening on port ${port}`))

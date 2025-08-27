const path=require("path")
const express = require('express')
const app = express()
const port = 3000
const {router:userRouter}=require('./routes/user')
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use("/users",userRouter)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

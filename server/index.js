const express = require('express')
const cors = require('cors')
require('dotenv').config()
const userRoute = require('./routes/user')
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });

const app = express();
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use('/user',userRoute)

app.listen(process.env.PORT,()=>{
    console.log('server is running on Port no. 5000')
})
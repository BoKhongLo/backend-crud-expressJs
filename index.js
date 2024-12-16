const express = require('express');
const app = express();
const bodyParser = require('body-parser');

require('dotenv').config(); // Tải các biến môi trường từ tệp .env

const user = require('./routes/user.route')
const auth = require('./routes/auth.route')


// Connecting to the database
const dbConfig = `mongodb://localhost:${process.env.DB_PORT}/user`;
const mongoose = require('mongoose');
// Set strictQuery to true (suppress the deprecation warning)
mongoose.set('strictQuery', true);
mongoose.connect(dbConfig,
  err => {
      if(err) throw err;
      console.log('connected to MongoDB')
  });


// Cors errror handle
cors = require('cors');
app.use(cors())

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// routes
app.use('/user', user);
app.use('/auth',auth)

app.listen(process.env.PORT, () => {
  console.log('server listening on port 8080')
})

app.get('/', (req, res) => {
  res.send('Hello from our server!')
})

// app.post('/create',(req, res) => {
//   res.send('create')
// })
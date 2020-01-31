// use express framework
const express = require('express');
const app = express();

// use dotenv for environment variables
const dotenv = require('dotenv');
dotenv.config();

// Set port from environment variable
const PORT = process.env.PORT || process.env.SERVER_PORT;

// Middleware used to parse the request data
const bodyParser = require('body-parser');

// Middleware for application/json
app.use(bodyParser.json());

// Connect DB to nodeJS server
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
 }).catch(err => {
   if (err.name === 'MongoNetworkError' || err.name === 'MongoTimeoutError') {
     console.log('Init: Error connecting to the MongoDB, please check that the MongoDB server is running.');
   } else {
     console.log(err.name);
   }
 });

mongoose.connection.on('connected', () => console.log('connected to MongoDB server'));

mongoose.connection.on('error', err => {
console.log(err.name);
});

// catch process errors
process.on('uncaughtException', err => {
  if (err.name === 'MongoNetworkError') {
    console.log('disconnected from MongoDB...');
  } else {
    console.log(err);
  }
});

// allow CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

// Import Routes
const authRoutes = require('./routes/routeAuth');
const circularRoutes = require('./routes/routeCircular');
const examRoutes = require('./routes/routeExam');
const facultyRoutes = require('./routes/routeFaculty');
const leaveRoutes = require('./routes/routeLeave');
const studentRoutes = require('./routes/routeStudent');
const userRoutes = require('./routes/routeUser');

// Routes
app.get('/', (req, res) => res.render('index')); // Landing Page
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/circulars', circularRoutes);
app.use('/api/v1/exams', examRoutes);
app.use('/api/v1/faculty', facultyRoutes);
app.use('/api/v1/leaves', leaveRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/users', userRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

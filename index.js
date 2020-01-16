// use express framework
const express = require('express');
const app = express();

// use dotenv for environment variables
const dotenv = require('dotenv');
dotenv.config();

// Set port from environment variable
const PORT = process.env.SERVER_PORT;

// Middleware used to parse the request data
const bodyParser = require('body-parser');

// Middleware for application/json
app.use(bodyParser.json());

// Connect DB to nodeJS server
const mongoose = require('mongoose');
const db = mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
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
const examRoutes = require('./routes/routeExam');
const studentRoutes = require('./routes/routeStudent');
const userRoutes = require('./routes/routeUser');

// Routes
app.get('/', (req, res) => res.render('index')); // Landing Page
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/exams', examRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/users', userRoutes);

app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));

// app.get('/api/v1/reg', (req, res) => {

    // ENABLE to create new data file (will overwrite old one)
    // require('fs').writeFile(
    //     './fakeRegTable.json',
    //     JSON.stringify(fakeRegTable),
    //     function (err) {
    //         if (err) {
    //             console.error(err);
    //         }
    //     }
    // );

    // Sending back fake data from file
    // require('fs').readFile('./fakeRegTable.json', 'utf8', (err, data) => {
    //     if (err) {
    //         throw err;
    //     }
    //     console.log('sent fakeRegTable.json', new Date(Date.now()));
    //     res.status(200).send(JSON.parse(data));
    // })

// });


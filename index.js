const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
require('dotenv').config(); 

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// Middleware for parsing URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS for all routes
app.use(cors());

const AddCandidatesinBulk = require("./Controller/AddCandidatesinBulk")


// Define your routes and other middleware
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app
  .route('/api/candidates/addcandidatesinbulk')
  .post(AddCandidatesinBulk.AddCandidatesinBulk);


// Start the server
const PORT = process.env.PORT || 3000;
console.log("ENV",process.env.PORT)
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

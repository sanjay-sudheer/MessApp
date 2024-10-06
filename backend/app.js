const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/dbConfig');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 3001;

connectDB();

// Middleware
app.use(bodyParser.json());

app.use(cors());

app.use('/api/auth', authRoutes); 


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/dbconfig');
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const inmateRoutes = require('./routes/inmateRoutes');

const app = express();
const port = process.env.PORT || 3001;

connectDB();

// Middleware
app.use(bodyParser.json());

app.use(cors());

app.use('/api/auth', authRoutes); 
app.use('/api/attendance', attendanceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/inmate', inmateRoutes);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
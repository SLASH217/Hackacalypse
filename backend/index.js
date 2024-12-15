
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const connectMongo=require('./db');
const app=express();
const cors=require('cors');
connectMongo();

app.use(cors());
app.use(express.json());
app.use('/auth',require('./routes/auth'))

const PORT = process.env.PORT || 2000;

 
// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

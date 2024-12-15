const express=require("express");
const dotenv=require('dotenv');
dotenv.config();
const connectMongo=require('./db');
const PORT=process.env.PORT;
const app=express();
const cors=require('cors');
connectMongo();

app.use(cors());
app.use(express.json());
app.use('/auth',require('./routes/auth'))
app.use('/broadcast',require('./routes/broadcast'))
app.use('/trade',require('./routes/trade'))
app.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`)
})

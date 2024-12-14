const mongoose=require('mongoose');
const connectMongo=()=>{
    mongoose.connect(process.env.MONGOURI).then(()=>{
        console.log('Database connected successfully');
    }).catch((error)=>{
        console.log("Error connecting to database");
    })
}

module.exports=connectMongo;
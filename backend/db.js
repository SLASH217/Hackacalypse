const mongoose=require('mongoose');
const connectMongo=async()=>{
    try{
        await mongoose.connect(process.env.MONGOURI).then(()=>{
            console.log("Connected to MongoDB");
        }).catch((error)=>{
            console.log(error)
        })
    }
    catch(error){
        console.log(error)
    }
}

module.exports=connectMongo;
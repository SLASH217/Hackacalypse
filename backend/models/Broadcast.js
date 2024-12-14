const mongoose=require('mongoose');
const Broadcast=mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    text:{
        type: String,
        required: true
    }
})

module.exports=mongoose.model("broadcast", Broadcast);
import mongoose, { Schema } from "mongoose";
import { unique } from "next/dist/build/utils";

const userSchema = new Schema({
    firstname:{
        type:String,
        require:true
    },
    middlename:{
        type:String,
        require:true
    },
    lastname:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    role:{
        type:String,
        require:true
    },
    image_url:{
        type:String,
        default:""
    },
    public_id:{
        type:String,
        default:""
    },
    
},{
        timestamps:true
    })

    const User = mongoose.models.User ||  mongoose.model("User",userSchema)
    export default User;
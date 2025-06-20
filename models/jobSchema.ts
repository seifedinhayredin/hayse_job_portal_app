import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema({
    jobname:{
        type:String,
        require:true
    },
    qualification:{
        type:String,
        require:true
    },
    experiance:{
        type:String,
        require:true
    },
    status:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
},{timestamps:true});

const JobCollection = mongoose.models.jobCollection || mongoose.model("jobCollection",jobSchema);
export default JobCollection;
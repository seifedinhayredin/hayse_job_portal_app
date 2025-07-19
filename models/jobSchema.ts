import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema({
    employerName:{
        type:String,
        require:true
    },
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
    address: { 
        type: String, 
        required: true 
    },

    description:{
        type:String,
        require:true
    },
    deadline:{
        type:Date,
        require:true
    },
    employerId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the user who posted the job
      required: true,
    },
},{timestamps:true});

const JobCollection = mongoose.models.jobCollection || mongoose.model("jobCollection",jobSchema);
export default JobCollection;
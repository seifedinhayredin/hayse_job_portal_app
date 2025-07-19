import mongoose, { Schema } from "mongoose";

const applicationSchema = new Schema({
    jobId:{
        type:Schema.Types.ObjectId,
        ref:"jobCollection",
        require:true
    },
    applicantId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        require:true,
    },
    status:{
     type:String,
     enum: ["pending", "reviewed", "accepted", "rejected"],
     default:"pending",
    },
    appliedAt:{
        type:Date,
        default:Date.now,
    }
},
{timestamps:true}
)

const ApplicationToJob = mongoose.models.ApplicationToJob || mongoose.model("ApplicationToJob",applicationSchema)
export default ApplicationToJob;
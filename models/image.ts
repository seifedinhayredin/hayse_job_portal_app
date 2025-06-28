import mongoose, { Schema } from "mongoose";

const imageSchema = new Schema({
    image_url:String,
    public_id:String,
},{
    timestamps:true
});

const Image = mongoose.models.Image || mongoose.model("Image",imageSchema);
export default Image;
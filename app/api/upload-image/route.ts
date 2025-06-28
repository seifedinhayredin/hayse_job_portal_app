import { connectDB } from "@/lib/db";
import { UploadImage } from "@/lib/upload-image";
import Image from "@/models/image";

export async function POST(request:Request) {

    await connectDB();
    const formData = await request.formData();

    try {
        const image =  formData.get("image") as File;

        if(image){
            //upload to cloudinary
            const uploadResult:any =  await UploadImage(image,"upload-image");

            console.log("Image Result: ",uploadResult);

            await Image.create({
                image_url:uploadResult.secure_url,
                public_id:uploadResult.public_id,
            })
        }
        return Response.json({message:"Image Uploaded Sucessfully"});
        
    } catch (error) {
        console.log("Error while uploading Image");

        return Response.json({message:"Error occured when uploading Image"});
        
    }
    
}
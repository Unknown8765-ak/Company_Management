import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

const uploadoncloudinary = async (localfilepath)=>{
    try {
        if (!localfilepath) return null
        const response = await cloudinary.uploader.upload(localfilepath ,{
            resource_type : "auto"
        })

    //file has been uploaded succesfully
    console.log("file is uploaded on cloudinary",response.url)
        fs.unlinkSync(localfilepath);
    return response
    
    } catch (error) {
        if (fs.existsSync(localfilepath)) {
            fs.unlinkSync(localfilepath);
        } //remove the locally saved temporary file as the upload opertaion got failed
        return null;
    }
}

export { uploadoncloudinary }





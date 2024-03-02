import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"
import dotenv from "dotenv"


dotenv.config({
    path: './.env'
})

cloudinary.config({ 
  cloud_name: process.env.CLOUDNARY_CLOUD_NAME, 
  api_key: process.env.CLOUDNARY_API_KEY, 
  api_secret: process.env.CLOUDNARY_API_SECRET 
});
          

const uploadOnCloudnary = async (localFilePath) => {
    const folderPath = 'gallery/'
    try {
        const response = await cloudinary.uploader.upload(localFilePath,{ folder:folderPath });
        return response
    } catch (error) {
        return null
    } finally {
        fs.unlinkSync(localFilePath)
    }
}


const getImagesFromCloudnary = async () => {
    try {
        const data = await cloudinary.api.resources({ type: 'upload', prefix: 'gallery/' })
        return data.resources
    } catch (error) {
        console.log(error);
        return null
    }
}


const deleteFromCloudnary = async (publicId) => {
    try {
        const response = await cloudinary.uploader.destroy(publicId);
        return response
    } catch (error) {
        return null
    }
}


export { uploadOnCloudnary, getImagesFromCloudnary, deleteFromCloudnary }
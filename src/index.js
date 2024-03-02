import express from "express";
import { upload } from "./middlewares/multer.middleware.js";
import dotenv from "dotenv"
import cors from "cors"
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { deleteFromCloudnary, getImagesFromCloudnary, uploadOnCloudnary } from "./utils/cloudnary.js";


// Get the current module's URL
const currentModuleURL = import.meta.url;

// Convert the URL to a file path
const currentModulePath = fileURLToPath(currentModuleURL);

// Get the directory name
const currentModuleDir = dirname(currentModulePath);

// Navigate up to the project root
const projectRootDir = dirname(currentModuleDir);

const app = express()
const port = 3000

dotenv.config({
    path: './.env'
})

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use('/public', express.static("public"));


app.post('/upload-image',upload.single('image'), async (req,res) => {
    if (!req.file) {
        return res.status(400).json("Image file is required")
    }
    const response = await uploadOnCloudnary(req.file.path)
    if (!response) {
      return res.status(500).json("Error while uploading image")
    }
    res.status(200).json("Image uploaded successfully")
})

app.get('/get-images', async (req, res) => {
    const uploadPath = path.join(projectRootDir, 'public', 'storage');
  
    // fs.readdir(uploadPath, (err, files) => {
    //   if (err) {
    //     return res.status(500).json({ error: 'Error reading directory' });
    //   }
      
    //   const imageFiles = files.filter(file => fs.statSync(path.join(uploadPath, file)).isFile());
  
    //   res.json({ files: imageFiles });
    // });
    const data = await getImagesFromCloudnary()
    res.json(data);
});

app.delete('/delete-image/:imageName',async (req,res) => {
    const imageName = req.params.imageName
    // const imagePath = path.join(projectRootDir, 'public', 'storage', imageName)

    // fs.unlink(imagePath,(err) => {
    //     if (err) {
    //         return res.status(500).json({error:"Failed to delete image"})
    //     }

    //     res.status(200).json({message:"Image deleted successfully"})
    // })
    const response = await deleteFromCloudnary(`gallery/${imageName}`)
    if (!response) {
      return res.status(500).json("Error while deleting the image")
    }
    res.status(200).json({message:"Image deleted successfully"})
})  

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
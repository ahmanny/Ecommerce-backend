import { NextFunction, Request, Response } from "express";
import cloudinary from "../configs/cloudinary.config";



export const uploadToCloudinary = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.files || !(req.files instanceof Array)) {
        return res.status(400).json({ message: "No files uploaded" })
    }
    try {
        const name = req.body.title
        const uploadPromises = req.files.map((file) => {
            return new Promise<string>((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: 'product_images',
                        format: 'png',
                        public_id: `${name}_${Date.now()}`,
                    },
                    (error, cloudinaryResult) => {
                        if (error) reject(error);
                        else resolve(cloudinaryResult?.secure_url || '')
                    }
                ).end(file.buffer);
            });
        });

        req.cloudinaryUrls = await Promise.all(uploadPromises)
        next()

    } catch (error) {
        res.status(500).json({ message: "Error uploading images:", error })
    }
}
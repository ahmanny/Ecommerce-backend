import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../configs/cloudinary.config';
import { getUserByEmail } from '../models/user.model';

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const user = await getUserByEmail(req.body.email)
        if (!user) {
            throw new Error('User not found');
        }
        const userId = user._id
        return {
            folder: 'profile_pictures',
            format: 'png',
            public_id: `${userId}_${Date.now()}`,
        };
    },
});

export const upload = multer({ storage });



import multer from 'multer';


// multer configuration to handle multiple file uploads in memory.
const storage = multer.memoryStorage()

export const upload = multer({ storage });

// const storage = new CloudinaryStorage({
//     cloudinary,
//     params: async (req, file) => {

//         const name = req.body.title
//         console.log("upload middlware",file);
//         const productByName = await Product.findOne({ title: name })

//         if (productByName) {
//             console.log("there is product with this title here");
//             // throw new Exception("product  by this title   already exists")
//             res.stat
//         }

//         return {
//             folder: 'product_images',
//             format: 'png',
//             public_id: `${name}_${Date.now()}`,
//         };
//     },
// });














// export const checkIfProductExist = 
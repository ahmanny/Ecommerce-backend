






// export const completeRegistrationController = (): RequestHandler => {
//     return async (req: express.Request, res: express.Response): Promise<void> => {
//         try {
//             const profilePicture = req.file?.path;
//             const data = await AuthService.completeRegistration({
//                 ...req.body,
//                 profilePicture: profilePicture,
//             });

//             created_handler(res, "Registered succesfully", data)
//         } catch (error) {
//             error_handler(error, req, res)
//         }
//     }
// }


// export const validateOtpController = (): RequestHandler => {
//     return async (req: express.Request, res: express.Response): Promise<void> => {
//         try {
//             const data = await AuthService.verifyOtpFunction(req.body)

//             ok_handler(res, " successfully", data)

//         } catch (error) {
//             error_handler(error, req, res)
//         }
//     }
// }





// export const addNewUser = (): RequestHandler => {
//     return async (req: express.Request, res: express.Response): Promise<void> => {
//         try {
//             await UserService.addNewUserService(req.body, req)
//             ok_handler(res, "Added user successfully")
//         } catch (error) {
//             console.log(error);

//             error_handler(error, req, res)
//         }
//     }
// }



// export const getUser = (): RequestHandler => {
//     return async (req: express.Request, res: express.Response): Promise<void> => {
//         try {
//             ok_handler(res, "got all successfull", { user: req?.user })
//         } catch (error) {
//             res.status(400).json({ message: 'Error getting user' });
//         }
//     }
// }








// export const refresh = async (req: Request, res: Response) => {
//     const current_user = req.body.user;
//     const user_id = JSON.parse(current_user)._id;

//     try {
//         const refresh_token_doc = await RefreshToken.findOne({ user_id: user_id });
//         const token_info = getTokenInfo({
//             token: refresh_token_doc?.refresh_token || '',
//             token_type: 'refresh',
//         });

//         if (token_info?.user && token_info?.is_valid_token) {
//             const tokens = await generateTokens(token_info?.user);
//             return res.status(200).json({
//                 error: false,
//                 user: token_info?.user,
//                 access_token: tokens?.access_token,
//                 message: 'Token refreshed successfully',
//             });
//         }

//         return res.status(200).json({
//             error: true,
//             status: 407,
//             message: 'Refresh token is not valid or not found. Login Again.',
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: true, message: 'Internal Server Error' });
//     }
// };

// export const validate = async (req: Request, res: Response) => {
//     const token = req.body.access_token;

//     const is_valid_token = getTokenInfo(token)?.is_valid_token;

//     if (is_valid_token) {
//         res.status(200).json({
//             error: false,
//             message: 'Token is valid',
//         });
//     } else {
//         refresh(req, res);
//     }
// };

import bcrypt from 'bcrypt';
import { getUserByEmail, getUserByName, getUsers, User } from '../models/user.model';
import { RefreshToken } from '../models/refresh-token.model';
import { generateTokens } from '../utils';
import express, { Request, RequestHandler, Response } from 'express';
import { getTokenInfo } from '../utils';
import Exception from '../exceptions/Exception';
import { created_handler, error_handler, ok_handler } from '../utils/response_handler';
import UserExistException from '../exceptions/UserExistException';
import { AuthService } from '../services/auth.service';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/user.service';




// sign up controller
export const signup = (): RequestHandler => {
    return async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            const data = await AuthService.signUpFunction(req.body)
            created_handler(res, "account successfully creatd", data)
        } catch (error) {
            error_handler(error, req, res)
        }
    }
}



// login controller
export const loginController = (): RequestHandler => {
    return async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            const data = await AuthService.loginFunction(req.body)

            ok_handler(res, "logged in successfully", data)
        } catch (error) {
            error_handler(error, req, res)
        }
    }
}


// forgotten password function
export const forgottenPasswordController = (): RequestHandler => {
    return async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            const data = await AuthService.forgottenPasswordFunction(req.body)
            ok_handler(res, "sent reset password link successfully", data)
        } catch (error) {
            error_handler(error, req, res)
        }
    }
}


// reset password function
export const passwordResetController = (): RequestHandler => {
    return async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            const { token } = req.params
            const data = AuthService.passwordResetFunction({ ...req.body, token: token })
            ok_handler(res, "password succesfully reseted")
        } catch (error) {
            error_handler(error, req, res)
        }
    }
}



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

import { AuthService } from "../services/auth.service"
import express, { Request, RequestHandler, Response } from 'express';
import { created_handler, error_handler, ok_handler } from "../utils/response_handler";
import InvalidAccessCredentialsExceptions from "../exceptions/InvalidAccessCredentialsException";


// sign up controller
export const signup = (): RequestHandler => {
    return async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            const data = await AuthService.signUpFunction(req.body)
            created_handler(res, "account successfully creatd", data)
        } catch (error) {
            console.log(error);
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
            console.log(error);
            error_handler(error, req, res)
        }
    }
}

// refresh user session token controller
export const refreshToken = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {

        try {
            const { refresh_token } = req.body;
            if (!refresh_token) {
                throw new InvalidAccessCredentialsExceptions("No refresh token provided")
            }

            const data = await AuthService.refreshUserToken(refresh_token)

            ok_handler(res, "token refreshed", data)
        } catch (error) {
            console.error('Refresh token error:', error);
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
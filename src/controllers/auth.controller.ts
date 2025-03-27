import { AuthService } from "../services/auth.service"
import express, { Request, RequestHandler, Response } from 'express';
import { created_handler, error_handler, ok_handler } from "../utils/response_handler";


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
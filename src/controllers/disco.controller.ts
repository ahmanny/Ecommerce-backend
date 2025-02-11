import InvalidAccessCredentialsExceptions from "../exceptions/InvalidAccessCredentialsException"
import express, { Request, RequestHandler, Response } from 'express';
import { created_handler, error_handler, ok_handler } from "../utils/response_handler";
import { DiscoService } from "../services/disco.service";
import { Disco, getDiscoById, getDiscos } from "../models/disco.model";
import Exception from "../exceptions/Exception";
import { getUsersUnderDiscoID } from "../models/user.model";









export const addNewDiscoController = (): RequestHandler => {
    return async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            if (!req.user) throw new InvalidAccessCredentialsExceptions("Access denied")
            const data = await DiscoService.addNewDiscoService(req.body, req.user.name, req.user._id)

            created_handler(res, "Created Successfully", data)
        } catch (error) {
            error_handler(error, req, res)
        }
    }
}

export const getAllDiscos = (): RequestHandler => {
    return async (req: express.Request, res: express.Response): Promise<void> => {
        try {

            const data = await getDiscos()

            ok_handler(res, 'successful', data)
        } catch (error) {
            console.log(error);
            error_handler(error, req, res)
        }
    }
}

export const getDiscoByIdAndMembers = (): RequestHandler => {
    return async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            const id = req.params.id

            const disco = await getDiscoById(id)

            if (!disco) {
                throw new Exception("Disco not found")
            }
            const data = await getUsersUnderDiscoID(id)

            ok_handler(res, 'Successfull', data)
        } catch (error) {
            console.log(error);

            error_handler(error, req, res)
        }
    }
}
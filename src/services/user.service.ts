
import express from 'express';
import { generateOTP, getOtpEmailContent } from "../utils/otp.utils";
import mailjetClient from "../configs/mailjet.config";
import { getUserByEmail, getUserByName, User } from "../models/user.model";
import Exception from "../exceptions/Exception";
import { SendVerificationEmailPayload } from "../types/disco.types";
import { getVerificationEmailContent } from "../utils/disco.utils";
import InvalidAccessCredentialsExceptions from "../exceptions/InvalidAccessCredentialsException";
import { AddNewUserPayloadInterface } from '../types';
import { getDiscoById } from '../models/disco.model';
import { EmailService } from './email.service';







class UserServiceClass {
    constructor() {
        // super()
    }
    public async addNewUserService(payload: AddNewUserPayloadInterface, req: express.Request) {
        if (!req.user) {
            throw new InvalidAccessCredentialsExceptions('No user logged in')
        }
        const id = req.params.id
        const disco = await getDiscoById(id)
        const userBy_Email = await getUserByEmail(payload.email)
        if (!disco) {
            throw new Exception('No disco found')
        }
        if (userBy_Email) {
            throw new Exception('This Email is associated with another account')
        }

        const new_user = await new User({ email: payload.email, name: payload.name, role: payload.role, disco: disco._id, createdBy: req.user._id }).save()

        await EmailService.sendUserVerificationEmail({
            email: payload.email,
            name: payload.name,
            discoName: disco.discoName,
            senderName: req.user.name,
            id: new_user._id
        })
    }
}



export const UserService = new UserServiceClass();





























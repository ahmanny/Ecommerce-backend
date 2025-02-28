
import express from 'express';
import { generateOTP, getOtpEmailContent } from "../utils/otp.utils";
import mailjetClient from "../configs/mailjet.config";
import { getUserByEmail, getUserByName, User } from "../models/user.model";
import Exception from "../exceptions/Exception";
import InvalidAccessCredentialsExceptions from "../exceptions/InvalidAccessCredentialsException";
import { AddNewUserPayloadInterface } from '../types';
import { EmailService } from './email.service';







class UserServiceClass {
    constructor() {
        // super()
    }

}



export const UserService = new UserServiceClass();





























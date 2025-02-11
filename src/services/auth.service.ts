import InvalidAccessCredentialsExceptions from "../exceptions/InvalidAccessCredentialsException";
import { getUserByEmail, getUserById, getUserByName, getUserByPhone, getUserByRole, User } from "../models/user.model";
import { CompleteRegistrationPayloadInterface, LoginPayloadInterface, OtpverifyPayloadInterface } from "../types/auth.types";
import bcrypt from 'bcrypt';
import { generateTokens } from "../utils";
import Exception from "../exceptions/Exception";
import { EmailService } from "./email.service";
import { deleteUserOtpById, getUserOtpById, otpCode } from "../models/otp.model";
import { authenticator } from "otplib";
import jwt from 'jsonwebtoken';
import { exec } from "child_process";
import { error_handler, ok_handler } from "../utils/response_handler";


class AuthServiceClass {
    constructor() {
        // super()
    }
    public async loginFunction(payload: LoginPayloadInterface) {
        const user = await getUserByEmail(payload.email)

        if (!user) {
            throw new InvalidAccessCredentialsExceptions("Invalid email")
        }
        if (!user.isVerified) {
            throw new Exception('User not registered')
        }
        await EmailService.sendOtpEmail(payload.email, user.name)
    }

    // registration

    public async checkTokenFunction(payload: { token: string }) {
        try {
            const decoded = jwt.verify(payload.token, process.env.JWT_SECRET_EMAIL_VERIFICATION!) as { id: string }

            const user = await getUserById(decoded.id)
            if (!user) {
                throw new Exception('Invalid registration link')
            }

            return { isRegistered: user.isVerified }
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new Exception('Registration link has expired')
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new InvalidAccessCredentialsExceptions('Invalid registration link')
            }
        }
    }


    public async completeRegistration(payload: CompleteRegistrationPayloadInterface) {
        const user_phone = await getUserByPhone(payload.phone)
        if (user_phone) {
            throw new Exception('A user by this number already exists')
        }

        const user = await getUserByEmail(payload.email)

        if (!user) {
            throw new Exception('User not found')
        }


        const updateData: Partial<CompleteRegistrationPayloadInterface & { isVerified: boolean }> = {
            isVerified: true,
            phone: payload.phone,
            role: payload.role ?? user.role,
            idCard_number: payload.idCard_number,
        };


        if (payload.profilePicture) {
            updateData.profilePicture = payload.profilePicture;
        }

        const new_user = await User.findByIdAndUpdate(user._id, updateData, { new: true });
        const tokens = await generateTokens(new_user);

        return {
            new_user, tokens
        }
    }





    public async create_Superadmin() {
        const superadmin = {
            name: 'Super admin',
            email: 'arab@mailinator.com',
            phone: '00000000001',
            disco: '648abf5e1e91d9f92b6b5678',
            role: 'superadmin',
            isVerified: true
        }
        const superadmin_acct = await getUserByRole(superadmin.role)
        if (!superadmin_acct) {
            await User.create({ ...superadmin })
            console.log('created a superadmin');
        }

    }


    public async verifyOtpFunction(payload: OtpverifyPayloadInterface) {
        authenticator.options = {
            window: 20,
            digits: 6,
        };

        const user = await getUserByEmail(payload.email);
        if (!user) {
            throw new Exception("Invalid email");
        }

        const userId = user._id;
        const otpRecord = await getUserOtpById(userId).exec();

        if (!otpRecord) {
            throw new Exception("You were not sent an OTP");
        }

        const isExpired = Date.now() > otpRecord.otpExpiration.getTime();
        if (isExpired) {
            await deleteUserOtpById(userId);
            throw new Exception("OTP has expired");
        }

        const isValid = authenticator.verify({ token: payload.otpcode, secret: otpRecord.secret });

        if (!isValid) {
            throw new InvalidAccessCredentialsExceptions("Incorrect code");
        }
        await deleteUserOtpById(userId);

        const tokens = await generateTokens(user);
        return {
            user, tokens
        }
    }
}
export const AuthService = new AuthServiceClass();




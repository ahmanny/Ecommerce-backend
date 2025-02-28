import { generateOTP, getOtpEmailContent } from "../utils/otp.utils";
import mailjetClient from "../configs/mailjet.config";
import { getUserByEmail } from "../models/user.model";
import Exception from "../exceptions/Exception";
import jwt from 'jsonwebtoken';
import { SendResetPasswordLinkEmailPayload } from "../types/email.types";
import { getVerificationEmailContent } from "../utils/email.utils";







class EmailServiceClass {
    constructor() {
        // super()
    }
    // send otp to user for email confirmation
    public async sendOtpEmail(user_email: string, user_name: string) {
        const otpCode = await generateOTP(user_email)

        const emailContent = await getOtpEmailContent({ user_name, otpCode })
        try {
            await mailjetClient

                .post("send", { version: "v3.1" })
                .request({
                    Messages: [
                        {
                            From: {
                                Email: process.env.EMAIL_FROM,
                                Name: "ecommerce"
                            },
                            To: [
                                {
                                    Email: user_email,
                                    Name: user_name
                                }
                            ],
                            Subject: "Your OTP Code",
                            HTMLPart: emailContent
                        }
                    ]
                });
            return 'Otp sent succesfully';
        } catch (error) {
            console.log(error);
            throw new Exception("Could not send otp")
        }
    }



    public async sendUserResetPasswordEmail(payload: SendResetPasswordLinkEmailPayload) {

        const secret = process.env.JWT_SECRET as string
        const resetToken = jwt.sign({ id: payload.id }, secret, { expiresIn: "1d" })


        const content = await getVerificationEmailContent({
            token: resetToken,
            email: payload.email,
            name: payload.name,
        })

        try {
            await mailjetClient

                .post("send", { version: "v3.1" })
                .request({
                    Messages: [
                        {
                            From: {
                                Email: process.env.EMAIL_FROM,
                                Name: "Pulse"
                            },
                            To: [
                                {
                                    Email: payload.email,
                                    Name: payload.name
                                }
                            ],
                            Subject: "Reset Password",
                            HTMLPart: content
                        }
                    ]
                });
            return 'reset password link was sent succesfully';

        } catch (error) {
            console.log(error);
            throw new Exception("Could not send reset password link")
        }



    }




}



export const EmailService = new EmailServiceClass();
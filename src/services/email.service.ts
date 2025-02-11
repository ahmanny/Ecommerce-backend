import { generateOTP, getOtpEmailContent } from "../utils/otp.utils";
import mailjetClient from "../configs/mailjet.config";
import { getUserByEmail } from "../models/user.model";
import Exception from "../exceptions/Exception";
import { SendVerificationEmailPayload } from "../types/disco.types";
import { getVerificationEmailContent } from "../utils/disco.utils";
import jwt from 'jsonwebtoken';







class EmailServiceClass {
    constructor() {
        // super()
    }
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
                                Name: "Pulse"
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



    public async sendUserVerificationEmail(payload: SendVerificationEmailPayload) {
        const token = jwt.sign({ id: payload.id }, process.env.JWT_SECRET_EMAIL_VERIFICATION!, {
            expiresIn: '3d',
        });

        const content = await getVerificationEmailContent({
            senderName: payload.senderName,
            discoName: payload.discoName,
            token: token,
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
                            Subject: "Complete registration",
                            HTMLPart: content
                        }
                    ]
                });
            return 'registeration link sent succesfully sent succesfully';

        } catch (error) {
            console.log(error);
            throw new Exception("Could not send registeration link")
        }



    }




}



export const EmailService = new EmailServiceClass();
import fs from 'fs/promises'; // Correct fs import
import Handlebars from 'handlebars';
import path from 'path';
import { getUserByEmail, updateUserByEmail } from '../models/user.model';
import { deleteUserOtpById, getUserOtpById, otpCode } from '../models/otp.model';
import Exception from '../exceptions/Exception';
import { authenticator } from 'otplib';

interface OtpEmailData {
    user_name: string;
    otpCode: string;
}





export async function generateOTP(user_email: string) {
    const user = await getUserByEmail(user_email);
    if (!user) {
        throw new Exception("Invalid User ID");
    }
    const userId = user._id;


    authenticator.options = {
        window: 20,
        digits: 6,
    };

    const secret = authenticator.generateSecret();
    const otp = authenticator.generate(secret);
    const expirationTime = Date.now() + (10 * 60 * 1000);

    const otpRecord = await getUserOtpById(userId);
    if (otpRecord) {
        await deleteUserOtpById(userId);
    }

    const values = {
        userId,
        otpExpiration: expirationTime,
        secret,
    };

    await otpCode.create(values);

    return otp;
}



export async function getOtpEmailContent({ user_name, otpCode }: OtpEmailData): Promise<string> {
    try {
        const templatePath = path.resolve(__dirname, '..', 'templates', 'otpCode_templates.hbs');

        const templateSource = await fs.readFile(templatePath, 'utf-8');

        const template = Handlebars.compile(templateSource);

        return template({ user_name, otpCode });
    } catch (error) {
        console.error("Error reading or compiling template:", error);
        throw error;
    }
}

import InvalidAccessCredentialsExceptions from "../exceptions/InvalidAccessCredentialsException";
import { getUserByEmail, getUserById, getUserByName, getUserByPhone, getUserByRole, User } from "../models/user.model";
import { forgottenPasswordPayloadInterface, LoginPayloadInterface, passwordResetPayloadInterface, SignupPayloadInterface } from "../types/auth.types";
import bcrypt from 'bcrypt';
import { generateTokens, getTokenInfo } from "../utils";
import Exception from "../exceptions/Exception";
import { EmailService } from "./email.service";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { RefreshToken } from "../models/refresh-token.model";


class AuthServiceClass {
    constructor() {
        // super()
    }

    // registration of new customerr
    public async signUpFunction(payload: SignupPayloadInterface) {
        const user_name = await getUserByName(payload.name)
        const user_email = await getUserByEmail(payload.email)

        // check if a user with the name and email exists
        if (user_name && user_email) {
            throw new Exception('Account already exist');
        } else if (user_email) {
            throw new Exception('Email already exists');
        }

        // encript password before storing in the db
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(payload.password, salt);
        const user = await User.create({ ...payload, password: hashedPassword });

        const tokens = await generateTokens(user);
        return {
            user, tokens
        }
    }




    // login service for user
    public async loginFunction(payload: LoginPayloadInterface) {
        const user = await getUserByEmail(payload.email)

        // check if the user exists if not throw invalid email
        if (!user) {
            throw new InvalidAccessCredentialsExceptions("Invalid email")
        }
        // check if user is verified
        // if (user.isVerified) {
        //     throw new Exception('User not registered')
        // }
        const validPassword = await bcrypt.compare(payload.password, user.password);
        // check if user entered a correct password
        if (!validPassword) {
            throw new InvalidAccessCredentialsExceptions("Invalid credentials")
        }
        const tokens = await generateTokens(user);
        return {
            user, tokens
        }
    }



    // refresh users session using refreshtoken
    public async refreshUserToken(refresh_token: string) {

        const token_info = await getTokenInfo({
            token: refresh_token,
            token_type: 'refresh',
        });

        const user = token_info?.user;

        if (!token_info?.is_valid_token || !user) {
            throw new InvalidAccessCredentialsExceptions("Invalid or expired refresh token")
        }

        // 2. Check if token is in DB
        const tokenInDb = await RefreshToken.findOne({ refresh_token: refresh_token, user_id: user._id });
        if (!tokenInDb) {
            throw new InvalidAccessCredentialsExceptions("Refresh token not found in DB")
        }

        //3. delete old token and save new one
        await RefreshToken.deleteOne({ token: refresh_token });

        const tokens = await generateTokens(user);
        return {
            tokens, user
        }
    }



    // forgotten password service

    public async forgottenPasswordFunction(payload: forgottenPasswordPayloadInterface) {
        const user = await getUserByEmail(payload.email)


        // check if a user with the email exist
        if (!user) {
            throw new InvalidAccessCredentialsExceptions("Account does not exist")
        }
        // check if user is verified
        if (!user.isVerified) {
            throw new Exception('User not registered')
        }
        const data = await EmailService.sendUserResetPasswordEmail({ email: user.email, name: user.name, id: user._id })
        return {
            data
        }
    }


    // reset password
    public async passwordResetFunction(payload: passwordResetPayloadInterface) {
        const secret = process.env.JWT_SECRET as string
        const decoded = jwt.verify(payload.token, secret) as JwtPayload
        const user = await getUserByEmail(decoded.email)
        // check if a user with the email exist
        if (!user) {
            throw new InvalidAccessCredentialsExceptions("invalid credential")
        }
        // check if user is verified
        if (!user.isVerified) {
            throw new Exception('User not registered')
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(payload.password, salt);
        user.password = hashedPassword;
        user.save()

    }




    public async create_Superadmin() {
        const admin = {
            name: 'Super admin',
            email: 'arab@mailinator.com',
            phone: '00000000001',
            password: "1234567890",
            role: 'admin',
            isVerified: true
        }
        const admin_acct = await getUserByRole(admin.role)
        if (!admin_acct) {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(admin.password, salt);
            const new_admin = await User.create({ ...admin, password: hashedPassword });
            console.log('created a admin');
            console.log(new_admin);

        }

    }


    // public async verifyOtpFunction(payload: OtpverifyPayloadInterface) {
    //     authenticator.options = {
    //         window: 20,
    //         digits: 6,
    //     };

    //     const user = await getUserByEmail(payload.email);
    //     if (!user) {
    //         throw new Exception("Invalid email");
    //     }

    //     const userId = user._id;
    //     const otpRecord = await getUserOtpById(userId).exec();

    //     if (!otpRecord) {
    //         throw new Exception("You were not sent an OTP");
    //     }

    //     const isExpired = Date.now() > otpRecord.otpExpiration.getTime();
    //     if (isExpired) {
    //         await deleteUserOtpById(userId);
    //         throw new Exception("OTP has expired");
    //     }

    //     const isValid = authenticator.verify({ token: payload.otpcode, secret: otpRecord.secret });

    //     if (!isValid) {
    //         throw new InvalidAccessCredentialsExceptions("Incorrect code");
    //     }
    //     await deleteUserOtpById(userId);

    //     const tokens = await generateTokens(user);
    //     return {
    //         user, tokens
    //     }
    // }
}
export const AuthService = new AuthServiceClass();




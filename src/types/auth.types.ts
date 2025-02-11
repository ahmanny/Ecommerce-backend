import { UserRoles } from "../models/user.model";

export interface LoginPayloadInterface {
    email: string
}
export interface OtpverifyPayloadInterface {
    email: string
    otpcode: string
}
export interface CompleteRegistrationPayloadInterface {
    idCard_number: string;
    phone: string;
    role: UserRoles;
    email: string;
    profilePicture?: string;
}

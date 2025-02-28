import { Types } from "mongoose"


export interface SendResetPasswordLinkEmailPayload {
    email: string,
    name: string
    id: Types.ObjectId
}
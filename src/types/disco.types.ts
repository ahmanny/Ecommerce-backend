import { Types } from "mongoose"

export interface NewDiscoPayloadinterface {
    discoName: string
    name: string
    email: string
    role: string
}

export interface SendVerificationEmailPayload {
    senderName: string
    discoName: string
    email: string,
    name: string
    id: Types.ObjectId
}
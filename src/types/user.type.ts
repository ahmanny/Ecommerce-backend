import { JwtPayload } from 'jsonwebtoken';

export type TUser = {
    name: string;
    email: string;
    phone: string
    role: string;
    _id: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;

};

export type TPayload = string | JwtPayload | null | undefined;


export interface AddNewUserPayloadInterface {
    email: string
    name: string
    role: string
}
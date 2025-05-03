import { HydratedDocument } from "mongoose";
import { IUser } from "../models/user.model";


export function sanitizeUser(user: HydratedDocument<IUser> | any) {
    // Convert to plain JS object if it's a Mongoose document
    const plainUser = typeof user.toObject === "function" ? user.toObject() : user;

    const {
        password,
        __v,
        ...safeUser
    } = plainUser;

    return safeUser;
}

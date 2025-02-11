import mongoose from "mongoose";
import { Date, Schema, model } from 'mongoose';

const OtpSchema = new Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User', unique: true, required: true },
    secret: { type: String, required: true },
    otpExpiration: { type: Date, required: true },
});





export const otpCode = model('otpCode', OtpSchema);


export const getUserOtpById = (id: mongoose.Types.ObjectId) => otpCode.findOne({ userId: id })
export const deleteUserOtpById = (id: mongoose.Types.ObjectId) => otpCode.deleteOne({ userId: id })
import mongoose, { Schema, Document, model } from 'mongoose';
import { User } from './user.model';


export interface IDisco {
    discoName: string;
    createdAt: Date;
}

const DiscoSchema = new Schema<IDisco>(
    {
        discoName: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export const Disco = model<IDisco>('Disco', DiscoSchema);



export const getDiscoByName = (discoName: String) => Disco.findOne({ discoName });
export const getDiscos = () => Disco.find();
export const getDiscoById = (id: String) => Disco.findById(id).lean();







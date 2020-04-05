import { Schema, Model, model } from 'mongoose';
import { Date } from '../collections';
import { Service } from './types';

const schema: Schema = new Schema({
    _id: { type: String, required: true },
    start: Date,
    end: Date,
    exceptions: [{ type: String, ref: 'ServiceException' }],
    monday: { type: Boolean, required: true },
    tuesday: { type: Boolean, required: true },
    wednesday: { type: Boolean, required: true },
    thursday: { type: Boolean, required: true },
    friday: { type: Boolean, required: true },
    saturday: { type: Boolean, required: true },
    sunday: { type: Boolean, required: true }
});

export const ServiceCollection: Model<Service> = model<Service>('Service', schema);
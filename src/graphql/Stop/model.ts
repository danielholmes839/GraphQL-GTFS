import { Schema, Model, model } from "mongoose";
import { Stop } from './types';

const schema: Schema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    routes: [{ type: String, ref: 'Route' }],
    stopRoutes: [{ type: String, ref: 'StopRoute' }]
});

export const StopCollection: Model<Stop> = model<Stop>('Stop', schema);
import { Schema, model } from "mongoose";

const urlSchema = new Schema(
    {
        originalUrl: {
            type: String,
            required: true
        },
        shortCode: {
            type: String,
            required: true,
            unique: true
        },
        clicks: {
            type: Number,
            default: 0
        },
        lastClickedAt: Date,
        expiresAt: Date
    },
    {
        timestamps: true
    }
);

export const Url = model("Url", urlSchema);
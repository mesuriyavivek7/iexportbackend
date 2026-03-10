import mongoose, {Document, Schema} from "mongoose";

export interface IAdmin extends Document {
    full_name: string,
    email: string,
    password: string
}

const adminSchema: Schema<IAdmin> = new mongoose.Schema({
    full_name: {
        type: String,
        required: true 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          "Please provide a valid email address",
        ],
    },
    password: {
        type: String,
        required: true,
        select: false
    }
})

export default mongoose.model<IAdmin>("Admin", adminSchema)
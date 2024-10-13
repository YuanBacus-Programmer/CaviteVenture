// models/User.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  birthday: Date;
  gender: 'male' | 'female' | 'other';
  location: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'superadmin';
  isVerified: boolean;
  verificationCode?: string;
  profilePicture?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    birthday: { type: Date, required: true },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    location: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ['user', 'admin', 'superadmin'],
      default: 'user',
    },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String, trim: true },
    profilePicture: { type: String, default: '', trim: true },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying by email
UserSchema.index({ email: 1 }, { unique: true });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

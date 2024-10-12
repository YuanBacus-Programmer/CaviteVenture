// models/User.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  birthday: Date;
  gender: string;
  location: string;
  email: string;
  password: string;
  role: string;
  isVerified: boolean;
  verificationCode?: string;
  profilePicture?: string;
}

const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthday: { type: Date, required: true },
  gender: { type: String, required: true },
  location: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  profilePicture: { type: String, default: '' },
}, { timestamps: true });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

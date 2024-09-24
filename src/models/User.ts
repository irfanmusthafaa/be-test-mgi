import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  id: number;
  nama: string;
  email: string;
  telepon: string;
  alamat: string;
}

const userSchema: Schema = new Schema({
  id: { type: Number, required: true },
  nama: { type: String, required: true },
  email: { type: String, required: true },
  telepon: { type: String, required: true },
  alamat: { type: String, required: true },
});

export default mongoose.model<IUser>('User', userSchema);

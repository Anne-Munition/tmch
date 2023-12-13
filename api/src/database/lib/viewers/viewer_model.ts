import { Schema, Types, model } from 'mongoose';

export interface ViewerDoc {
  _id: Types.ObjectId;
  twitchId: string;
  login: string;
  displayName: string;
  names: { login: string; displayName: string }[];
}

const schema = new Schema<ViewerDoc>({
  twitchId: { type: String, unique: true },
  login: String,
  displayName: String,
  names: Array,
});

export default model<ViewerDoc>('viewers', schema);

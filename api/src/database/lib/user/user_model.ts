import { Schema, Types, model } from 'mongoose';

export interface UserDoc {
  _id: Types.ObjectId;
  twitchId: string;
  profile: TwitchUser;
}

const schema = new Schema<UserDoc>({
  twitchId: { type: String, unique: true },
  profile: Object,
});

export default model<UserDoc>('users', schema);

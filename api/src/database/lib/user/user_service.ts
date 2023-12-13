import User, { UserDoc } from './user_model';

async function updateProfile(profile: TwitchUser): Promise<UserDoc> {
  return User.findOneAndUpdate({ twitchId: profile.id }, { profile }, { upsert: true, new: true });
}

async function getUser(id: string): Promise<UserDoc | null> {
  return User.findOne({ twitchId: id });
}

export default {
  updateProfile,
  getUser,
};

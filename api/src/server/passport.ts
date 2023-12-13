import passport from 'passport';
import { Strategy as TwitchStrategy } from 'passport-twitch-new';
import UserService from '../database/lib/user';

// const allowedIds = process.env.ALLOWED_IDS.split(',').map((x) => x.trim());

type Done = (error: unknown | null, user: TwitchUser | boolean) => void;

passport.use(
  new TwitchStrategy(
    {
      clientID: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
      callbackURL: process.env.TWITCH_CALLBACK_URL,
      scope: '',
    },
    async (accessToken: string, refreshToken: string, profile: TwitchUser, done: Done) => {
      // if (!allowedIds.includes(profile.id)) return done(null, false, { message: 'Not allowed.' });
      try {
        const user = await UserService.updateProfile(profile);
        done(null, user?.profile);
      } catch (e: unknown) {
        done(e, false);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  const user = await UserService.getUser(id);
  done(null, user?.profile);
});

/*async function isModerator(id: string): Promise<boolean> {
  if (id === process.env.BROADCASTER_ID) return true
  const moderators = await getModerators()
  const isMod = moderators.find((x) => id === x.user_id)
  return Boolean(isMod)
}*/

export default passport;

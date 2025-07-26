import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';

import { env } from './env';
import { AuthService } from '../services/auth.service';
import { User } from '../db/database.types';
import { OauthProfile } from '../types/auth.types';

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (error: unknown, user?: User | false) => void
    ) => {
      try {
        if (!profile.emails || !profile.emails[0]) {
          return done(
            new Error('Google profile did not return an email.'),
            false
          );
        }

        const userProfile: OauthProfile = {
          email: profile.emails[0].value,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
          avatarUrl: profile.photos?.[0]?.value,
        };

        const user = await AuthService.findOrCreateOauthUser(userProfile);

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;

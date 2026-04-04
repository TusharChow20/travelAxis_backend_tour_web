import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import varEnv from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";
import { Strategy as localStrategy } from "passport-local";
import bcryptjs from "bcryptjs";
passport.use(
  new GoogleStrategy(
    {
      clientID: varEnv.GOOGLE_CLIENT_ID as string,
      clientSecret: varEnv.GOOGLE_CLIENT_SECRET as string,
      callbackURL: varEnv.GOOGLE_CALLBACK as string,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(null, false, { message: "No email found" });
        }
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            email,

            name: profile.displayName,
            picture: profile.photos?.[0]?.value || "",
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider_id: profile.id,
                provider_name: "google",
              },
            ],
          });
        }
        return done(null, user);
      } catch (error) {
        console.log("Error in google credentials");
        return done(error);
      }
    },
  ),
);

passport.use(
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const userExists = await User.findOne({ email });
        if (!userExists) {
          return done(null, false, { message: "User does not exists" });
        }
        const userGoogleAuthenticated = userExists.auths.some(
          (providerObjects) => providerObjects.provider_name == "google",
        );
        if (userGoogleAuthenticated && !userExists.password) {
          return done(null, false, {
            message: "You are authenticated with google",
          });
        }
        const passwordMatched = await bcryptjs.compare(
          password as string,
          userExists.password as string,
        );
        if (!passwordMatched) {
          return done(null, false, { message: "Password  not matched" });
        }
        return done(null, userExists);
      } catch (error) {
        console.log(error);

        done(error);
      }
    },
  ),
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});

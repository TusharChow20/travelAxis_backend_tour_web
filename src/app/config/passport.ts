import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import varEnv from "./env";
import { User } from "../modules/user/user.model";
import { IsActive, Role } from "../modules/user/user.interface";
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

        if (user && user.isDeleted) {
          return done(null, false, {
            message: "Your account has been deleted",
          });
        }

        if (user && user.isActive !== IsActive.ACTIVE) {
          return done(null, false, {
            message: "Your account is not active",
          });
        }

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
        console.log("Error in google strategy:", error);
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
          return done(null, false, { message: "User does not exist" });
        }
        if (userExists.isDeleted) {
          return done(null, false, {
            message: "Your account has been deleted",
          });
        }

        if (userExists.isActive !== IsActive.ACTIVE) {
          return done(null, false, {
            message: "Your account is not active",
          });
        }
        if (!userExists.isVerified) {
          return done(null, false, { message: "EMAIL_NOT_VERIFIED" });
        }

        const userGoogleAuthenticated = userExists.auths.some(
          (providerObjects) => providerObjects.provider_name === "google",
        );

        if (userGoogleAuthenticated && !userExists.password) {
          return done(null, false, {
            message: "You are authenticated with google",
          });
        }

        const passwordMatched = await bcryptjs.compare(
          password,
          userExists.password as string,
        );

        if (!passwordMatched) {
          return done(null, false, { message: "Password not matched" });
        }

        return done(null, userExists);
      } catch (error) {
        console.log("Error in local strategy:", error);
        done(error);
      }
    },
  ),
);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);

    if (!user || user.isDeleted || user.isActive !== IsActive.ACTIVE) {
      return done(null, false);
    }

    done(null, user);
  } catch (error) {
    console.log("Error in deserializeUser:", error);
    done(error);
  }
});

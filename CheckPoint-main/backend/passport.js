const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/user");
const crypto = require("crypto");

const generateRandomString = () => {
  const suffix = crypto.randomBytes(3).toString("hex");
  return suffix;
};

async function generateUniqueUserName(baseName) {
  let userName = baseName.toLowerCase().replace(/\s+/g, "");
  let exists = await User.findOne({ userName });
  while (exists || userName.length < 4) {
    const suffix = generateRandomString();
    userName = `${baseName.toLowerCase()}${suffix}`;
    exists = await User.findOne({ userName });
  }
  return userName;
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://checkpoint-yjmv.onrender.com/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          const firstName = profile.displayName?.split(" ")[0] || "user";
          const uniqueUserName = await generateUniqueUserName(firstName);
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            userName: uniqueUserName,
          });
          await user.save();
        }

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id || user.id);
});


passport.deserializeUser(async (_id, done) => {
  try {
    const user = await User.findById(_id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;

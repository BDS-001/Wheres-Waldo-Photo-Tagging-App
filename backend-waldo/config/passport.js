const passport = require("passport");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    ignoreExpiration: false
}

passport.use(
    new JwtStrategy(options, async (jwtPayload, done) => {
        try {
            console.log(jwtPayload)
        } catch (error) {
            return done(error, false)
        }
    })
)

module.exports = passport
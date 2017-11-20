const passport = require( 'passport' )
const GoogleStrategy = require( 'passport-google-oauth20' )
const mongoose = require( 'mongoose' )
const User = mongoose.model( 'users' )
const keys = require( '../../config/keys' )

const GOOGLE_STRATEGY_OPTIONS = {
  clientID: keys.googleClientID,
  clientSecret: keys.googleClientSecret,
  callbackURL: '/api/google/callback',
  proxy: true,
}

const GOOGLE_STRATEGY_CALLBACK =
  async ( accessToken, refreshToken, profile, done ) => {
    const error = null
    try {
      let existingUser = await User.findOne( { googleId: profile.id } )

      if ( existingUser ) {
        done( error, existingUser )
      } else {
        let savedUser = await new User( { googleId: profile.id } ).save()
        done( error, savedUser )
      }
    } catch ( err ) {
      done( err, existingUser )
    }

  }

const passportGoogle = () => {
  passport.use(
    new GoogleStrategy(
      GOOGLE_STRATEGY_OPTIONS,
      GOOGLE_STRATEGY_CALLBACK
    )
  )
}

export default passportGoogle

import mongoose from 'mongoose'
import passportGoogleToken from './strategies/passportGoogleToken'
import passportLinkedin from './strategies/passportLinkedin'
import jwtStrategy from './strategies/jwtStrategy'
import localStrategy from './strategies/localStrategy'

const User = mongoose.model( 'users' )

const initPassport = function ( app, passport ) {

  passport.serializeUser( ( user, done ) => {
    const error = null
    // This is the mongo identifier, not the Google id
    done( error, user.id )
  } )

  passport.deserializeUser( async ( id, done ) => {
    // Again, this is the mongo ID
    const error = null
    let user = await User.findById( id )
    done( error, user )
  } )

  // passportGoogle()
  passportLinkedin()
  passportGoogleToken()
  localStrategy()
  jwtStrategy()
}

module.exports = initPassport

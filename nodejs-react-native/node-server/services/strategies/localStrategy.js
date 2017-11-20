import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import jwt from 'jsonwebtoken'
import User from '../../models/User'
import { jwtOptions } from '../../config/keys'

const PassportStrategy = () => {
  // Use local strategy
  passport.use( new LocalStrategy( {
    usernameField: 'username',
    passwordField: 'password',
  },
  ( username, password, done ) => {
    User.findOne( { email: username.toLowerCase() }, ( err, user ) => {
      if ( err ) {
        return done( err )
      }
      if ( !user || !user.authenticate( password ) ) {
        return done( null, false, {
          message: `Invalid username or password (${ ( new Date() ).toLocaleTimeString() })`,
        } )
      }
      const jwtPayload = { id: user._id, _id: user._id, username: user.email }
      const token = jwt.sign( jwtPayload, jwtOptions.secretOrKey )
      return done( null, user, token )
    } )
  } ) )
}

export default PassportStrategy

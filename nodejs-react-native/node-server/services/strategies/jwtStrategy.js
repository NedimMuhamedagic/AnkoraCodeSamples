import passport from 'passport'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'

import User from '../../models/User'
import { jwtOptions } from '../../config/keys'
/**
 * Module dependencies
 */

const jwtStratOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtOptions.secretOrKey,
}

const PassportStrategy = () => {
  passport.use( new JWTStrategy( jwtStratOptions,
    ( jwtPayload, done ) => {
      User.findOne( {
        _id: jwtPayload.id,
      }, ( err, user ) => {
        if ( err ) {
          console.error( 'Error authenticating over JWT: ', err )
          return done( err )
        }
        if ( !user ) {
          return done( null, false, {
            message: `Invalid user credentials (${ ( new Date() ).toLocaleTimeString() })`,
          } )
        }
        return done( null, user )
      } )
    } ) )
}

export default PassportStrategy

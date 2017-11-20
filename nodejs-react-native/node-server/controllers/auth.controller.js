import passport from 'passport'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { jwtOptions } from '../config/keys'

export function googleCallback( req, res ) {
  res.redirect( req.headers.referer )
}

export function linkedinCallback( req, res ) {
  if ( req.session.redirect_uri  ) {
    res.redirect( req.session.redirect_uri )
  } else {
    res.redirect( '/' )
  }
}

export function googleTokenLogin( req, res ) {
  passport.authenticate( 'google-plus-token', function( error, user, info ) {
    if ( error ) return res.status( 403 ).send( { error } )
    if ( info ) return res.send( { info } )
    return res.send( user )
  } )( req, res )
}

export function logout( req, res ) {
  req.logout()
  res.status( 200 )
}

export function login( req, res, next ) {
  passport.authenticate( 'local', ( err, user, info ) => {
    if ( err || !user ) {
      res.clearCookie( 'sessionId' ).status( 422 ).send( info )
    } else {
      // Remove sensitive data before login
      const userInfo = JSON.parse( JSON.stringify( user ) )
      delete userInfo.password
      delete userInfo.salt
      delete userInfo.provider
      delete userInfo.__v
      userInfo.token = info

      req.logIn( user, error => {
        if ( error ) {
          res.status( 400 ).send( error )
        } else {
          res.json( userInfo )
        }
      } )
    }
  } )( req, res, next )
}

export async function signup( req, res ) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles

  // Init user and add missing fields
  const user = new User( req.body )
  user.provider = 'local'

  // Then save the user
  user.save( ( err ) => {
    if ( err ) {
      return res.status( 422 ).send( { message: err } )
    }

    // Remove sensitive data before login
    delete user.password
    delete user.salt

    return req.login( user, error => {
      if ( error ) {
        res.status( 400 ).send( error )
      } else {
        const jwtPayload = { id: user._id, _id: user._id, username: user.email }
        const token = jwt.sign( jwtPayload, jwtOptions.secretOrKey )
        let userWithToken = Object.assign( {}, user._doc, { token } )
        res.json( userWithToken )
      }
    } )
  } )
}

export function getUserData( req, res ) {
  if ( req.user ) {
    return res.send( req.user )
  }
  return res.send( undefined )
}

export function currentUser( req, res ) {
  if ( req.user ) {
    const userData = _.pick( req.user,
      'id',
      'firstName',
      'lastName',
      'email',
      'company',
      'mobile',
      'settings' )
    res.send( userData )
  } else {
    res.send( undefined )
  }
}

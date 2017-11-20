import { Router } from 'express'
import * as AuthController from '../controllers/auth.controller'
import passport from 'passport'

const router = new Router()

router.route( '/test' )
  .get( AuthController.testFunction )

router.route( '/google' )
  .get(
    passport.authenticate( 'google', {
      scope: [ 'profile', 'email' ]
    } )
  )

router.route( '/google/callback' )
  .get(
    passport.authenticate( 'google' ),
    AuthController.googleCallback
  )

router.route( '/linkedin' )
  .get(
    passport.authenticate( 'linkedin', {
      scope: [ 'r_basicprofile', 'r_emailaddress' ]
    } )
  )

router.route( '/linkedin/callback' )
  .get(
    passport.authenticate( 'linkedin' ),
    AuthController.linkedinCallback
  )

router.route( '/google-token' )
  .get( AuthController.googleTokenLogin )

router.route( '/logout' )
  .get( AuthController.logout )

router.route( '/login' )
  .post( AuthController.login )

router.route( '/signup' )
  .post( AuthController.signup )

router.route( '/current_user' )
  .get( AuthController.currentUser )

router.route( '/user' )
  .get(
    passport.authenticate( 'jwt', { session: false } ),
    AuthController.getUserData
  )

export default router

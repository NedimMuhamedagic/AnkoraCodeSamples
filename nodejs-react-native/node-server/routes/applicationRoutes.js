import { Router } from 'express'
import * as ApplicationController from '../controllers/application.controller'
import passport from 'passport'

const router = new Router()

router.route( '/getUploadSignedUrl' )
  .post(
    passport.authenticate( 'jwt', { session: false } ),
    ApplicationController.getUploadSignedUrl
  )

export default router

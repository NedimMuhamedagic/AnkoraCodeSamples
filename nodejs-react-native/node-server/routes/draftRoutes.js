import { Router } from 'express'
import passport from 'passport'
import * as DraftController from '../controllers/draft.controller'

const router = new Router()

router.route( '/draft' )
  .get(
    passport.authenticate( 'jwt', { session: false } ),
    DraftController.getAllDraftsForUser
  )
  .post(
    passport.authenticate( 'jwt', { session: false } ),
    DraftController.createDraft
  )

router.route( '/draft/:draftId' )
  .get(
    passport.authenticate( 'jwt', { session: false } ),
    DraftController.getDraftById
  )
  .put(
    passport.authenticate( 'jwt', { session: false } ),
    DraftController.updateDraftById
  )
  .delete(
    passport.authenticate( 'jwt', { session: false } ),
    DraftController.deleteDraftById
  )

router.route( '/draft/:draftId/send' )
  .post(
    passport.authenticate( 'jwt', { session: false } ),
    DraftController.sendEmail
  )

export default router

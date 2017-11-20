import nodemailer from 'nodemailer'
import _ from 'lodash'
import Draft, { createNewDraft } from '../models/Draft'
import { updateModelById } from './controllerHelpers'
import Profile from '../models/Profile'
import { parseTemplate, replaceTemplates } from '../helpers/draft.helper'

import {
  deleteModelById,
  getModelById,
  getAllModelsForUser,
  generateErrorResponse,
} from './controllerHelpers'

async function populateConnection( draft ) {
  await draft.populate( {
    path: 'connection',
    select: 'firstName lastName _id email',
  } ).execPopulate()
}

export async function createDraft( req, res ) {
  try {
    const draft = await createNewDraft( req.body, req.user._id )
    await populateConnection( draft )
    return res.send( draft )
  } catch ( error ) {
    return generateErrorResponse( error, res )
  }
}

export async function getAllDraftsForUser( req, res ) {
  try {
    const userProfile = await getModelById( req.user.settings.currentProfile, req.user._id, Profile, { userFieldName: 'userUid' } )
    const options = {
      findFilter: '_id title body connection template status sentAt createdAt',
      populateFilter: [
        {
          path: 'connection',
          populate: [
            { path: 'place' },
            { path: 'event' },
          ],
        }, {
          path: 'template',
          select: 'name',
        }
      ]
    }
    const drafts = await getAllModelsForUser( req.user._id, Draft, options )
    const errors = []

    drafts.forEach( draft => {
      if ( !draft.modified ) {
        let parsed
        try {
          parsed = replaceTemplates( draft, userProfile )
          draft._doc.title = parsed.replacedTitle
          draft._doc.body = parsed.replacedBody
        } catch ( replaceError ) {
          errors.push( replaceError )
        }
      }
    } )
    console.warn( 'Template replace errors:', errors.length )
    return res.send( drafts )
  } catch ( error ) {
    return generateErrorResponse( error, res )
  }
}

export async function updateDraftById( req, res ) {
  const options = {
    populateFilter: [
      {
        path: 'connection',
        select: '-_id -__v -connectionRequestSent'
      }, {
        path: 'template',
        select: 'name',
      }
    ]
  }
  const newBody = _.pick( req.body, [
    'cc',
    'bcc',
    'title',
    'body',
    'template',
    'connection',
  ] )
  newBody.modified = true
  try {
    const draft = await updateModelById( req.params.draftId, Draft, newBody, options )
    return res.send( draft )
  } catch ( error ) {
    return generateErrorResponse( error, res )
  }
}

export async function getDraftById( req, res ) {
  try {
    const userProfile = await getModelById( req.user.settings.currentProfile, req.user._id, Profile, { userFieldName: 'userUid' } )
    const options = {
      populateFilter: [
        {
          path: 'connection',
          select: '-_id -__v -connectionRequestSent',
          populate: [
            { path: 'place' },
            { path: 'event' },
          ],
        }, {
          path: 'template',
          select: 'name',
        }
      ]
    }
    let draft = await getModelById( req.params.draftId, req.user._id, Draft, options )

    const parsed = parseTemplate( draft, userProfile )
    if ( !draft.modified ) {
      draft._doc.body = parsed.replacedBody
      draft._doc.constructedBody = parsed.constructedBody
      draft._doc.title = parsed.replacedTitle
      draft._doc.constructedTitle = parsed.constructedTitle
    }
    return res.send( draft )
  } catch ( error ) {
    return generateErrorResponse( error, res )
  }
}

export async function deleteDraftById( req, res ) {
  try {
    await deleteModelById( req.params.draftId, Draft )
    return res.send( { message: 'Successfully removed draft!' } )
  } catch ( error ) {
    return generateErrorResponse( error, res )
  }
}

export async function sendEmail( req, res ) {

  const currentUser = req.user
  const currentProfile = await Profile.findOne( { _id: currentUser.settings.currentProfile } )

  const currentDraft = await Draft.findOne( { _id: req.params.draftId } ).populate( 'connection' )

  const newBody = { ...req.body }

  const requestData = _.pick( newBody, [ 'cc', 'bcc', 'to', 'body', 'title' ] )

  const draftData = {
    ...currentDraft._doc,
    ...requestData,
  }

  const authData = {
    type: 'OAuth2',
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }

  const transporter = nodemailer.createTransport( {
    service: 'Gmail',
    auth: authData,
  } )

  const mailOptions = {
    from: `"${ currentProfile.firstName } ${ currentProfile.lastName }" <${ newBody.googleData.user.email }>`, // sender address
    to: draftData.connection.email,
    subject: draftData.title,
    text: draftData.body,
    cc: draftData.cc,
    bcc: draftData.bcc,
    auth: {
      user: newBody.googleData.user.email,
      accessToken: newBody.googleData.accessToken,
      refreshToken: newBody.googleData.refreshToken,
    }
  }

  try {
    const email = await transporter.sendMail( mailOptions )
    currentDraft.status = 'sent'
    currentDraft.sentAt = Date.now()
    await currentDraft.save()
    return res.send( email )
  } catch ( error ) {
    return generateErrorResponse( error, res )
  }
}

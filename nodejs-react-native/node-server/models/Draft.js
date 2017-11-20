import _ from 'lodash'

import Template from '../models/Template'

const mongoose = require( 'mongoose' )
const { Schema } = mongoose

const draftsSchema = new Schema( {
  cc: {
    type: String,
  },
  bcc: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.ObjectId,
    ref: 'users'
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  template: {
    type: Schema.ObjectId,
    ref: 'templates',
  },
  connection: {
    type: Schema.ObjectId,
    ref: 'connections'
  },
  sendable: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: 'draft',
  },
  sentAt: {
    type: Date
  },
  modified: {
    type: Boolean,
    default: false,
  }
} )

const Draft = mongoose.model( 'drafts', draftsSchema )

const SAFE_PARAMS = [ 'cc', 'bcc', 'title', 'body' ]

export async function createNewDraft( params, userId, timeNow = Date.now() ) {
  if ( _.isUndefined( params.templateId ) )
    throw { status: 403, message: 'You must provide the templateId when creating a draft' }

  if ( _.isUndefined( params.connectionId ) )
    throw { status: 403, message: 'You must provide the connectionId when creating a draft' }

  const baseFields = {
    user: userId,
    template: params.templateId,
    connection: params.connectionId,
    createdAt: timeNow
  }

  let template
  try {
    template = await Template.findOne( { _id: params.templateId } )
  } catch ( error ) {
    console.warn( 'Error finding template', error )
    throw { createDraftError: error }
  }

  const templateFields = _.pick( template, SAFE_PARAMS )
  const additionalFields = _.pick( params, SAFE_PARAMS )
  const constructedDraft = { ...baseFields, ...templateFields, ...additionalFields }

  return await new Draft( constructedDraft ).save()
}

export default Draft

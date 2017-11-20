export async function updateModelById( id, ModelClass, newParams, userProvidedOptions ) {
  const options = {
    findFilter: null,
    populateFilter: null,
    userFieldName: 'user',
    ...userProvidedOptions
  }
  let model, modelPromise
  try {
    modelPromise = ModelClass.findOneAndUpdate( { _id: id }, newParams, { new: true } )
    if ( modelPromise && options.populateFilter ) {
      modelPromise.populate( options.populateFilter )
    }
    model = await modelPromise
  } catch ( error ) {
    console.error( `Error: ${ ModelClass.modelName } - error updating instance:`, error )
    throw { status: 500, message: error }
  }

  if ( model ) {
    return model
  } else {
    throw { status: 404, message: `Error: ${ ModelClass.modelName } - cannot update unknown ID: ${ id }` }
  }
}

export async function getAllModelsForUser( userId, ModelClass, userProvidedOptions = {} ) {
  const options = {
    findFilter: null,
    populateFilter: null,
    userFieldName: 'user',
    ...userProvidedOptions
  }

  try {
    const models = ModelClass.find( { [ options.userFieldName ]: userId }, options.findFilter )
    if ( models && options.populateFilter ) {
      models.populate( options.populateFilter )
    }
    return await models
  } catch ( error ) {
    console.error( `Error: ${ ModelClass.modelName } - error getting all instances for user:`, error )
    throw { status: 500, message: error }
  }
}

export async function getModelById( id, userId, ModelClass, userProvidedOptions = {} ) {
  const options = {
    findFilter: null,
    populateFilter: null,
    userFieldName: 'user',
    ...userProvidedOptions
  }

  let model, modelPromise
  try {
    modelPromise = ModelClass.findOne( { _id: id, [ options.userFieldName ]: userId }, options.findFilter )
    if ( modelPromise && options.populateFilter ) {
      modelPromise.populate( options.populateFilter )
    }
    model = await modelPromise
  } catch ( error ) {
    console.error( `Error: ${ ModelClass.modelName } - error getting instance by ID:`, error )
    throw { status: 500, message: error }
  }

  if ( model ) {
    return model
  } else {
    throw { status: 404, message: `Error: ${ ModelClass.modelName } - can't get unknown ID: ${ id }` }
  }
}

export async function deleteModelById( id, ModelClass ) {
  let removedModel
  try {
    removedModel = await ModelClass.findOneAndRemove( { _id: id } )
  } catch ( error ) {
    console.error( `Error: ${ ModelClass.modelName } - error deleting instance by id: ${ id }`, error )
    throw { status: 500, message: error }
  }

  if( !removedModel ) {
    throw { status: 404, message: `Error: ${ ModelClass.modelName } - unknown ID: ${ id }` }
  }
}

export function generateErrorResponse( error, res ) {
  let status, message

  if ( error.status ) {
    status = error.status
    message = error.message
  } else {
    status = 500
    message = error
  }

  if ( status >= 500 ) console.error( message )
  if ( status < 500 ) console.info( message )
  return res.status( status ).send( { error: message } )
}

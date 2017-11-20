import _ from 'lodash'

import {
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER_START,
} from './types'

import { appAuthToken } from '../lib/AppAuthToken'
import BackendFactory from '../lib/BackendFactory'
import { getConnections } from './ConnectionActions'
import { fetchUserSettings } from './SettingsActions'

export const initApp = navigator => async dispatch => {
  try {
    const token = await appAuthToken.getSessionToken()
    if( _.isNull( token ) || _.isUndefined( token.token ) ) {
      navigator.navigate( 'splash' )
    } else {
      dispatch( { type: LOGIN_USER_SUCCESS, payload: token } )
      dispatch( fetchUserSettings() )
      navigator.navigate( 'main' )
    }
  } catch ( error ) {
      dispatch( { type: LOGIN_USER_FAILURE, payload: error.message } )
  }
}

export const logout = navigator => async () => {
  try {
    await appAuthToken.deleteSessionToken()
    navigator.navigate( 'splash' )
  } catch ( error ) {
    console.error( 'Error: Unable to log out', error )
  }
}

export const saveSessionToken = ( token ) => {
  return appAuthToken.storeSessionToken( token )
}

export const loginWithGoogle = ( navigation ) => async dispatch => {
  dispatch( { type: LOGIN_USER_START } )

  const user = await BackendFactory().loginWithGoogle()

  if( _.isUndefined( user.cancelled ) ) {
    saveSessionToken( user )
    dispatch( getConnections() )
    dispatch( { type: LOGIN_USER_SUCCESS, payload: user } )
    dispatch( fetchUserSettings() )
    navigation.navigate( 'connectionList' )
  } else {
    dispatch( { type: LOGIN_USER_FAIL } )
  }
}

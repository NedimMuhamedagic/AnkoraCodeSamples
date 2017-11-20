import {
  FETCH_USER_SETTINGS_SUCCESS,
  FETCH_USER_SETTINGS_FAILURE,
  FETCH_USER_SETTINGS_REQUEST,
  LOGIN_USER_SUCCESS,
} from './types'

import { appAuthToken } from '../lib/AppAuthToken'
import BackendFactory from '../lib/BackendFactory'
import { saveSessionToken } from './AuthActions'

export const fetchUserSettings = () => async dispatch => {
  dispatch( { type: FETCH_USER_SETTINGS_REQUEST } )
  const token = await appAuthToken.getSessionToken()
  try {
    const user = await BackendFactory( token ).loadUserData()
    saveSessionToken( user )
    dispatch( { type: FETCH_USER_SETTINGS_SUCCESS, payload: user.settings } )
    dispatch( { type: LOGIN_USER_SUCCESS, payload: user } )
  } catch ( error ) {
    dispatch( { type: FETCH_USER_SETTINGS_FAILURE, payload: error } )
  }
}

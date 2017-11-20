import {
  FETCH_USER_SETTINGS_SUCCESS,
  FETCH_USER_SETTINGS_FAILURE,
  FETCH_USER_SETTINGS_REQUEST,
  LOGIN_USER_SUCCESS,
} from '../actions/types'

const INITIAL_STATE = {
  userSettings: null,
  fetchingUserData: false,
  hasError: false,
  error: null,
}

export default ( state = INITIAL_STATE, action ) => {
  switch ( action.type ) {

    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        fetchingUserData: false,
        userSettings: action.payload.settings,
      }

    case FETCH_USER_SETTINGS_REQUEST:
      return {
        ...state,
        fetchingUserData: true
      }

    case FETCH_USER_SETTINGS_SUCCESS:
      return {
        ...state,
        fetchingUserData: false,
        userSettings: action.payload,
      }

    case FETCH_USER_SETTINGS_FAILURE:
      return {
        ...state,
        hasError: true,
        fetchingUserData: false,
        error: action.payload,
      }

    default:
      return state
  }
}

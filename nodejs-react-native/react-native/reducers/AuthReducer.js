import {
  LOGIN_USER_FAIL,
  LOGIN_USER_START,
  LOGIN_USER_SUCCESS,
} from '../actions/types'

export const INITIAL_STATE = {
  loading: false,
  error: '',
  user: null,
}

export default ( state = INITIAL_STATE, action ) => {
  switch ( action.type ) {

    case LOGIN_USER_START:
      return { ...state, loading: true, error: '' }

    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        user: action.payload,
      }

    case LOGIN_USER_FAIL:
      return { ...state, error: 'Authentication failed', loading: false }

    default:
      return state
  }
}

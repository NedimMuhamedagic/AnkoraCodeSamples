import { filterModelsByDays } from './helpers'

import {
  GET_DRAFTS_REQUEST,
  GET_DRAFTS_SUCCESS,
  GET_DRAFTS_FAILURE
} from '../actions/types'

const INITIAL_STATE = {
  loading: false,
  hasError: false,
  error: null,
  groupedDrafts: [],
  draftList: [],
}

export default ( state = INITIAL_STATE, action ) => {
  switch ( action.type ) {

    case GET_DRAFTS_REQUEST:
      return {
        ...state,
        loading: true
      }

    case GET_DRAFTS_SUCCESS:
      return {
        ...state,
        loading: false,
        groupedDrafts: filterModelsByDays( action.payload.draftList ),
        draftList: action.payload.draftList,
      }

    case GET_DRAFTS_FAILURE:
      return {
        ...state,
        hasError: true,
        loading: false,
        error: action.payload,
      }

    default:
      return state
  }
}

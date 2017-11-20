import {
  PERMISSION_FOR_LOCATION_RETRIEVED,
  PERMISSION_FOR_CAMERA_RETRIEVED
} from '../actions/types'

const INITIAL_STATE = {
  locationPermission: null,
  cameraPermission: null,
}

export default ( state = INITIAL_STATE, action ) => {
  switch ( action.type ) {
    case PERMISSION_FOR_LOCATION_RETRIEVED:
      return { ...state, locationPermission: action.payload }
    case PERMISSION_FOR_CAMERA_RETRIEVED:
      return { ...state, cameraPermission: action.payload }
    default:
      return state
  }
}

export const getPermissionForLocation = ( state ) =>
  state.locationPermission

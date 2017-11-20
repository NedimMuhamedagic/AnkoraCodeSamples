import {
  LOCATION_RETRIEVED,
  LOCATION_RETRIEVAL_ERROR
} from './types'

export const getLatLong = () => async dispatch => {
  navigator.geolocation.getCurrentPosition(
    ( position ) => {
      dispatch( {
        type: LOCATION_RETRIEVED,
        payload: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
      } )
    },
    ( error ) => {
      dispatch( {
        type: LOCATION_RETRIEVAL_ERROR,
        payload: { error: error.message }
      } )
    },
    {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000
    },
  )
}

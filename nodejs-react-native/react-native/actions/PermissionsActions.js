import { Permissions } from 'expo'

import {
  PERMISSION_FOR_LOCATION_RETRIEVED,
  PERMISSION_FOR_CAMERA_RETRIEVED,
} from './types'

export const checkPermissionForLocation = () => async ( dispatch ) => {
  try {
    let { status } = await Permissions.getAsync( Permissions.LOCATION )
    dispatch( { type: PERMISSION_FOR_LOCATION_RETRIEVED, payload: status } )
  } catch ( err ) {
    console.info( 'Issue retrieving location permission', err )
  }
}

export const askPermissionForLocation = () => async ( dispatch ) => {
  try {
    let { status } = await Permissions.askAsync( Permissions.LOCATION )
    dispatch( { type: PERMISSION_FOR_LOCATION_RETRIEVED, payload: status } )
  } catch ( err ) {
    console.info( 'Issue asking for location permission', err )
  }
}

export const checkPermissionForCamera = () => async ( dispatch ) => {
  try {
    let { status } = await Permissions.getAsync( Permissions.CAMERA )
    dispatch( { type: PERMISSION_FOR_CAMERA_RETRIEVED, payload: status } )
  } catch ( err ) {
    console.info( 'Issue retrieving camera permission', err )
  }
}

export const askPermissionForCamera = () => async ( dispatch ) => {
  try {
    let { status } = await Permissions.askAsync( Permissions.CAMERA )
    dispatch( { type: PERMISSION_FOR_CAMERA_RETRIEVED, payload: status } )
  } catch ( err ) {
    console.info( 'Issue asking for camera permission', err )
  }
}

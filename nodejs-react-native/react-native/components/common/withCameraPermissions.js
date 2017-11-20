import React, { Component } from 'react'
import { AppState } from 'react-native'
import hoistStatics from 'hoist-non-react-statics'
import NoCameraPermissionScreen from './NoCameraPermissionScreen'

const withCameraPermissions = () => BaseComponent => {
  class WithCameraPermissions extends Component {

    state = {
      appState: AppState.currentState,
    }

    handleAppStateChange = ( nextAppState ) => {
      if ( this.state.appState.match( /inactive|background/ ) && nextAppState === 'active' ) {
        this.props.checkPermissionForCamera()
      }
      this.setState( { appState: nextAppState } )
    }

    componentDidMount() {
      AppState.addEventListener( 'change', this.handleAppStateChange )
      this.props.checkPermissionForCamera()
    }

    componentWillUnmount() {
      AppState.removeEventListener( 'change', this.handleAppStateChange )
    }

    render() {
      const cameraPermissionEnabled = this.props.cameraPermission &&
        this.props.cameraPermission === 'granted'

      if ( !cameraPermissionEnabled ) {
        return <NoCameraPermissionScreen cameraPermission={ this.props.cameraPermission } />
      }

      return <BaseComponent { ...this.props } />
    }
  }

  return hoistStatics( WithCameraPermissions, BaseComponent )
}

export { withCameraPermissions }

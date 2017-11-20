import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { CancelButton } from '../components/common'
import { Button } from 'react-native-elements'

import AddConnectionDetailsForm from '../components/AddConnectionDetailsForm'

class AddConnectionDetailsScreen extends Component {

  static navigationOptions = ( { navigation } ) => {
    const { params = {} } = navigation.state

    let options = {
      title: params.editing ? "Edit connection" : "Connection Details",
      headerRight: (
        <Button
          backgroundColor="rgba(0,0,0,0)"
          color="rgba(0,122,255,1)"
          disabled={ params.connectButtonDisabled }
          onPress={ () => params.connectButtonPressed() }
          title={ params.editing ? "Save" : "Connect" }
        />
      ),
    }

    if ( params.editing ) {
      const optionsWhenEditing = {
        headerLeft: (
          <CancelButton
            backgroundColor="rgba(0,0,0,0)"
            color="rgba(0,122,255,1)"
            navigation={ navigation }
          />
        ),
      }
      options = { ...options, ...optionsWhenEditing }
    }

    return options
  }

  componentWillReceiveProps( nextProps ) {
    if ( nextProps.loading !== this.props.loading ) {
      this.props.navigation.setParams( { connectButtonDisabled: nextProps.loading } )
    }
  }

  render() {
    return <AddConnectionDetailsForm { ...this.props } />
  }
}

const mapStateToProps = ( { addConnectionScreenState, addConnectionDetailsForm } ) => {
  return { entryMethod: addConnectionScreenState.entryMethod, loading: addConnectionDetailsForm.loading }
}

const enhance = compose(
  connect( mapStateToProps ),
)

export default enhance( AddConnectionDetailsScreen )

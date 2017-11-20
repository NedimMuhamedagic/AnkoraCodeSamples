import React, { Component } from 'react'
import { List, ListItem } from 'react-native-elements'
import { View } from 'react-native'
import { connect } from 'react-redux'
import * as actions from '../actions'
import DevelopmentModeListItem from '../components/common/DevelopmentModeListItem'

class SettingsScreen extends Component {

  static navigationOptions = () => ( {
    title: 'Settings',
  } )

  componentWillMount() {
    this.props.fetchUserSettings()
  }

  render() {
    const settingsList = [
      {
        key: 1,
        leftIcon: { name: "v-card", type: "entypo" },
        title: "Profile",
        onPress: () => { this.props.navigation.navigate( 'profile' ) }
      },
      {
        key: 2,
        leftIcon: { name: "email", type: "material-icons" },
        title: "Email Templates",
        onPress: () => { this.props.navigation.navigate( 'templateSettings' ) }
      },
      {
        key: 3,
        leftIcon: { name: "notifications", type: "material-icons" },
        title: "Notifications",
      },
    ]

    const { developmentMode, fetchingUserData, fetchUserSettings } = this.props

    return (
      <View>
        <List>
          {
            settingsList.map( ( item ) => (
              <ListItem
                key={ item.key }
                leftIcon={ item.leftIcon }
                onPress={ item.onPress }
                title={ item.title }
              />
            ) )
          }
        </List>
        <List>
          <DevelopmentModeListItem
            fetchUserSettings={ fetchUserSettings }
            fetchingUserData={ fetchingUserData }
            shouldDisplay={ developmentMode }
            title="Fetch user settings"
          />
          <ListItem
            hideChevron={ true }
            onPress={ () => this.props.logout() }
            title="Logout"
            titleContainerStyle={ { alignSelf: 'center' } }
            titleStyle={ { color: 'red' } }
          />
        </List>
      </View>
    )
  }
}

function mapDispatchToProps( dispatch, ownProps ) {
  return {
    logout: () => dispatch( actions.logout( ownProps.navigation ) ),
    fetchUserSettings: () => dispatch( actions.fetchUserSettings() ),
  }
}

function mapStateToProps( { settingsState: { fetchingUserData, userSettings } } ) {
  return {
    fetchingUserData,
    ...userSettings,
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( SettingsScreen )

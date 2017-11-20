import React from 'react'
import {
  ActivityIndicator
} from 'react-native'
import { branch, renderComponent } from 'recompose'
import { ListItem } from 'react-native-elements'

const DevelopmentModeListItemBase = ( { fetchUserSettings, fetchingUserData, title } ) => (
  <ListItem
    hideChevron={ true }
    onPress={ fetchUserSettings }
    title={ fetchingUserData ? <ActivityIndicator animating /> : title }
    titleContainerStyle={ { alignSelf: 'center' } }
    titleStyle={ { color: 'blue' } }
  />
)

/**
 * Props:
 * - shouldDisplay
 * - title
 */
const DevelopmentModeListItem = branch(
  ( { shouldDisplay } ) => !shouldDisplay,
  renderComponent( () => null )
)( DevelopmentModeListItemBase )

export default DevelopmentModeListItem

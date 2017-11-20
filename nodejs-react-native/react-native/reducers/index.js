import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import AddConnectionDetailsFormReducer from './AddConnectionDetailsFormReducer'
import AuthReducer from './AuthReducer'

import AddConnectionScreenReducer from './AddConnectionScreenReducer'
import AddConnectionViaEmailFormReducer from './AddConnectionViaEmailFormReducer'
import ProfileReducer from './ProfileReducer'
import SettingsReducer from './SettingsReducer'

export default combineReducers( {
  addConnectionDetailsForm: AddConnectionDetailsFormReducer,
  auth: AuthReducer,
  form: formReducer,
  profileState: ProfileReducer,
  settingsState: SettingsReducer,
} )

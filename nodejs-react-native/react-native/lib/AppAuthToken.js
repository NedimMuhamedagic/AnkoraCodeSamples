import store from 'react-native-simple-store'
import config from './config'
import { identifyOnSegment } from './segment'

export class AppAuthToken {
  /**
   * ## AppAuthToken
   *
   * set the key from the config
   */
  constructor() {
    this.SESSION_TOKEN_KEY = config.SESSION_TOKEN_KEY
  }

  /**
   * ### storeSessionToken
   * Store the session key
   */
  storeSessionToken( sessionToken ) {
    return store.save( this.SESSION_TOKEN_KEY, sessionToken )
  }
  /**
   * ### getSessionToken
   * @param {Object} sessionToken the currentUser object
   */
  async getSessionToken() {
    const user = await store.get( this.SESSION_TOKEN_KEY )
    identifyOnSegment( user )
    return user
  }
  /**
   * ### deleteSessionToken
   * Deleted during log out
   */
  deleteSessionToken() {
    return store.delete( this.SESSION_TOKEN_KEY )
  }
}
// The singleton variable
export const appAuthToken = new AppAuthToken()

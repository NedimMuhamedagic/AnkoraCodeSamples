import _ from 'lodash'
import config from './config'
import { appAuthToken } from './AppAuthToken'
import axios from 'axios'
import Expo from 'expo'

class AppBackend {
  initialize( token ) {
    this.API_BASE_URL = config.API.apiUrl
    if ( !_.isNull( token ) && _.isUndefined( token ) ) {
      throw new Error( 'TokenMissing' )
    }

    this._sessionToken = _.isNull( token ) ? null : token.token
    this._developmentMode = _.isNil( this._settings ) ? null : this._settings.developmentMode
    this.API_BASE_URL = config.API.apiUrl
  }

  async loginWithGoogle() {
    let response
    try {
      let result
      try {
        result = await Expo.Google.logInAsync( {
          behavior: 'web',
          androidClientId: config.GOOGLE.androidClientId,
          androidStandaloneAppClientId: config.GOOGLE.androidClientId,
          iosClientId: config.GOOGLE.iosClientId,
          iosStandaloneAppClientId: config.GOOGLE.iosStandaloneClientId,
          scopes: config.GOOGLE.authScopes,
        } )
      } catch ( error ) {
        return { cancelled: true }
      }

      if ( result.type !== 'success' ) {
        return { cancelled: true }
      }

      const constructedUrl = `${ this.API_BASE_URL }/auth/google-token?access_token=${ result.accessToken }&refresh_token=${ result.refreshToken }`

      response = await axios.get( constructedUrl )

      const returnValue = {
        ...response.data,
        googleData: result
      }
      return returnValue

    } catch( error ) {
      throw new Error( error )
    }
  }

  async getConnections() {
    return await this._fetch( 'GET', '/connection' )
  }

  async _uploadImage( imageData, firstName ) {
    const filename = `${ firstName }${ Date.now() }`
    try {
      const signedRequest = await this.getSignedData( filename )
      const response = signedRequest.success
      const image = {
        uri: imageData.uri,
        type: 'image/jpeg',
        name: filename,
      }

      const body = new FormData()
      body.append( 'api_key', response.params.api_key )
      body.append( 'public_id', response.params.public_id )
      body.append( 'signature', response.params.signature )
      body.append( 'timestamp', response.params.timestamp )
      body.append( 'url', response.url )
      body.append( 'file', image )

      const uploadResponse = await axios.post( response.url, body )

      return uploadResponse.data.secure_url
    } catch ( error ) {
      throw new Error( error )
    }
  }

  async getSignedData( filename ) {
    return await this._fetch( 'POST', '/getUploadSignedUrl', { filename } )
  }

  async getEmailTemplates() {
    return await this._fetch( 'GET', '/template' )
  }

  async createEmailTemplate( template ) {
    return await this._fetch( 'POST', '/template', template )
  }

  async editEmailTemplate( values ) {
    const templateId = values._id
    return await this._fetch( 'PUT', `/template/${ templateId }`, values )
  }

  async getDrafts() {
    return await this._fetch( 'GET', '/draft' )
  }

  async getSingleDraft( draftId ) {
    return await this._fetch( 'GET', `/draft/${ draftId }` )
  }

  async updateDraft( draftId, values ) {
    return await this._fetch( 'PUT', `/draft/${ draftId }`, values )
  }

  async getUser() {
    return await this._fetch( 'GET', '/user' )
  }

  async getProfile() {
    return await this._fetch( 'GET', '/profile' )
  }

  async updateProfile( data ) {
    let constructedData = data.profile
    const profileId = data.profile._id
    const { picture, profile: { firstName } } = data

    delete data.profile._id

    try {
      if ( !_.isNil( picture ) ) {
        const profilePicUrl = await this._uploadImage( picture, firstName )
        constructedData = {
          ...constructedData,
          profilePicUrl: profilePicUrl
        }
      }

      return await this._fetch( 'PUT',  `/profile/${ profileId }`, constructedData )
    } catch ( error ) {
      console.error( 'Error updating profile', error )
    }
  }

  async deleteDraft( draftId ) {
    return await this._fetch( 'DELETE', `/draft/${ draftId }` )
  }

  async sendEmail( values ) {
    const draftId = values.draftId
    delete values.draftId

    return await this._fetch( 'POST', `/draft/${ draftId }/send`, values )
  }

  async loadUserData() {
    const userData = await this._fetch( 'GET', '/auth/user' )
    const newToken = {
      token: this._sessionToken,
      ...userData
    }
    appAuthToken.storeSessionToken( newToken )
    return newToken
  }

  async getEvents() {
    return await this._fetch( 'GET', '/event' )
  }

  async createEvent( event ) {
    return await this._fetch( 'POST', '/event', event )
  }

  async _fetch( method, endpoint, body ) {

    const constructedUrl = `${ this.API_BASE_URL }${ endpoint }`

    try {
      const response = await axios( {
        method: method,
        url: constructedUrl,
        headers: { 'Authorization': `Bearer ${ this._sessionToken }` },
        data: body
      } )

      if ( response.status >= 200 || response.status <= 299 ) {
        return response.data
      }
      if ( response.status >= 400 || response.status <= 499 ) {
        return false
      }
      throw ( response )
    } catch ( error ) {
      console.error( `Error fetching ${ method }: ${ endpoint }`, error )
      throw new Error( error )
    }
  }
}

export const Backend = new AppBackend()

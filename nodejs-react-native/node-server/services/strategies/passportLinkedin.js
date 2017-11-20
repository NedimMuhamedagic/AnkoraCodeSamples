const passport = require( 'passport' )
const LinkedinStrategy = require( 'passport-linkedin-oauth2' ).Strategy
const mongoose = require( 'mongoose' )
const User = mongoose.model( 'users' )
const keys = require( '../../config/keys' )
const axios = require( 'axios' )

const LINKEDIN_STRATEGY_OPTIONS = {
  clientID: keys.linkedinClientID,
  clientSecret: keys.linkedinClientSecret,
  callbackURL: '/auth/linkedin/callback',
  proxy: true,
}

const LINKEDIN_PEOPLE_API_BASE = 'https://api.linkedin.com/v1/people/~'

const REQUEST_FIELDS = [
  "id",
  "first-name",
  "location",
  "last-name",
  "headline",
  "picture-url",
  "email-address",
  "public-profile-url",
  "positions",
]

const LINKEDIN_STRATEGY_CALLBACK =
  async ( accessToken, refreshToken, profile, done ) => {
    const error = null

    try {
      let existingUser = await User.findOne( { linkedinId: profile.id } )

      if ( existingUser ) {
        done( error, existingUser )
      } else {
        const linkedinResponse = await axios.get( `${ LINKEDIN_PEOPLE_API_BASE }:(${ REQUEST_FIELDS.join() })?oauth2_access_token=${ accessToken }&format=json` )

        const userData = {
          linkedinId: profile.id,
          linkedinProfileData: linkedinResponse.data
        }

        let savedUser = await new User( userData ).save()
        done( error, savedUser )
      }
    } catch ( err ) {
      done( err, null )
    }

  }

const passportLinkedin = () => {
  passport.use(
    new LinkedinStrategy(
      LINKEDIN_STRATEGY_OPTIONS,
      LINKEDIN_STRATEGY_CALLBACK
    )
  )
}

export default passportLinkedin

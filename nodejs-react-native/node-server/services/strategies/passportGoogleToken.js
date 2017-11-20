import passport from 'passport'
import  GooglePlusTokenStrategy from 'passport-google-plus-token'
import jwt from 'jsonwebtoken'
// const GoogleStrategy = require( 'passport-google-oauth20' )
const mongoose = require( 'mongoose' )
const User = mongoose.model( 'users' )
const Profile = mongoose.model( 'profiles' )
const keys = require( '../../config/keys' )
import { jwtOptions } from '../../config/keys'
import { generateDefaultTemplatesFromUserId } from '../../controllers/template.controller'

const GOOGLE_STRATEGY_OPTIONS = {
  clientID: keys.googleClientID,
  clientSecret: keys.googleClientSecret,
  passReqToCallback: true
}

const GOOGLE_STRATEGY_CALLBACK =
  async ( req, accessToken, refreshToken, profile, done ) => {
    const error = null
    try {
      let existingUser = await User.findOne( { googleId: profile.id } )
      if ( existingUser ) {
        const jwtPayload = { id: existingUser._id, _id: existingUser._id, username: existingUser.email }
        const token = jwt.sign( jwtPayload, jwtOptions.secretOrKey )
        existingUser = JSON.parse( JSON.stringify( existingUser ) )
        existingUser.token = token
        return done( error, existingUser )
      } else {
        const profileData = {
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          profilePicUrl: profile._json.image.url,
          email: profile.emails[ 0 ].value,
        }

        const newProfile = new Profile( profileData )

        const userData = {
          googleId: profile.id,
          email: profile.emails[ 0 ].value,
          provider: 'google',
          googleProfileData: profile,
          profiles: [ newProfile._id ],
          settings: {
            twillioEnabled: false,
            currentProfile: newProfile._id,
            developmentMode: false,
          }
        }
        let savedUser = new User( userData )

        newProfile.userUid = savedUser._id

        try {
          await newProfile.save()
        } catch ( profileError ) {
          console.warn( 'Error saving user profile', profileError )
          return done( error )
        }

        try {
          await savedUser.save()
          await generateDefaultTemplatesFromUserId( savedUser._id )
        } catch ( error ) {
          console.error( 'Error saving user', error )
          done( error )
        }

        const jwtPayload = { id: savedUser._id, _id: savedUser._id, username: savedUser.email }
        const token = jwt.sign( jwtPayload, jwtOptions.secretOrKey )
        savedUser = JSON.parse( JSON.stringify( savedUser ) )
        savedUser.token = token
        return done( error, savedUser )
      }
    } catch ( err ) {
      done( err )
    }

  }

const passportGoogleToken = () => {
  passport.use(
    new GooglePlusTokenStrategy(
      GOOGLE_STRATEGY_OPTIONS,
      GOOGLE_STRATEGY_CALLBACK
    )
  )
}

export default passportGoogleToken

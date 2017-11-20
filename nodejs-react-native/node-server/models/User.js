import validator from 'validator'
import crypto from 'crypto'

const mongoose = require( 'mongoose' )
const { Schema } = mongoose

function validatePassword( password ) {
  const passwordTest = new RegExp( '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})' )
  return this.provider !== 'local' || passwordTest.test( password )
}

function validateEmail( email ) {
  return ( ( this.provider !== 'local' && !this.updatedAt )
    || validator.isEmail( email, { require_tld: false } ) )
}

const userSchema = new Schema( {
  email: {
    type: String,
    index: {
      unique: true,
      sparse: true,
    },
    lowercase: true,
    trim: true,
    default: '',
    validate: [ validateEmail, 'Please fill a valid email address' ],
  },
  profiles: {
    type: [ Schema.ObjectId ],
    ref: 'profiles'
  },
  provider: {
    type: String,
    required: 'Provider is required',
  },
  updatedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: {
    type: String,
  },
  password: {
    type: String,
    default: '',
    validate: [ validatePassword, 'Please create a strong password, min. 6 chars in length' ],
  },
  salt: String,
  googleId: String,
  linkedinId: String,
  settings: {
    twilioEnabled: {
      type: Boolean,
      default: false
    },
    currentProfile: {
      type: Schema.ObjectId,
      ref: 'profiles'
    },
    developmentMode: Boolean,
    connectionGridEnabled: {
      type: Boolean,
      default: false
    }
  }
} )

/**
 * Hook a pre save method to hash the password
 */
userSchema.pre( 'save', function preSave( next ) {
  if ( this.password && this.isModified( 'password' ) ) {
    this.salt = crypto.randomBytes( 16 ).toString( 'base64' )
    this.password = this.hashPassword( this.password )
  }
  next()
} )

/**
 * Create instance method for hashing a password
 */
userSchema.methods.hashPassword = function hashPassword( password ) {
  if ( this.salt && password ) {
    return crypto.pbkdf2Sync( password, new Buffer( this.salt, 'base64' ), 10000, 64, 'SHA1' ).toString( 'base64' )
  }
  return password
}

/**
 * Create instance method for authenticating user
 */
userSchema.methods.authenticate = function authenticate( password ) {
  return this.password === this.hashPassword( password )
}

export default mongoose.model( 'users', userSchema )

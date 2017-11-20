const twilioLib = require( 'twilio' )
const keys = require( '../config/keys' )

try {
  let twilio = new twilioLib.Twilio( keys.twilioAccountSid, keys.twilioAuthToken )
  module.exports = { enabled: true, twilio: twilio }
} catch ( error ) {
  console.warn( "Error when initializing Twilio. Perhaps you need to set up the Twilio keys in the environment? The app will work, but Twilio functions will be disabled.", error )
  module.exports = { enabled: false }
}

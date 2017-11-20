import CloudinaryUrl from 'cloudinary-url'
const { cloudinaryKey, cloudinarySecret, cloudinaryName } = require( '../config/keys' )

export function getUploadSignedUrl( req, res ) {
  const public_id = req.body.filename
  var urlGenerator = new CloudinaryUrl( cloudinaryKey, cloudinarySecret, cloudinaryName )

  const cloudinaryData = urlGenerator.sign( { public_id } )
  return res.send( { success: cloudinaryData } )
}

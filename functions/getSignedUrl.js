const { app } = require('./app')
const { getStorage } = require('firebase-admin/storage')

const bucket = getStorage(app).bucket()

module.exports.getSignedUrl = async (path, minutes = 60) => {
  try {
    const [url] = await bucket.file(path).getSignedUrl({
      action: 'read',
      expires: new Date(Date.now() + minutes * 60 * 1000)
    })

    return url
  } catch (error) {
    console.log(error)

    return null
  }
}

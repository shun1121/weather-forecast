const jwt = require("jsonwebtoken")

APP_SECRET = 'Graphql-is-awesome'

function getTokenPayload(token) {
  return jwt.verify(token, APP_SECRET)
}

function getUserId (req, authToken) {
  if(req) {
    const authHeader = req.headers.authorization
    if(authHeader) {
      const token = authHeader.replace('Bearer', '')
      if(!token) {
        throw new Error('cannot find token')
      }
      const { userId } = getTokenPayload(token)
      return userId
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(token)
    return userId
  }

  throw new Error('you do not have a permission')
}

module.exports = {
  APP_SECRET,
  getUserId,
}

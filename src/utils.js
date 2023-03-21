const jwt = require("jsonwebtoken")

// 署名(ランダム文字列)するための秘密鍵的なもの
APP_SECRET = 'Graphql'

// トークンを復号するための関数
function getTokenPayload(token) {
  // トークン化されたものの前の情報(user.id)を秘密鍵(APP_SECRET)で復号
  return jwt.verify(token, APP_SECRET)
}

// ユーザーIDを取得するための関数
// reqはgraphqlのapiを叩くときに渡す引数やheader情報餅のリクエストなど
function getUserId (req, authToken) {
  if(req) {
    // ヘッダーを確認する。認証権限があるか。
    const authHeader = req.headers.authorization // authorizationは"Bearer_token"の形式
    // 権限があるなら＝authHeaderに値があるなら。
    if(authHeader) {
      const token = authHeader.replace('Bearer', '')
      if(!token) {
        throw new Error('cannot find token')
      }
      // そのトークンを復号する
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

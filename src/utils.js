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
    }
  }
}
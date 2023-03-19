const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// 署名(ランダム文字列)するための秘密鍵的なもの
APP_SECRET = 'Graphql'

// ユーザの新規登録のリゾルバ
async function signup(parent, args, context) {
  // パスワードの設定
  const password = await bcrypt.hash(args.password, 10)

  // ユーザの新規作成 prismaの中のuserモデルをもとに作成
  const user = await context.prisma.user.create({
    data: {
      ...args,
      password,
    }
  })
  // userのidを使ってランダム文字列(トークン)を作成
  const token = jwt.sign({ userId: user.id }, APP_SECRET)
  
  return {
    token,
    user
  }
}
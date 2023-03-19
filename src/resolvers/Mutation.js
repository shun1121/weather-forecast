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

// ユーザログイン
async function login(parent, args, context) {
  // prismaのfindUniqueメソッドを使用
  const user = await context.prisma.user.findUnique({
    where: { email: args.email }
  })
  if(!user) {
    throw new Error('No such user exists')
  }

  // パスワードの比較
  const valid = await bcrypt.compare(args.password, user.password)
  if(!valid) {
    throw new Error('Password does not match')
  }

  // パスワードが正しい時
  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user
  }
}

// ニュースを投稿するリゾルバ
async function post(parent, args, context) {
  return await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description
    }
  })
}
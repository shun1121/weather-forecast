const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { APP_SECRET } = require('../utils')

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
  const { userId } = context

  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      // postedBy: userId ← userIdどこから取得するの？ → contextに設定したuserId (server.js)
      postedBy: {connect: {id: userId}}
    }
  })
  // 送信(受取手のNEW_LINKにnewLinkを送信)
  context.pubsub.publish('NEW_LINK', newLink)
  return newLink
}

async function vote(parent, args, context) {
  const userId = context.userId

  const vote = context.prisma.vote.findUnique({
    where: {
      linkId_userId: {
        linkId: Number(args.linkId),
        userId: userId,
      }
    }
  })

  // 2回投票を防ぐ
  if(Boolean(vote)) {
    throw new Error(`already voted: ${args.linkId}`)
  }

  // 投票する
  const newVote = context.prisma.vote.create({
    data: {
      // schema.prismaのスキーマ設定でvoteはuserとの関係があるからconnectで繋げる。contextから取ってきた認証idを使う
      user: {connect: { id: userId }},
      link: {connect: { id: Number(args.linkId)}}
    },
  })
  // 送信
  context.pubsub.publish("NEW_VOTE", newVote)
  return newVote
}

module.exports = {
  signup,
  login,
  post,
  vote,
}
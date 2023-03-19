const bcrypt = require('bcrypt')

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
}
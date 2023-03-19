// データベースにアクセスするためのクライアントライブラリ
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const newLink = await prisma.link.create({
    data: {
      description: 'learn something on udemy',
      url: 'www.something.com'
    }
  })
  const allLinks = await prisma.link.findMany() // schema.prismaのLinkエンティディ。小文字でも指定できる。
  console.log(allLinks)
}

main().catch((e) => {
  throw e
}).finally(async () => {
  // データベース接続を閉じる
  prisma.$disconnect
})